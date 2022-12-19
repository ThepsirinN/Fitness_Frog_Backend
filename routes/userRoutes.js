const express = require('express')
const routes = express.Router()

const userController = require("../controller/userController")



/* routes.get("/",userController.showAllUser) */
/* routes.get("/getuser/:id",userController.showById) */
routes.post("/createUser",userController.createUser)
routes.post("/checkUser",userController.login)
routes.get("/checkAuth",userController.checkAuth)
routes.put("/logout",userController.userLogout)


module.exports = routes