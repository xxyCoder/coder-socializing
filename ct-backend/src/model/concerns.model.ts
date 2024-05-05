import seq from "@src/database/seq.database";
import Users from "./users.model";

export interface ConcernModel {
  id: number | null;
  follower: number; // 关注者
  followed: number; // 被关注者
}

const Concern = seq.define('concerns', {}, {
  paranoid: true,
  deletedAt: true
})

Concern.belongsTo(Users, { foreignKey: 'follower' });
Concern.belongsTo(Users, { foreignKey: 'followed' });

// 模型同步，创建该表
Concern.sync({
  force: false // true表示数据库如果存在该表，则先删除
})

export default Concern;
