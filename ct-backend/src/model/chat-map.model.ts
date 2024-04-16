import seq from "@src/database/seq.database";
import Users from "./users.model";
import { DataTypes } from "sequelize";

export interface ChatMapModel {
  senderId: number;
  receiverId: number;
  content: string
}

const ChatMap = seq.define('chat_maps', {
  content: {
    type: DataTypes.STRING,
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
