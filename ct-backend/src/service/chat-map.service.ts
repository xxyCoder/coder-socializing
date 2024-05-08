import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import ChatMap, { ChatMapModel } from "@src/model/chat-map.model";

class ChatMapService {
  async create({ senderId, receiverId, content }: { senderId: number, receiverId: number, content: string }) {
    const res = await ChatMap.findOne({
      where: {
        senderId,
        receiverId
      }
    });
    if (res?.dataValues) {
      return ChatMap.update({ content, unreadCnt: res.dataValues.unreadCnt + 1 }, {
        where: {
          senderId,
          receiverId
        }
      });
    }
    return ChatMap.create({ senderId, receiverId, content, unreadCnt: 1 });
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
  clearUnreadCnt({ senderId, receiverId }: { senderId: number, receiverId: number }) {
    return ChatMap.update({ unreadCnt: 0 }, {
      where: { senderId, receiverId }
    })
  }
}

export default new ChatMapService()
