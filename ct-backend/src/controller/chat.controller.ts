import { Request, Response } from "express"
import ChatService from "@src/service/chat.service"
import ChatMapService from "@src/service/chat-map.service"
import { serviceError, successObj } from "@src/constant/resp.constant"
import { getScoket } from "@src/correspondence"

const { create, find, findLatest } = ChatService
const { find: getChatMap } = ChatMapService

class ChatController {
    addChatBar(req: Request, resp: Response) {
        const { receiverId, content } = req.body
        const senderId = Number(req.query.id)

        create({ identity: `${receiverId}&${senderId}`, content, senderId, receiverId })
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
        const { page_num, receiverId } = req.body
        const senderId = Number(req.query.id)

        find({ senderId, identity: `${Math.min(senderId, receiverId)}&${Math.max(senderId, receiverId)}`, page_num })
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
            .then(([res1, res2]) => {
                const st = new Set<string>()
                res1.concat(res2).forEach(map => {
                    st.add(`${Math.min(map.dataValues.senderId, map.dataValues.receiverId)}&${Math.max(map.dataValues.senderId, map.dataValues.receiverId)}`)
                })

                findLatest([...st])
                    .then(res => {
                        console.log(res, 'result')
                        resp.send({
                            code: 200,
                            data: {
                                chatList: res.map(c => ({

                                }))
                            }
                        })
                    })
                    .catch(err => {
                        console.log(`寻找记录失败：${err}`)
                        resp.send(serviceError)
                    })
            })
            .catch(err => {
                console.log(`寻找记录失败：${err}`)
                resp.send(serviceError)
            })
    }
}

export default new ChatController()
