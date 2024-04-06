import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Chat, { ChatModel } from "@src/model/chat.model";
import Users from "@src/model/users.model";
import ChatMapService from "./chat-map.service";
import { Op } from "sequelize";

const { create: addChatMapRec } = ChatMapService

class ChatService {
    find({ identity, senderId, page_num }: Partial<ChatModel> & pageType) {
        return Chat.findAll({
            where: { identity, senderId },
            offset: page_num * pageSize,
            limit: pageSize,
            include: [Users],
            order: [['createdAt', 'DESC']]
        })
    }
    create({ identity, senderId, content, receiverId }: ChatModel) {
        addChatMapRec({ receiverId, senderId })
        return Chat.create({ identity, senderId, content, receiverId })
    }
    findLatest(identities: string[]) {
        return Chat.findAll({
            include: [Users],
            group: 'identity',
            order: [['createdAt', 'DESC']],
            limit: 1,
            where: { identity: { [Op.in]: identities } },
        })
    }
}

export default new ChatService()