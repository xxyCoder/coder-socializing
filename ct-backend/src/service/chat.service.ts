import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Chat, { ChatModel } from "@src/model/chat.model";
import ChatMapService from "./chat-map.service";

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
      order: [['createdAt', 'ASC']]
    })
  }
  create({ identity, senderId, content, receiverId }: ChatModel) {
    addChatMapRec({ receiverId, senderId, content })
    return Chat.create({ identity, senderId, content, receiverId })
  }
}

export default new ChatService()