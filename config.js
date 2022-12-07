require("dotenv").config()

const config = {
    port : process.env.PORT,
    mongo : process.env.MONGOENDPOINT
}

module.exports = config