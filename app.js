const express = require('express')
const app = express()

const userRoute = require("./routes/userRoutes")
const config = require("./config")


app.use(express.json())
app.use(express.urlencoded({extends:true}))


app.use((req,res,next)=>{
    next()
})

app.use("/user",userRoute)

app.listen(config.port,()=>{
    console.log(config.port)
})