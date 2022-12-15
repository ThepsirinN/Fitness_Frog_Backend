const express = require('express')
const routes = express.Router()

const userActivityController = require("../controller/userActivityController")

routes.post("/createActivity",userActivityController.createUserActivity)
routes.get("/getPage/:perPage",userActivityController.queryPagination)
routes.get("/getData",userActivityController.queryCard)



module.exports = routes