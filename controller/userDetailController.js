const UserDetailModel = require("../model/UserDetailModel");
const userCheck = require("../utility/userCheckServices");
const filterBadUserDeatail = require("../utility/badUserDetailCheckServices");

exports.createUserDetail = async (req, res, next) => {
  try {
    const {
      username,
      refreshToken,
      fullName,
      gender,
      age,
      height,
      weight,
      goal,
    } = req.body;

    const getUserData = await userCheck(username, refreshToken);
    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const filterBad = filterBadUserDeatail({
      fullName,
      gender,
      age,
      height,
      weight,
      goal,
    });

    if (filterBad.status && filterBad.msg) {
      return res.status(filterBad.status).json({ msg: filterBad.msg });
    }

    const userID = getUserData._id.toString();

    const createUserDetail = await UserDetailModel.create({
      userID,
      fullName,
      gender: gender.value,
      DOB: age,
      age: filterBad[1],
      height,
      weight,
      goal,
    });
    if (!createUserDetail) {
      return res.status(400).json({ msg: "Can't Create User Detail!" });
    }
    return res.status(200).json({
      msg: "Create User Detail Successful.",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    const { user, refreshtoken } = req.headers;
    const getUserData = await userCheck(user, refreshtoken);
    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    const userDetailData = await UserDetailModel.findOne({ userID: userID });
    if (!userDetailData) {
      return res.status(200).json({ msg: "You don't have user data!" });
    }
    return res.status(200).json({ msg: "Ok", data: userDetailData });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.editUserDetail = async (req, res, next) => {
  try {
    const {
      username,
      refreshToken,
      fullName,
      gender,
      age,
      height,
      weight,
      goal,
    } = req.body;
    const getUserData = await userCheck(username, refreshToken);

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    const filterBad = filterBadUserDeatail({
      fullName,
      gender,
      age,
      height,
      weight,
      goal,
    });

    if (filterBad.status && filterBad.msg) {
      return res.status(filterBad.status).json({ msg: filterBad.msg });
    }

    // match userID with userdetail database
    const UpdateUserDetail = await UserDetailModel.findOneAndUpdate(
      { userID: userID },
      {
        fullName: fullName,
        gender: gender.value,
        DOB: age,
        age: filterBad[1],
        height: height,
        weight: weight,
        goal: goal,
      },
      { returnOriginal:false }
    );

    if(!UpdateUserDetail){
      return res.status(400).json({ msg: "Can't update user data" })
    }

    return res.status(200).json({ msg: "Successfully Edit User Detail." });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
