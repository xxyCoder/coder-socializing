import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Users from "./users.model";

export interface ChatModel {
  senderId: number;
  receiverId: number;
  content: string;
  identity: string;
}

const Chat = seq.define('chats', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  identity: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  createdAt: true
})

Chat.belongsTo(Users, { foreignKey: 'senderId' });
Chat.belongsTo(Users, { foreignKey: 'receiverId' });

Chat.sync({
  force: false
})

export default Chat;
