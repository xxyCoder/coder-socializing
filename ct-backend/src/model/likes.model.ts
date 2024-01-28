import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";

export interface LikeModel {
    id: number | null;
    noteId: number;
    userId: number;
}

const Like = seq.define('concerns', {
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
})

// 模型同步，创建该表
Like.sync({
    force: false // true表示数据库如果存在该表，则先删除
})

export default Like;
