import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";

export interface ConcernModel {
  id: number | null;
  follower: number;
  followed: number;
}

const Concern = seq.define('concerns', {
  follower: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '关注者'
  },
  followed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '被关注者'
  }
}, {
  timestamps: false // 静止添加其他列（默认有插入、删除列的时间）
})

// 模型同步，创建该表
Concern.sync({
  force: false // true表示数据库如果存在该表，则先删除
})

export default Concern;
