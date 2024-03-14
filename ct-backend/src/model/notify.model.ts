import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Users from "./users.model";

export interface NotifyModel {
    id: number | null
    noteId: number | null;
    userId: number;
    commentId: number | null;
    replyCommentId: number | null;
    type: number;
    state: number;
}

const Notifies = seq.define('notifies', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "用户id"
    },
    noteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "笔记id"
    },
    commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "评论的id"
    },
    replyCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "被回复评论的id"
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '通知的类型'
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '已读或者未读'
    }
}, {
    createdAt: true
})

Notifies.belongsTo(Users, { foreignKey: 'userId' });

// 模型同步，创建该表
Notifies.sync({
    force: false // 数据库如果存在该表，则先删除
})

export default Notifies;
