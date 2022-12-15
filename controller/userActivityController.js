const UserActivityModel = require("../model/ActivityModel");
const UserModel = require("../model/UserModel");

exports.createUserActivity = async (req, res, next) => {
  try {
    const { user, refreshToken, activity } = req.body;
    const getUserData = await UserModel.findOne({
      username: user,
      refresh_token: refreshToken,
    });
    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    /* name: 'run',
    description: 'run',
    activityType: '1',
    startDate: '2022-12-15T21:13',
    endDate: '2022-12-30T21:13' */
    if (activity.name === "") {
      return res.status(400).json({ msg: "Please provide Activity name!" });
    }

    if (activity.description === "") {
      return res
        .status(400)
        .json({ msg: "Please provide Activity Description!" });
    }

    if (activity.activityType == 0) {
      return res.status(400).json({ msg: "Please select Activity Type!" });
    }

    if (activity.activityType < 1 || activity.activityType > 5) {
      return res
        .status(400)
        .json({ msg: "Please select activity from the list!" });
    }

    if (activity.startDate === "") {
      return res.status(400).json({ msg: "Please select Starting Date!" });
    }
    if (activity.endDate === "") {
      return res.status(400).json({ msg: "Please select End Date!" });
    }
    const sDate = new Date(activity.startDate);
    const eDate = new Date(activity.endDate);
    if (eDate - sDate < 0) {
      return res
        .status(400)
        .json({ msg: "End Date cannot select before Start Date" });
    }

    const getUserActivityBF = await UserActivityModel.findOne({
      userID: userID,
    });

    if (getUserActivityBF) {
      const activityBF = await getUserActivityBF.activities;
      activityBF.push(activity);
      const pushActivityData = await UserActivityModel.findOneAndUpdate(
        { userID: userID }, // key ค้นหา
        { activities: activityBF }, // key ที่จะเปลี่ยน
        {
          returnOriginal: false,
        }
      );
      if (!pushActivityData) {
        return res
          .status(400)
          .json({ msg: "Cannot Add data!, Please try again!" });
      }
      return res.status(200).json({ msg: "Create User Activity Success!" });
    }

    const createUserActivity = await UserActivityModel.create({
      userID,
      activities: [activity],
    });
    if (!createUserActivity) {
      return res.status(400).json({ msg: "Can't Create User Activity!" });
    }
    return res.status(200).json({ msg: "Create User Activity Success!" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.queryPagination = async (req, res, next) => {
  try {

    const { perPage } = req.params
    const { user, refreshtoken} = req.headers

    const getUserData = await UserModel.findOne({
      username: user,
      refresh_token: refreshtoken,
    });
  
    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    const getActivityData = await UserActivityModel.findOne({userID:userID})

    if(!getActivityData || getActivityData.activities.length === 0){
      return res.status(200).json({ numPage: 0 });
    }

    const numPage = Math.ceil(getActivityData.activities.length / perPage)
    return res.status(200).json({ numPage: numPage });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.queryCard = async (req,res,next) =>{
  try{
    const { user, refreshtoken} = req.headers
    const getUserData = await UserModel.findOne({
      username: user,
      refresh_token: refreshtoken,
    });

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();
    
    const getActivityData = await UserActivityModel.findOne({userID:userID})
    
    if(!getActivityData || getActivityData.activities.length === 0){
      return res.status(200).json({ activitiesData: [] });
    }

    return res.status(200).json({activitiesData:getActivityData.activities})

  } catch (e){
    console.log(err);
    return res.status(400).send(err);
  }
}
