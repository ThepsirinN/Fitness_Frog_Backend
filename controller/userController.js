const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
/* const crypto = require("crypto") */
const { refreshTk, jwtExpTime /* cryptoSecret */ } = require("../config");
const jwt = require("jsonwebtoken");
/* const sha256Hasher  = crypto.createHmac("sha256",cryptoSecret) */

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, pass, confirmPass } = req.body;

    // check email is not null
    if (email === "") {
      return res.status(400).json({ msg: "You must enter Email." });
    }

    // check duplicate email
    const getEmail = await UserModel.findOne({ email: email });
    if (getEmail && getEmail.length !== 0) {
      return res.status(400).json({ msg: "Email is already exist." });
    }

    // check email format
    const emailFormat = /^[A-z0-9_.+-]+@[A-z0-9-]+\.[A-z0-9-.]+$/;
    if (!email.match(emailFormat)) {
      return res.status(400).json({ msg: "Entered Email miss match." });
    }

    // check user is not null
    if (username === "") {
      return res.status(400).json({ msg: "You must Enter Username." });
    }

    // check duplicate user
    const getUser = await UserModel.findOne({ username: username });
    if (getUser && getUser.length !== 0) {
      return res.status(400).json({ msg: "Username is already exist." });
    }

    // check pass is not null
    if (pass === "") {
      return res.status(400).json({ msg: "Please provide Password" });
    }

    // check confirmPass is not null
    if (confirmPass === "") {
      return res.status(400).json({ msg: "Please provide Confirm-Password" });
    }

    // check pass === confirmPass
    if (pass !== confirmPass) {
      return res
        .status(400)
        .json({ msg: "Password and Confirm-Password not match!" });
    }

    const password = bcrypt.hashSync(pass, 10);
    const userHash = bcrypt.hashSync(username, 10);
    const createUser = await UserModel.create({
      username,
      userHash,
      email,
      password,
    });

    if (!createUser) {
      return res.status(400).json({ msg: "Can't Create User!" });
    } else {
      //   create JWT token
      const token = jwt.sign(
        {
          userHash,
        },
        refreshTk,
        { expiresIn: `${jwtExpTime}h` }
      );

      const updateUserToken = await UserModel.findOneAndUpdate(
        { username: username },
        { refresh_token: token },
        {
          returnOriginal: false,
        }
      );

      if (!updateUserToken) {
        return res.status(400).json({ msg: "Cannot Register" });
      }

      const expTime = jwtExpTime * 60 * 60 * 1000;

      return res.status(200).json({
        msg: "Registration Successful.",
        refreshToken: { key: token, user: userHash, exp: expTime },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, pass } = req.body;

    // check user is not null
    if (username === "") {
      return res.status(400).json({ msg: "You must Enter Username." });
    }

    // check pass is not null
    if (pass === "") {
      return res.status(400).json({ msg: "Please provide Password" });
    }

    // check username and pwd match

    const getUsername = await UserModel.findOne({ username: username });
    if (getUsername && getUsername.length !== 0) {
      // get alldata in Obj
      // optional count login time
      /* 
      {
        username : ....,
        email : ....,
        password : $2$10asdijfioarjoqwejkr98q23fjushuisdfosdfh0213901289308
      }
    */
      // getUsername.password is hashing in document
      let matchUser = bcrypt.compareSync(pass, getUsername.password);
      if (matchUser) {
        const userHash = bcrypt.hashSync(username, 10);
        const token = jwt.sign(
          {
            userHash,
          },
          refreshTk,
          { expiresIn: `${jwtExpTime}h` }
        );

        const expTime = jwtExpTime * 60 * 60 * 1000;
        const updateToken = await UserModel.findOneAndUpdate(
          { username: username },
          { userHash: userHash, refresh_token: token },
          {
            returnOriginal: false,
          }
        );
        if (updateToken) {
          return res.status(200).json({
            msg: "Login successful",
            refreshToken: { key: token, user: userHash, exp: expTime },
          });
        }
      }

      return res
        .status(400)
        .json({ msg: "Password is incorrect, please try again." });
    }
    return res.status(400).json({ msg: "No User found!" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    //   get the token from the authorization header
    const token = await req.headers.authorization.split(" ")[1];
    const user = await req.headers.user;

    const getUserName = await UserModel.findOne({ userHash: user });
    if (!getUserName) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userGet = getUserName.username;

    const decodedToken = await jwt.verify(token, refreshTk);

    if (bcrypt.compareSync(userGet, decodedToken.userHash)) {
      //check if the token matches the supposed origin

      // retrieve the user details of the logged in user
      const decodeJWT = await decodedToken;

      // pass the the user down to the endpoints here
      // req.user = userGet;
      // req.decodeJWT = decodeJWT;

      // update new token
      const userData = await UserModel.findOne({ username: userGet });
      if (userData) {
        const userHash = bcrypt.hashSync(userGet, 10);
        const newToken = jwt.sign(
          {
            userHash,
          },
          refreshTk,
          { expiresIn: `${jwtExpTime}h` }
        );
        const expTime = jwtExpTime * 60 * 60 * 1000;
        const updateToken = await UserModel.findOneAndUpdate(
          { username: userGet },
          { userHash: userHash, refresh_token: newToken },
          {
            returnOriginal: false,
          }
        );
        if (updateToken) {
          return res.status(200).json({
            status: true,
            userHash,
            refreshToken: { key: newToken, exp: expTime },
          });
        }
      }
    }
    // pass down functionality to the endpoint
    /* next(); */
  } catch (error) {
    return res.status(401).json({
      status: false,
      error: new Error("Invalid request!"),
    });
  }

  /* if (bcrypt.compareSync(user, userHash)) {
    return res.status(200).json({ status: true });
  }
  return res.status(401).json({ status: false }); */
};

exports.userLogout = async (req,res,next) => {
  try {
    const { user, refreshToken } = req.body;

    const getUserName = await UserModel.findOne({ userHash: user });
    if (!getUserName) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userGet = getUserName.username;

    const decodedToken = await jwt.verify(refreshToken, refreshTk);

    // update new token
    const userData = await UserModel.findOne({ username: userGet });
    if (userData) {
      const userHash = bcrypt.hashSync(userGet, 10);
      const newToken = jwt.sign(
        {
          userHash,
        },
        refreshTk,
        { expiresIn: `${0}h` }
      );
      const expTime = 0 * 60 * 60 * 1000;
      const updateToken = await UserModel.findOneAndUpdate(
        { username: userGet },
        { userHash: userHash, refresh_token: newToken },
        {
          returnOriginal: false,
        }
      );
      if (updateToken) {
        return res.status(200).json({
          msg: "Logout Success",
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: false,
      error: new Error("Invalid request!"),
    });
  }
};
