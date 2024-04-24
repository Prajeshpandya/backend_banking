import { OtpVerification } from "../model/otpver.js";
import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";
import {transporter} from "../app.js"


export const register = async (req, res, next) => {
  try {
    const {
      //   deviceid,
      //   os,
      //   version,
      //   manufacturer,
      //   model,
      //   name,
      //   phone,
      //   address,
      //   dob,
      email,
      password,
    } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("user already exist!", 400));

    const hashedpassword = await bcrypt.hash(password, 10);

    user = await User.create({
      //   deviceid,
      //   os,
      //   version,
      //   manufacturer,
      //   model,
      //   name,
      //   phone,
      //   address,
      //   dob,
      email,
      password: hashedpassword,
      verified: false,
    }).then((result) => {
      const d = (req.session.myData = result._id);
      sendOtp(result, res, next);
      console.log(d);
    });
  } catch (error) {
    next(error);
  }
};

//send otp verification email
const sendOtp = async ({ _id, email }, res, next) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: "banking@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: ` <p style={{ color: "red" }}>
          <b>${otp}</b> in the app to verify your email address and complete the verification
        </p>`,
    };

    //hash otp
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    await OtpVerification.create({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await transporter.sendMail(mailOptions);

    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyotp = async (req, res, next) => {
  try {
    let { otp } = req.body;

    const userId = req.session.myData;

    if (!userId || !otp) {
      return next(new ErrorHandler("Empty otp details are not allowed!", 400));
    } else {
      const OtpVerificationRecords = await OtpVerification.find({ userId });
      if (!OtpVerificationRecords) {
        return next(
          new ErrorHandler(
            "Account record doesn't exist or has been verified already . Please sign up or logIn!",
            400
          )
        );
      } else {
        const { expiresAt } = OtpVerificationRecords[0];
        const hashedOtp = OtpVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          //for delete expiried otp
          await OtpVerification.deleteMany({ userId });
          return next(
            new ErrorHandler("Code Has Expired , Please Try again!", 400)
          );
        } else {
          const validOtp = await bcrypt.compare(otp, hashedOtp);

          if (!validOtp) {
            return next(new ErrorHandler("Invalid Code Passed!", 400));
          } else {
            //success
            const sentCookie = jwt.sign({ _id: userId }, "dbdhbzssm");

            res
              .status(200)
              .cookie("userId", sentCookie, {
                httpOnly: "true",
                maxAge: 3600 * 1000,
              })
              .json({
                success: true,
                message: "cookie sent & userVerified",
              });

            await User.updateOne({ _id: userId }, { verified: true });
            await OtpVerification.deleteOne({ userId });
            await req.session.destroy();
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
