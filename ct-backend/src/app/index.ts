import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import users from "@src/router/users.router"
import { addCustomHeader } from '@src/middleware/auth.middleware';

const app = express();
// 将 public 目录作为静态目录
app.use(express.static('public'))
app.use(cookieParser())

// 允许跨域和发送跨域的cookie
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

// 设定响应头
// app.use(addCustomHeader);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 挂载路由
app.use('/user', users);

export default app;