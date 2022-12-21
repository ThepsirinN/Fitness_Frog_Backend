const { mongo } = require("../config");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose
  .connect(mongo, {
    connectTimeoutMS: 3000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err.reason));

const userImageSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "User",
  },
  image: { type: String, required: true },
});

const UserImageModel = mongoose.model("UserImage", userImageSchema);

module.exports = UserImageModel;
