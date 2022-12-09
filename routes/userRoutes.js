const express = require('express')
const routes = express.Router()

const userController = require("../controller/userController")

/* routes.get("/",userController.showAllUser) */
/* routes.get("/getuser/:id",userController.showById) */
routes.post("/createUser",userController.createUser)
routes.post("/checkUser",userController.login)
routes.post("/checkBcrypt",userController.bcryptCheck)

module.exports = routes