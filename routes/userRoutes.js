const express = require('express')
const routes = express.Router()

const userController = require("../controller/userController")

/* routes.get("/",userController.showAllUser) */
/* routes.get("/getuser/:id",userController.showById) */
routes.post("/createUser",userController.createUser)

module.exports = routes