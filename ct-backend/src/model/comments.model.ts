import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Notes from "./notes.model";
import Users from "./users.model";

export interface CommentModel {
  id: number | null;
  content: string;
  targetCommentId: number | null;
  noteId: number;
  userId: number;
  rootCommentId: number | null;
}

const Comments = seq.define('comments', {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '评论内容'
  },
  targetCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '回复的评论id，为null表示主评论'
  },
  rootCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '回复的评论id的顶级id'
  }
}, {
  updatedAt: true,
  paranoid: true,
  deletedAt: true
})

Comments.belongsTo(Notes, { foreignKey: 'noteId' });
Comments.belongsTo(Users, { foreignKey: 'userId' });

// 模型同步，创建该表
Comments.sync({
  force: false // true表示数据库如果存在该表，则先删除
})

export default Comments;
