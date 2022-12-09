const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const { refreshTk } = require("../config");
const jwt = require("jsonwebtoken");

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
    const createUser = await UserModel.create({
      username,
      email,
      password,
    });
    if (!createUser) {
      return res.status(400).json({ msg: "Can't Create User!" });
    } else {
      //   create JWT token
      const userHash = bcrypt.hashSync(username, 10);
      const token = jwt.sign(
        {
          userHash,
        },
        refreshTk,
        { expiresIn: "24h" }
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

      const expTime = 24 * 60 * 60 * 1000;

      return res.status(200).json({
        msg: "Registration Successful.",
        refreshToken: { key: token, exp: expTime },
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
          { expiresIn: "24h" }
        );

        const expTime = 24 * 60 * 60 * 1000;
        return res.status(200).json({
          msg: "Login successful",
          refreshToken: { key: token, exp: expTime },
        });
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

exports.bcryptCheck = async (req, res, next) => {
  const { user, userHash } = req.body;
  if (bcrypt.compareSync(user, userHash)) {
    return res.status(200).json({ status: true });
  }
  return res.status(401).json({ status: false });
};

/* back up for create user detail */
/* 
const userId = createUser._id.toString();
    const { fullName, gender, age, height, weight, goal, image } = req.body;
    const createUserDetail = await UserDetailModel.create({
      userID: userId,
      fullName,
      gender,
      age,
      height,
      weight,
      goal,
      image,
    });
    if (!createUserDetail) {
      return res.status(400).send("Bad Request!");
    }
*/
