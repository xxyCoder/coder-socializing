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

const LikeCollects = seq.define('like_collect', {
    type: {
        type: DataTypes.ENUM('collect', 'like')
    }
}, {
    timestamps: false // 静止添加其他列（默认有插入、删除列的时间）
})

LikeCollects.belongsTo(Notes, { foreignKey: 'noteId' })
LikeCollects.belongsTo(Users, { foreignKey: 'userId' })
// 模型同步，创建该表
LikeCollects.sync({
    force: false // true表示数据库如果存在该表，则先删除
})

export default LikeCollects;
