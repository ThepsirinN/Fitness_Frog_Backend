const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* exports.showAllUser = async (req, res, next) => {
  try {
    const getUser = await UserModel.find({});
    if (!getUser || getUser.length === 0) {
      return res.status(404).send("Not Found!");
    }
    const resultArr = [];
    const getUserLength = getUser.length;
    getUser.forEach(async (element) => {
      const getUserID = element._id.toString();
      const getUserDetail = await UserDetailModel.findOne({
        userID: getUserID,
      });
      if (!getUserDetail || getUserDetail.length === 0) {
        return res.status(404).send("Not Found!");
      }
      resultArr.push({ user: element, userDetail: getUserDetail });
      if (resultArr.length === getUserLength) {
        return res.status(200).send(resultArr);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
}; */

/* exports.showById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getUserById = await UserModel.findById(id);
    if (!getUserById || getUserById.length === 0) {
      return res.status(404).send("Not Found!");
    }
    const getUserDetail = await UserDetailModel.findOne({userID:id});
    if (!getUserDetail || getUserDetail.length === 0) {
      return res.status(404).send("Not Found!");
    }
    return res.status(200).send(getUserDetail)
    //const {fullName} = getUserDetail
    //return res.status(200).send({fullName})
  } catch (err) {
    return res.status(400).send(err);
  }
}; */

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
      return res.status(400).send({ msg: "Please provide Password" });
    }

    // check confirmPass is not null
    if (confirmPass === "") {
      return res.status(400).send({ msg: "Please provide Confirm-Password" });
    }

    // check pass === confirmPass
    if (pass !== confirmPass) {
      return res
        .status(400)
        .send({ msg: "Password and Confirm-Password not match!" });
    }

    const password = bcrypt.hashSync(pass, 10);
    const createUser = await UserModel.create({
      username,
      email,
      password,
    });
    if (!createUser) {
      return res.status(400).json({ msg: "Can't Create User!" });
    }
    return res.status(200).json({ msg: "Registration Successful." });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
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
