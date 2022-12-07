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

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
