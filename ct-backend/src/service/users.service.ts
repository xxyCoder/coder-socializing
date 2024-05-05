import Users, { UserModel } from "@src/model/users.model";
import { Op } from "sequelize";
import bcrpty from 'bcryptjs'
import { pageType } from "@src/constant/types";
import { pageSize } from "@src/constant/resp.constant";

class UserService {
  create({ username, password, account }: UserModel) {
    return Users.create({ username, password, account, });
  }
  update({ account, id, newPassword, biography, username, avatarSrc }: Partial<UserModel & { newPassword: string }>) {
    const whereOp = { id, account };
    const updateOp = {};
    newPassword && Object.assign(updateOp, { password: newPassword });
    biography && Object.assign(updateOp, { biography });
    avatarSrc && Object.assign(updateOp, { avatarSrc });
    username && Object.assign(updateOp, { username });
    return Users.update(updateOp, { where: whereOp });
  }
  find({ page_num, user }: { user: string } & pageType) {
    const whereOp = {};
    if (user) {
      user = decodeURIComponent(user)
      let query = ''
      for (let i = 0, n = user.length; i < n; ++i) {
        query += `%${user[i]}`
      }
      query += '%'
      Object.assign(whereOp, {
        [Op.or]:
        {
          username: { [Op.like]: query },
          id: { [Op.like]: query }
        }
      });
    }

    return Users.findAll({ offset: page_num * pageSize, limit: pageSize, where: whereOp });
  }
  precisionFind({ username, account, id }: Partial<UserModel>) {
    const whereOp = {};
    username && Object.assign(whereOp, { username });
    account && Object.assign(whereOp, { account });
    id && Object.assign(whereOp, { id });

    return Users.findOne({ where: whereOp });
  }
  async verify({ account, id, password }: Partial<UserModel>) {
    if (!password) return Promise.resolve({ sc: false, id: null, username: "", intro: "", avatarSrc: "", account: "" });
    const whereOp = {};
    account && Object.assign(whereOp, { account });
    id && Object.assign(whereOp, { id });

    const res = await Users.findOne({ where: whereOp });
    if (!res || !res.dataValues) return { sc: false, id: null, username: "" };
    const sc = bcrpty.compareSync(password, res.dataValues.password);
    return { sc, id: res.dataValues.id, username: res.dataValues.username, intro: res.dataValues.biography, avatarSrc: res.dataValues.avatarSrc, account: res.dataValues.account };
  }
}

export default new UserService()