const UserModel = require("../model/UserModel");
const UserDetailModel = require("../model/UserDetailModel");
const bcrypt = require("bcrypt");

exports.showAllUser = async (req, res, next) => {
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
};

exports.showById = async (req, res, next) => {
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
    /* const {fullName} = getUserDetail
    return res.status(200).send({fullName}) */
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, pass } = req.body;
    const password = bcrypt.hashSync(pass, 10);
    const createUser = await UserModel.create({
      username,
      email,
      password,
    });
    if (!createUser) {
      return res.status(400).send("Bad Request!");
    }
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
    return res.status(200).send("OK");
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
