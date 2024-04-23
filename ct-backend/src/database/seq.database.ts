import { Sequelize } from 'sequelize'
import env from '@src/config/default.config';

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE
} = env;

const seq = new Sequelize(MYSQL_DATABASE!, MYSQL_USER!, MYSQL_PASSWORD!, {   // 建立mysql连接
  host: MYSQL_HOST!,
  dialect: 'mysql'
});

// 测试是否成功
// seq.authenticate().then(() => {
//     console.log('success');
// }).catch(err => {
//     console.log(err);
// })

export default seq;