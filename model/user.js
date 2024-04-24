import mongoose from "mongoose";

const schema = new mongoose.Schema({
  // deviceid: {
  //   type: String,
  //   required: true,
  // },
  // os: {
  //   type: String,
  //   required: true,
  // },
  // version: {
  //   type: String,
  //   required: true,
  // },
  // manufacturer: {
  //   type: String,
  //   required: true,
  // },
  // model: {
  //   type: String,
  //   required: true,
  // },
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  // phone: {
  //   type: Number,
  //   required: true,
  // },
  // address: {
  //   type: String,
  //   required: true,
  // },
  // dob: {
  //   type: Date,
  //   required: true,
  // },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  verified: Boolean,
});

export const User = mongoose.model("User", schema);
