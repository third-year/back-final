const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please Enter The Name"],
  },
  email: {
    type: String,
    required: [true, "Enter The Email"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfrim: {
    type: String,
    required: true,

    validator: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  // Only run if the password is modified
  if (!this.isModified("password")) return next();

  // Hash thw password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfrim = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const changedTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 100,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT CHANGED
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
