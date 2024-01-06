import Users, { UserModel } from "@src/model/users.model";
import { Op } from "sequelize";
import bcrpty from 'bcryptjs'

class UserService {
    create({ username, password, account }: UserModel) {
        return Users.create({ username, password, account });
    }
    update({ username, id, newPassword }: Partial<UserModel & { newPassword: string }>) {
        const whereOp = { id };
        const updateOp = {};
        username && Object.assign(updateOp, { username });
        newPassword && Object.assign(updateOp, { password: newPassword });

        return Users.update(updateOp, { where: whereOp });
    }
    remove({ id }: Partial<UserModel>) {
        return Users.destroy({ where: { id } });
    }
    find(page_size: number, page_num: number, username?: string) {
        const whereOp = {};
        username && Object.assign(whereOp, { username: { [Op.like]: `%${username}%` } });  // 实现模糊查询

        return Users.findAll({ offset: (page_num - 1) * page_size, limit: page_size, where: whereOp });
    }
    precisionFind({ username, account, id }: Partial<UserModel>) {
        const whereOp = {};
        username && Object.assign(whereOp, { username });
        account && Object.assign(whereOp, { account });
        id && Object.assign(whereOp, { id });

        return Users.findOne({ where: whereOp });
    }
    verify({ account, id, password }: Partial<UserModel>) {
        if (!password) return Promise.resolve({ sc: false, id: null, username: "" });
        const whereOp = {};
        account && Object.assign(whereOp, { account });
        id && Object.assign(whereOp, { id });

        return Users.findOne({ where: whereOp })
            .then(res => {
                if (!res || !res.dataValues) return { sc: false, id: null, username: "" };
                const sc = bcrpty.compareSync(password, res.dataValues.password);
                return { sc, id: res.dataValues.id, username: res.dataValues.username };
            })
    }
}

export default new UserService()