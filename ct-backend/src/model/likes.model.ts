import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";

export interface LikeModel {
    id: number | null;
    noteId: number;
    userId: number;
}

const Like = seq.define('likes', {
    noteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '笔记id'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '点赞用户id'
    }
}, {
    timestamps: false // 静止添加其他列（默认有插入、删除列的时间）
})

// 模型同步，创建该表
Like.sync({
    force: false // true表示数据库如果存在该表，则先删除
})

export default Like;
