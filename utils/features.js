import jwt from "jsonwebtoken";
console.log(process.env.JWT_SECRET) 
export const sendCookie = (result, res, message, statusCode = 200) => {
  const userId = jwt.sign({ _id: result._id }, process.env.JWT_SECRET);

  res
    .status(statusCode)
    .cookie("userId", userId, {
      httpOnly: "true",
      maxAge: 3600 * 1000,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none", //if its STRICT that means the url of frontend and backend will be same always but we have to do frontend and backend sepratly so.. its none!
      secure: process.env.NODE_ENV === "Development" ? "false" : "true", //if we do samesite none then we have to do secure true!
    })
    .json({
      success: true,
      message,
    });
};
