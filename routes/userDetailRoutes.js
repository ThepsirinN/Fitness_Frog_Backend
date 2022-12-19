const express = require('express')
const routes = express.Router()

const userDetailController = require("../controller/userDetailController")

routes.post("/createUserDetail",userDetailController.createUserDetail)
routes.get("/getUserDetail",userDetailController.getUserDetail)
routes.put("/editUserDetail",userDetailController.editUserDetail)

module.exports = routes