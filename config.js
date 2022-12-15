require("dotenv").config()

const config = {
    port : process.env.PORT,
    mongo : process.env.MONGOENDPOINT,
    allowCORS : process.env.ALLOW_CORS,
    jwtExpTime : process.env.JWT_EXP_TIME,
    cryptoSecret : process.env.CRYPTO_SECRET,
    refreshTk : process.env.REFRESH_TOKEN_SECRET,
}

module.exports = config