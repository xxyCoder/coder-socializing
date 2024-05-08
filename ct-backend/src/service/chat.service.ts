import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Chat, { ChatModel } from "@src/model/chat.model";
import ChatMapService from "./chat-map.service";
import { NotifyStateMap } from "@src/constant/notify";

const { create: addChatMapRec } = ChatMapService

class ChatService {
  find({ identity, senderId, page_num }: Partial<ChatModel> & pageType) {
    const whereOp = {}
    identity && Object.assign(whereOp, { identity })
    senderId && Object.assign(whereOp, { senderId })
    return Chat.findAll({
      where: whereOp,
      offset: page_num * pageSize,
      limit: pageSize,
      order: [['createdAt', 'DESC']]
    })
  }
  create({ identity, senderId, content, receiverId, state }: ChatModel) {
    addChatMapRec({ receiverId, senderId, content })
    return Chat.create({ identity, senderId, content, receiverId, state })
  }
  countUnread({ receiverId, senderId }: { receiverId: number, senderId?: number }) {
    const whereOp = { receiverId, state: NotifyStateMap.unread }
    senderId && Object.assign(whereOp, { senderId })
    return Chat.count({
      where: whereOp
    })
  }
  modifyState({ receiverId, senderId, state }: { receiverId: number, senderId: number, state: number }) {
    return Chat.update({ state }, {
      where: { receiverId, senderId }
    })
  }
}

export default new ChatService()