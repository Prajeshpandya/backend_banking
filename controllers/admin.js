import ErrorHandler from "../middlewares/error.js";
import { Adminmodal } from "../model/admin.js";
import { User } from "../model/user.js";
import { sendCookie } from "../utils/features.js";
import jwt from "jsonwebtoken";

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Adminmodal.findOne({ email });
    console.log(admin);

    // if (!admin) return next(new ErrorHandler("Admin can't find", 400));

    if (email === "admin@gmail.com" && password === "admin.123") {
      sendCookie(admin, res, `Welcome Back ${admin.name}`, 200);
    } else {
      return next(new ErrorHandler("Invalid email or password!", 400));
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
    const users = await User.find().lean();
    // const responseData = users.map((data) => {
    //   return {
    //     ...users,
    //     // imageUrl: `${data.image}`, // Assuming you have a field named 'imageFileName' in your model
    //   };
    // });
    res.status(200).json({
      message: "success",
      users,
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
    const admin = await Adminmodal.findById(decoded._id);

    res.status(200).json({
      message: "success",
      admin: admin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteuser = async (req, res, next) => {
  try {
    const { _id } = req.body;
    // console.log(token);
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne(_id);
    if (!user) return next(new ErrorHandler("user does not exist", 400));

    await user.deleteOne();
    res.status(200).json({
      success: "True",
      message: "User is Deleted",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
