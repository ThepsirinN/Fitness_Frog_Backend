const express = require('express')
const routes = express.Router()

const userActivityController = require("../controller/userActivityController")

routes.post("/createActivity",userActivityController.createUserActivity)
routes.get("/getPage/:perPage",userActivityController.queryPagination)
routes.get("/getData",userActivityController.queryCard)
routes.delete("/deleteActivity",userActivityController.deleteUserActivity)
routes.put("/editActivity",userActivityController.editActivity)
routes.put("/editStatus",userActivityController.toggleStatus)

module.exports = routes