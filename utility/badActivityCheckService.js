const filterBadActivity = (activityObj) => {

    if (activityObj.name.trim() === "") {
      return { status: 400, msg: "Please provide Activity name!" };
    }
  
    if (activityObj.description.trim() === "") {
      return { status: 400, msg: "Please provide Activity Description!" };
    }
  
    if (activityObj.activityType == 0) {
      return { status: 400, msg: "Please select Activity Type!" };
    }
  
    if (activityObj.activityType < 1 || activityObj.activityType > 5) {
      return { status: 400, msg: "Please select activity from the list!" };
    }
  
    if (activityObj.startDate.trim() === "") {
      return { status: 400, msg: "Please select Starting Date!" };
    }
  
    if (activityObj.endDate.trim() === "") {
      return { status: 400, msg: "Please select End Date!" };
    }
  
    const sDate = new Date(activityObj.startDate);
    const eDate = new Date(activityObj.endDate);
  
    if (eDate - sDate < 0) {
      return { status: 400, msg: "End Date cannot select before Start Date" };
    }
  
    return false
  };

module.exports = filterBadActivity