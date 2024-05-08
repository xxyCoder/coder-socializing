import { Request, Response } from "express"
import ChatService from "@src/service/chat.service"
import ChatMapService from "@src/service/chat-map.service"
import { serviceError, successObj } from "@src/constant/resp.constant"
import { getScoket } from "@src/correspondence"
import UserService from "@src/service/users.service"
import ConcernsService from "@src/service/concerns.service"
import { getSSEConn } from "@src/router/sse.router"
import { InteractionTypeMap, NotifyStateMap } from "@src/constant/notify"

const { create, find, modifyState } = ChatService
const { find: getChatMap, clearUnreadCnt } = ChatMapService
const { search: getIsFollow } = ConcernsService;
const { precisionFind } = UserService

class ChatController {
  addChatBar(req: Request, resp: Response) {
    const { receiverId, content: _con } = req.body
    const content = decodeURIComponent(_con)
    const senderId = Number(req.query.id)

    create({ id: null, identity: `${Math.min(receiverId, senderId)}&${Math.max(senderId, receiverId)}`, content, senderId, receiverId, state: NotifyStateMap.unread })
      .then(chat => {
        const socket = getScoket(receiverId)
        if (socket) {
          socket.emit('reply', {
            senderId,
            content,
            time: chat.dataValues.createdAt,
          })
        }
        const sse = getSSEConn(receiverId)
        sse && sse.write({ data: { type: InteractionTypeMap.chat } })
        resp.send(successObj)
      })
      .catch(err => {
        console.log(`发送聊天记录失败:${err}`)
        resp.send(serviceError)
      })
  }
  getChatContent(req: Request, resp: Response) {
    const senderId = Number(req.query.id), page_num = Number(req.query.page_num), receiverId = Number(req.query.receiverId)

    find({ identity: `${Math.min(senderId, receiverId)}&${Math.max(senderId, receiverId)}`, page_num })
      .then(chats => {
        resp.send({
          code: 200,
          data: {
            chatList: chats.map(chat => ({
              content: chat.dataValues.content,
              date: chat.dataValues.createdAt,
              id: chat.dataValues.senderId
            }))
          }
        })
      })
      .catch(err => {
        console.log(`获取${receiverId}的聊天记录失败：${err}`)
        resp.send(serviceError)
      })
  }
  getChatList(req: Request, resp: Response) {
    const id = Number(req.query.id), page_num = Number(req.query.page_num)

    Promise.all([getChatMap({ senderId: id, page_num }), getChatMap({ receiverId: id, page_num })])
      .then(async ([res1, res2]) => {
        const st = new Map<string, { userId: number, content: string, time: number, username: string, avatarSrc: string | null, isFollower: boolean, unreadCnt: number }>()
        const res = res1.concat(res2)
        res.sort((a, b) => +new Date(a.dataValues.updatedAt) - +new Date(b.dataValues.updatedAt))
        for (let i = 0, len = res.length; i < len; ++i) {
          const map = res[i]
          const user = await precisionFind({ id: id === map.dataValues.senderId ? map.dataValues.receiverId : map.dataValues.senderId })
          const isFollower = await getIsFollow({ viewer_id: user?.dataValues.id, id })
          const identity = `${Math.min(map.dataValues.senderId, map.dataValues.receiverId)}&${Math.max(map.dataValues.senderId, map.dataValues.receiverId)}`
          const { unreadCnt } = st.get(identity) || { unreadCnt: 0 }
          st.set(identity, {
            userId: user?.dataValues.id,
            content: map.dataValues.content,
            time: +new Date(map.dataValues.updatedAt),
            username: user?.dataValues.username,
            avatarSrc: user?.dataValues.avatarSrc,
            isFollower,
            unreadCnt: id === map.dataValues.receiverId ? map.dataValues.unreadCnt : unreadCnt
          })
        }

        resp.send({
          code: 200,
          msg: '获取成功',
          data: {
            chatList: [...st.values()]
          }
        })
      })
      .catch(err => {
        console.log(`寻找记录失败：${err}`)
        resp.send(serviceError)
      })
  }
  changeState(req: Request, resp: Response) {
    const { senderId } = req.body
    const receiverId = Number(req.query.id)

    Promise.all([modifyState({ receiverId, senderId, state: NotifyStateMap.read }), clearUnreadCnt({ receiverId, senderId })])
      .then(([cnt]) => {
        console.log(cnt)
        cnt ? resp.send(successObj) : resp.send({ code: 200, msg: '失败' })
      })
      .catch(err => {
        console.error(`清除聊天未读数量失败：${err}`)
        resp.send(serviceError)
      })
  }
}

export default new ChatController()
