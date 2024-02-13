import seq from "@src/database/seq.database";
import Notes from "./notes.model";
import Users from "./users.model";

export interface LikeModel {
    id: number | null;
    noteId: number;
    userId: number;
}

const Likes = seq.define('likes', {}, {
    timestamps: false // 静止添加其他列（默认有插入、删除列的时间）
})

Likes.belongsTo(Notes, { foreignKey: 'noteId' })
Likes.belongsTo(Users, { foreignKey: 'userId' })
// 模型同步，创建该表
Likes.sync({
    force: false // true表示数据库如果存在该表，则先删除
})

export default Likes;
