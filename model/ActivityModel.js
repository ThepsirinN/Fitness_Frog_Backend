const { mongo } = require("../config");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(mongo, {
  connectTimeoutMS: 3000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

const activityDetailed = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  activityType: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
  },
});

const activitySchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "User",
  },
  activities : [activityDetailed]
});

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;
