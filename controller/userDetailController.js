const UserDetailModel = require("../model/UserDetailModel");
const UserModel = require("../model/UserModel");

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
      image,
    } = req.body;

    const getUserData = await UserModel.findOne({
      username: username,
      refresh_token: refreshToken,
    });
    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    if (fullName === "") {
      return res.status(400).json({ msg: "Please Provide Fullname" });
    }

    if (gender.value == 0) {
      return res.status(400).json({ msg: "Please Select your gender" });
    }

    if (age === "") {
      return res.status(400).json({ msg: "Please Provide your age" });
    }

    const today = new Date();
    const birthDate = new Date(age);
    let realAge = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      realAge = realAge - 1;
    }

    if(realAge<0){
        return res.status(400).json({ msg: "Incorrect date of birth" });
    }

    if (height === "") {
      return res.status(400).json({ msg: "Please Provide your height" });
    }
    if (weight === "") {
      return res.status(400).json({ msg: "Please Provide your weight" });
    }
    if (goal === "") {
      return res
        .status(400)
        .json({ msg: "Please Provide Days Amount of your Goal" });
    }

    if (goal < 1 ){
        return res.status(400).json({ msg: "Your goal must be at least 1 day" });
    }

    const userID = getUserData._id.toString();

    const createUserDetail = await UserDetailModel.create({
      userID,
      fullName,
      gender: gender.value,
      age:realAge,
      height,
      weight,
      goal,
      image,
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
