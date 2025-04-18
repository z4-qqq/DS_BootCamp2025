import {DefinePlugin} from "webpack"
import "dotenv/config"

const definePlugin = new DefinePlugin({
    API_ENV: JSON.stringify(process.env.API_ENV)
})

export default definePlugin;