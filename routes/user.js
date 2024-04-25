import { body } from "express-validator";
import express from "express";

import {
  register,
  verifyotp,
  generateKeyPairs,
  verifySign,
  completeProfile,
  login,
} from "../controllers/user.js";
import { User } from "../model/user.js";

const router = express.Router();

// prefix route is-> /user

router.get("/keyGeneration", generateKeyPairs);

router.post("/verify", verifySign);

router.put(
  "/register",
  [
    body("deviceDetails", "Please provide valid device details!")
      .not()
      .isEmpty()
      .isObject(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("User already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("phoneNo", "Please provide valid mobile number!")
      .isNumeric()
      .not()
      .isEmpty()
      .isLength({ min: 10, max: 10 }),
    body("password", "Password must be 8 characters long!")
      .trim()
      .isLength({ min: 8 }),
  ],
  register
);

router.post("/verifyotp", [body("otp").not().isEmpty().isNumeric()], verifyotp);

router.put(
  "/completeProfie",
  [
    body("userId").custom((value, { req }) => {
      return User.findOne({ _id: value }).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("User does not exists!");
        }
      });
    }),
    body("name").isLength({ min: 5 }).withMessage("Please enter your name!"),
    body("address")
      .isLength({ min: 10 })
      .withMessage("Address must not be empty"),
    body("dob").isDate().withMessage("please enter valid birth date"),
    body("bank").isLength({ min: 3 }).withMessage("Please choose a bank"),
    body("transactionPass", "Password must be 8 characters long")
      .trim()
      .isLength({ min: 8 }),
  ],
  completeProfile
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("User does not exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password must be 8 characters long!")
      .trim()
      .isLength({ min: 8 }),
  ],
  login
);

export default router;
