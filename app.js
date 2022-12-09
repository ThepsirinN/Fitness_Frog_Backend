const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoutes");
const config = require("./config");

app.use(express.json());
app.use(express.urlencoded({ extends: true }));

app.use(cors({ credentials: true, origin: `${config.allowCORS}` }));

app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

app.use("/user", userRoute);

app.listen(config.port, () => {
  console.log(config.port);
});
