import mongoose from "mongoose";

const schema = new mongoose.Schema({
  deviceDetails: {
    type: Object,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  dob: {
    type: Date,
    default: null,
  },
  bank: {
    type: String,
    default: null,
  },
  upipin: {
    type: String,
    default: null,
  },

  wallet: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  verified: Boolean,
});

export const User = mongoose.model("User", schema);
