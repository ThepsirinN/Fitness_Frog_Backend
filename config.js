require("dotenv").config()

const config = {
    port : process.env.PORT,
    mongo : process.env.MONGOENDPOINT,
    allowCORS : process.env.ALLOW_CORS,
    accessTk : process.env.ACCESS_TOKEN_SECRET,
    refreshTk : process.env.REFRESH_TOKEN_SECRET,
}

module.exports = config