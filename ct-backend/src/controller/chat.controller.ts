import { Request, Response } from "express"
import ChatService from "@src/service/chat.service"
import ChatMapService from "@src/service/chat-map.service"
import { serviceError, successObj } from "@src/constant/resp.constant"
import { getScoket } from "@src/correspondence"
import UserService from "@src/service/users.service"
import ConcernsService from "@src/service/concerns.service"

const { create, find } = ChatService
const { find: getChatMap } = ChatMapService
const { search: getIsFollow } = ConcernsService;
const { precisionFind } = UserService

class ChatController {
  addChatBar(req: Request, resp: Response) {
    const { receiverId, content } = req.body
    const senderId = Number(req.query.id)

    create({ id: null, identity: `${Math.min(receiverId, senderId)}&${Math.max(senderId, receiverId)}`, content, senderId, receiverId })
      .then(chat => {
        const socket = getScoket(receiverId)
        if (socket) {
          socket.emit('reply', {
            senderId,
            content,
            time: chat.dataValues.createdAt,
          })
        }
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
        const st = new Map<string, { userId: number, content: string, time: number, username: string, avatarSrc: string | null, isFollower: boolean }>()
        const res = res1.concat(res2)
        res.sort((a, b) => +new Date(a.dataValues.updatedAt) - +new Date(b.dataValues.updatedAt))
        for (let i = 0, len = res.length; i < len; ++i) {
          const map = res[i]
          const user = await precisionFind({ id: id === map.dataValues.senderId ? map.dataValues.receiverId : map.dataValues.senderId })
          const isFollower = await getIsFollow({ viewer_id: user?.dataValues.id, id })
          st.set(`${Math.min(map.dataValues.senderId, map.dataValues.receiverId)}&${Math.max(map.dataValues.senderId, map.dataValues.receiverId)}`, {
            userId: user?.dataValues.id,
            content: map.dataValues.content,
            time: +new Date(map.dataValues.updatedAt),
            username: user?.dataValues.username,
            avatarSrc: user?.dataValues.avatarSrc,
            isFollower
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
}

export default new ChatController()
