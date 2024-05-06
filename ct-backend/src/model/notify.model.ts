import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Users from "./users.model";
import Notes from "./notes.model";
import Comments from "./comments.model";

export interface NotifyModel {
  id: number | null
  noteId: number | null;
  userId: number;
  commentId: number | null; // 评论的id
  replyCommentId: number | null;  // 回复的id
  type: number;
  state: number;
}

const Notifies = seq.define('notifies', {
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
})

Notifies.belongsTo(Users, { foreignKey: 'userId' });
Notifies.belongsTo(Notes, { foreignKey: 'noteId' });
Notifies.belongsTo(Comments, { foreignKey: 'commentId' });

// 模型同步，创建该表
Notifies.sync({
  force: false // 数据库如果存在该表，则先删除
})

export default Notifies;
