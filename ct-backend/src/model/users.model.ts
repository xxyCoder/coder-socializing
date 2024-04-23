import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";

export interface UserModel {
  id: number | null;
  username: string;
  account: string;
  password: string;
  biography?: string;
  avatarSrc?: string;
}

const Users = seq.define('users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "用户名"
  },
  account: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "账户"
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "密码"
  },
  biography: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "个人简介"
  },
  avatarSrc: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "头像路径"
  }
}, {
  timestamps: false // 静止添加其他列（默认有插入、删除列的时间）
})

// 模型同步，创建该表
Users.sync({
  force: false // 数据库如果存在该表，则先删除
})

export default Users;
