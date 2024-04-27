import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },

  receiverId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Transaction = mongoose.model("transaction", transactionSchema);
