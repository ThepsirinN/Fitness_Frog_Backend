const express = require('express')
const routes = express.Router()

const userDetailController = require("../controller/userDetailController")

routes.post("/createUserDetail",userDetailController.createUserDetail)

module.exports = routes