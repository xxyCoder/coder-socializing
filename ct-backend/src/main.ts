import app from '@src/app/index'
import env from '@src/config/default.config'

const { PORT } = env;

app.listen(PORT, () => {
    console.log("running...");
})