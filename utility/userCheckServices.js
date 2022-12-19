const UserModel = require("../model/UserModel");

const userCheck = async (user, refreshToken) => {
  try {
    const getUserData = await UserModel.findOne({
      userHash: user,
      refresh_token: refreshToken,
    });

    if (getUserData) {
      return getUserData;
    }
    return false;
  } catch (e) {
    return false;
  }
};

module.exports = userCheck;
