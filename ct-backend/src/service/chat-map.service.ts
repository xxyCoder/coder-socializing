import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import ChatMap, { ChatMapModel } from "@src/model/chat-map.model";

class ChatMapService {
  create({ senderId, receiverId, content }: Partial<ChatMapModel>) {
    ChatMap.findOne({
      where: {
        senderId,
        receiverId
      }
    }).then(res => {
      if (res?.dataValues) {
        ChatMap.update({ content }, {
          where: {
            senderId,
            receiverId
          }
        })
        return
      }
      ChatMap.create({ senderId, receiverId, content })
    })
  }
  find({ receiverId, page_num, senderId }: Partial<ChatMapModel> & pageType) {
    const whereOp = {}
    receiverId && Object.assign(whereOp, { receiverId })
    senderId && Object.assign(whereOp, { senderId })

    return ChatMap.findAll({
      where: whereOp,
      offset: page_num * pageSize,
      limit: pageSize,
      order: [['updatedAt', 'ASC']]
    })
  }
}

export default new ChatMapService()
