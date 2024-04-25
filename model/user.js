import mongoose from "mongoose";

const schema = new mongoose.Schema({
  deviceDetails: {
    type: Object,
    required: true,
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
  transactionPass: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  verified: Boolean,
});

export const User = mongoose.model("User", schema);
