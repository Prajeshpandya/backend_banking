import { body } from "express-validator";
import express from "express";
import { isAuth } from "../middlewares/is-auth.js";
import { makeTranscationUsingAccNo } from "../controllers/transaction.js";
import { User } from "../model/user.js";

const router = express.Router();

router.put(
  "/makeTranscationUsingAccNo",
  isAuth,
  [
    body("acNo")
      .custom((value, { req }) => {
        return User.findOne({ _id: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("User does not exists!");
          }
        });
      })
      .not()
      .isEmpty(),
    body("upiPin", "Please enter valid UPI PIN").isLength({ min: 6, max: 6 }),
    body("title").not().isEmpty(),
    body("amount").not().isEmpty(),
  ],
  makeTranscationUsingAccNo
);

export default router;
