const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require('morgan')
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoutes");
const userDetailRoute = require("./routes/userDetailRoutes");
const activitiesRoute = require("./routes/activitiesRoutes");
const config = require("./config");


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



app.listen(config.port);
