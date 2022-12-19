const UserActivityModel = require("../model/ActivityModel");
const userCheck = require("../utility/userCheckServices");
const filterBadActivity = require("../utility/badActivityCheckService");

exports.createUserActivity = async (req, res, next) => {
  try {
    const { user, refreshToken, activity } = req.body;
    const getUserData = await userCheck(user, refreshToken);

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    /* 
    activity=>
    name: 'run',
    description: 'run',
    activityType: '1',
    startDate: '2022-12-15T21:13',
    endDate: '2022-12-30T21:13' */

    const checkBadActivity = filterBadActivity(activity);
    if (checkBadActivity) {
      return res
        .status(checkBadActivity.status)
        .json({ msg: `${checkBadActivity.msg}` });
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
    const { perPage } = req.params;
    const { user, refreshtoken } = req.headers;

    const getUserData = await userCheck(user, refreshtoken);

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    const getActivityData = await UserActivityModel.findOne({ userID: userID });

    if (!getActivityData || getActivityData.activities.length === 0) {
      return res.status(200).json({ numPage: 0 });
    }

    const numPage = Math.ceil(getActivityData.activities.length / perPage);
    return res.status(200).json({ numPage: numPage });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.queryCard = async (req, res, next) => {
  try {
    const { user, refreshtoken } = req.headers;
    const getUserData = await userCheck(user, refreshtoken);

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    const getActivityData = await UserActivityModel.findOne({ userID: userID });

    if (!getActivityData || getActivityData.activities.length === 0) {
      return res.status(200).json({ activitiesData: [] });
    }

    return res.status(200).json({ activitiesData: getActivityData.activities });
  } catch (e) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.editActivity = async (req, res, next) => {
  try {
    const { user, refreshToken, activityId, activity } = req.body;

    
    const getUserData = await userCheck(user, refreshToken);

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();
    //check bad activity obj input
    const checkBadActivity = filterBadActivity(activity);
    if (checkBadActivity) {
      return res
        .status(checkBadActivity.status)
        .json({ msg: `${checkBadActivity.msg}` });
    }

    if (activityId === "") {
      return res.status(400).json({ msg: "Activity ID is Null" });
    }

    const getActivityData = await UserActivityModel.findOne({ userID: userID });
    if (!getActivityData) {
      return res.status(400).json({ msg: "No Activity" });
    }

    const userActivities = getActivityData.activities; // [{},{},{}]
    const updateIndex = userActivities.findIndex((element) => {
      return element._id.toString() === activityId;
    });
    userActivities[updateIndex].name = activity.name;
    userActivities[updateIndex].description = activity.description;
    userActivities[updateIndex].activityType = activity.activityType;
    userActivities[updateIndex].startDate = activity.startDate;
    userActivities[updateIndex].endDate = activity.endDate;

    const editActivity = await UserActivityModel.findOneAndUpdate(
      { userID: userID }, // key ค้นหา
      { activities: userActivities }, // key ที่จะเปลี่ยน
      {
        returnOriginal: false,
      }
    );
    if (!editActivity) {
      return res.status(400).json({ msg: "Can't edit!" });
    }
    return res.status(200).json({ msg: `Edit data Successful` });

  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
};

exports.toggleStatus = async (req,res,next) =>{
  try{
    const {user, refreshToken, activityId, statusChange} = req.body

    const getUserData = await userCheck(user, refreshToken);

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();
    
    if (activityId === "") {
      return res.status(400).json({ msg: "Activity ID is Null" });
    }
    
    const getActivityData = await UserActivityModel.findOne({ userID: userID });
    if (!getActivityData) {
      return res.status(400).json({ msg: "No Activity" });
    }

    const userActivities = getActivityData.activities; // [{},{},{}]
    const updateIndex = userActivities.findIndex((element) => {
      return element._id.toString() === activityId;
    });
    userActivities[updateIndex].status = statusChange;
    
    const editActivity = await UserActivityModel.findOneAndUpdate(
      { userID: userID }, // key ค้นหา
      { activities: userActivities }, // key ที่จะเปลี่ยน
      {
        returnOriginal: false,
      }
    );
    if (!editActivity) {
      return res.status(400).json({ msg: "Can't edit!" });
    }
    return res.status(200).json({msg:"ok"})
  }catch(err){
    console.log(err);
    return res.status(400).send(err);
  }
}

exports.deleteUserActivity = async (req, res, next) => {
  try {
    const { user, refreshtoken, activitykey } = req.headers;

    const getUserData = await userCheck(user, refreshtoken);

    if (!getUserData) {
      return res
        .status(401)
        .json({ msg: "You're Hacker!. See you in the jail~" });
    }

    const userID = getUserData._id.toString();

    const getActivityData = await UserActivityModel.findOne({ userID: userID });
    if (!getActivityData) {
      return res.status(400).json({ msg: "No Activity" });
    }

    const activitiesData = getActivityData.activities;

    if(!activitykey){
      return res.status(400).json({msg:"Can't delete"})
    }

    const newActivitiesData = activitiesData.filter((e) => {
      return e._id.toString() !== activitykey;
    });


    const deleteActivity = await UserActivityModel.findOneAndUpdate(
      { userID: userID }, // key ค้นหา
      { activities: newActivitiesData }, // key ที่จะเปลี่ยน
      {
        returnOriginal: false,
      }
    );
    if (!deleteActivity) {
      return res.status(400).json({ msg: "Can't deleted!" });
    }
    return res.status(200).json({ msg: "delete successful" });
  } catch (e) {
    console.log(err);
    return res.status(400).send(err);
  }
};


