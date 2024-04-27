import ErrorHandler from "../middlewares/error.js";
import { Adminmodal } from "../model/admin.js";
import { User } from "../model/user.js";
import { sendCookie } from "../utils/features.js";
import jwt from "jsonwebtoken"

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Adminmodal.find();

    if (email === "admin@gmail.com" && password === "admin.123") {
      sendCookie(admin, res, "Login Successfully", 200);
    } else {
      return next(new ErrorHandler("Invalid Credentials", 400));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logOut = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: "true",
      sameSite: "lax",
      secure: false,
    })
    .json({
      success: true,
    });
};

export const allusers = async (req, res, next) => {
  try {
    const users = await User.find();
    const responseData = users.map((data) => {
      return {
        ...users,
        imageUrl: `/images/${data.image}`, // Assuming you have a field named 'imageFileName' in your model
      };
    });
    res.status(200).json({
      message: "success",
      responseData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getprofile = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(404).json({
        success: "false",
        message: "Login first!",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded)
    const admin = await Adminmodal.findById(decoded._id);


    res.status(200).json({
      message: "success",
      admin: admin,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
