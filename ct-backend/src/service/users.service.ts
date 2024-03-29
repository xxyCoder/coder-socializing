import Users, { UserModel } from "@src/model/users.model";
import { Op } from "sequelize";
import bcrpty from 'bcryptjs'
import { categories, pageType } from "@src/constant/types";
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
    remove({ id }: Partial<UserModel>) {
        return Users.destroy({ where: { id } });
    }
    find({ page_num, username, category, id }: { category: categories } & Partial<UserModel> & pageType) {
        const whereOp = {};
        username && Object.assign(whereOp, { username: { [Op.like]: `%${username}%` } });  // 实现模糊查询
        id && Object.assign(whereOp, { id });
        return Users.findAll({ offset: (page_num - 1) * pageSize, limit: pageSize, where: whereOp });
    }
    precisionFind({ username, account, id }: Partial<UserModel>) {
        const whereOp = {};
        username && Object.assign(whereOp, { username });
        account && Object.assign(whereOp, { account });
        id && Object.assign(whereOp, { id });

        return Users.findOne({ where: whereOp });
    }
    verify({ account, id, password }: Partial<UserModel>) {
        if (!password) return Promise.resolve({ sc: false, id: null, username: "", intro: "", avatarSrc: "", account: "" });
        const whereOp = {};
        account && Object.assign(whereOp, { account });
        id && Object.assign(whereOp, { id });

        return Users.findOne({ where: whereOp })
            .then(res => {
                if (!res || !res.dataValues) return { sc: false, id: null, username: "" };
                const sc = bcrpty.compareSync(password, res.dataValues.password);
                return { sc, id: res.dataValues.id, username: res.dataValues.username, intro: res.dataValues.biography, avatarSrc: res.dataValues.avatarSrc, account: res.dataValues.account };
            })
    }
}

export default new UserService()