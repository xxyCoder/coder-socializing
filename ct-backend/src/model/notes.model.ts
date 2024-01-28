import { DataTypes } from "sequelize";
import seq from "@src/database/seq.database";
import Users from "./users.model";

export interface NoteModel {
    id: number | null;
    title: string;
    desc: string;
    videoSrc?: string;
    imageList?: string;
    tagList?: string;
    userId: number | null
}

const Notes = seq.define('notes', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '标题'
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '内容'
    },
    videoSrc: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '视频路径'
    },
    imageList: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '图片路径'
    },
    tagList: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '笔记标签'
    }
})

// 指定外键
Notes.belongsTo(Users, { foreignKey: 'userId' })

// 模型同步，创建该表
Notes.sync({
    force: false // true表示数据库如果存在该表，则先删除
})

export default Notes;
