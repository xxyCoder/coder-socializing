import seq from "@src/database/seq.database";
import Users from "./users.model";
import { DataTypes } from "sequelize";

export interface ChatMapModel {
  id: number | null;
  senderId: number;
  receiverId: number;
  content: string;
  unreadCnt: number;
}

const ChatMap = seq.define('chat_maps', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unreadCnt: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  updatedAt: true
})

ChatMap.belongsTo(Users, { foreignKey: 'senderId' });
ChatMap.belongsTo(Users, { foreignKey: 'receiverId' });

ChatMap.sync({
  force: false
})

export default ChatMap;
