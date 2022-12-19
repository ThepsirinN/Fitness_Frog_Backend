const filterBadUserDeatail = (activityObj) => {

    if (activityObj.fullName === "") {
        return {status:400, msg: "Please Provide Fullname"};
      }
  
      if (activityObj.gender.value == 0) {
        return {status:400, msg: "Please Select your gender" };
      }
  
      if (activityObj.age === "") {
        return {status: 400, msg: "Please Provide your age" };
      }
  
      const today = new Date();
      const birthDate = new Date(activityObj.age);
      let realAge = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        realAge = realAge - 1;
      }
  
      if (realAge < 0) {
        return {status: 400,  msg: "Incorrect date of birth" };
      }
  
      if (activityObj.height === "") {
        return {status: 400,  msg: "Please Provide your height" };
      }
      if (activityObj.weight === "") {
        return {status: 400,  msg: "Please Provide your weight" };
      }
      if (activityObj.goal === "") {
        return {status: 400,  msg: "Please Provide Days Amount of your Goal" };
      }
  
      if (activityObj.goal < 1) {
        return {status: 400,  msg: "Your goal must be at least 1 day" };
      }
  
    return [false,realAge]
  };

module.exports = filterBadUserDeatail