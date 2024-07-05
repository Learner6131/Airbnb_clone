const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: { type: String, required: true },
});

userSchema.plugin(passportLocalMongoose); // creates user and password field on its own and does salting and hashing

module.exports = mongoose.model("User", userSchema);
