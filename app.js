const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require('morgan')
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoutes");
const userDetailRoute = require("./routes/userDetailRoutes");
const activitiesRoute = require("./routes/activitiesRoutes");
const config = require("./config");
const res = require("express/lib/response");


/* app.use(morgan('combined')) */

app.use(express.json());
/* app.use(express.urlencoded({ extends: true })); */

app.use(cors({ credentials: true, origin: `${config.allowCORS}` }));

app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/userDetail", userDetailRoute);
app.use("/api/v1/activities", activitiesRoute);

app.get("/health",async (req,res,next) => {
  return res.status(200).send("ok")
})

const server = app.listen(config.port);

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})  

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})  