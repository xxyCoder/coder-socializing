import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Notes from "./notes.model";

export interface CommentModel {
    id: number | null;
    content: string;
    atUsers: string;
    targetCommentId: number | null;
    noteId: number;
    likes: number;
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
        comment: '回复的评论id'
    },
    like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '评论点赞数'
    }
}, {
    timestamps: false // 静止添加其他列（默认有插入、删除列的时间）
})

Comments.belongsTo(Notes, { foreignKey: 'noteId' });

// 模型同步，创建该表
Comments.sync({
    force: false // true表示数据库如果存在该表，则先删除
})

export default Comments;
