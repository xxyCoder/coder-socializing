import seq from "@src/database/seq.database";
import Notes from "./notes.model";
import Users from "./users.model";
import { DataTypes } from "sequelize";

export interface LikeOrCollectModel {
  id: number | null;
  noteId: number;
  userId: number;
  type: 'collect' | 'like'
}

const LikeOrCollects = seq.define('like_collect', {
  type: {
    type: DataTypes.ENUM('collect', 'like')
  }
}, {
  paranoid: true,
  deletedAt: true
})

LikeOrCollects.belongsTo(Notes, { foreignKey: 'noteId' })
LikeOrCollects.belongsTo(Users, { foreignKey: 'userId' })
// 模型同步，创建该表
LikeOrCollects.sync({
  force: false // true表示数据库如果存在该表，则先删除
})

export default LikeOrCollects;
