import { validationResult } from "express-validator";
import { User } from "../model/user.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const makeTranscationUsingAccNo = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error(errors.errors[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const { senderId, acNo, upiPin, title, amount } = req.body;

  let { privateKey } = req.body;

  privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKey, "base64"),
    type: "pkcs8",
    format: "der",
  });

  console.log(upiPin.toString());
  const sign = crypto.createSign("SHA256");
  sign.update(upiPin.toString());
  sign.end();
  const signature = sign.sign(privateKey).toString("base64");

  return User.findOne({ _id: senderId })
    .then((userDoc) => {
      if (amount > userDoc.wallet) {
        const error = new Error("Does not have enough balance!");
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
      }

      return bcrypt.compare(upiPin, userDoc.upipin);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Incorrect UPI PIN!");
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
      }
      console.log("working Account Method");
    });
};
