import { body } from "express-validator";
import express from "express";

import { register, verifyotp } from "../controllers/user.js";
import { User } from "../model/user.js";

const router = express.Router();

// prefix route is-> /user

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

export default router;
