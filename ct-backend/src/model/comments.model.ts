import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Notes from "./notes.model";
import Users from "./users.model";

export interface CommentModel {
    id: number | null;
    content: string;
    atUsers: string;
    targetCommentId: number | null;
    noteId: number;
    userId: number;
}

const Comments = seq.define('comments', {
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '评论内容'
    },
    atUsers: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '@的用户'
    },
    targetCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '回复的评论id，为null表示主评论'
    }
}, {
    timestamps: true
})

Comments.belongsTo(Notes, { foreignKey: 'noteId' });
Comments.belongsTo(Users, { foreignKey: 'userId' });

// 模型同步，创建该表
Comments.sync({
    force: false // true表示数据库如果存在该表，则先删除
})

export default Comments;
