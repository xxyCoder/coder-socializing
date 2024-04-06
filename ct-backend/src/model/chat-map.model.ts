import seq from "@src/database/seq.database";
import Users from "./users.model";
import { DataTypes } from "sequelize";

export interface ChatMapModel {
    senderId: number;
    receiverId: number;
    curDate: number;
}

const ChatMap = seq.define('chat_maps', {
    curDate: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

ChatMap.belongsTo(Users, { foreignKey: 'senderId' });
ChatMap.belongsTo(Users, { foreignKey: 'receiverId' });

ChatMap.sync({
    force: false
})

export default ChatMap;
