const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter the name"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
  },
  image: {
    type: String,
    required: [true, "Please enter the image"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please enter the password confirmation"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter the phone"],
  },
});

userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.changedPasswordAt){
        const changedTimestamp = parseInt(this.changedPasswordAt.getTime()/100, 10)

        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT CHANGED
    return false;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
