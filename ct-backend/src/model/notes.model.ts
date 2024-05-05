import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Users from "./users.model";

export interface NoteModel {
  id: number | null;
  title: string;
  content: string;
  mediaList?: string;
  tag?: string;
  userId: number | null,
  isVideo: boolean
}

const Notes = seq.define('notes', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '标题'
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '内容'
  },
  mediaList: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '图片路径'
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '笔记标签'
  },
  isVideo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '是否是视频'
  }
})

// 指定外键
Notes.belongsTo(Users, { foreignKey: 'userId' });
// 模型同步，创建该表
Notes.sync({
  force: false // true表示数据库如果存在该表，则先删除
})

export default Notes;
