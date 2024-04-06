import app from '@src/app/index'
import env from '@src/config/default.config'
import { establishConn } from './correspondence';

const { PORT } = env;

establishConn()

app.listen(PORT)