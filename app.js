import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./routes/user.js";
import { errorMiddleWare } from "./middlewares/error.js";
// import cors from "cors";
import session from "express-session";
import { config } from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";

import path from "path";
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { uuid } from "uuidv4";

export const app = express();

//use middleWare for getData from postman!  // this use before the make router..

const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuid());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cookieParser());
config({
  path: "./data/config.env",
});

//for deployment
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "*", //we can give specific domain , that only take accept the request from that specific domain
//     methods: ["GET", "PUT", "DELETE", "POST"],
//     credentials: true, //for get header details like cookie...
//   })
// );

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Set up express-session middleware
app.use(
  session({
    secret: "parth", // Use a random string for better security
    resave: false,
    saveUninitialized: false,
  })
);

//made prefix route so now we not have to write again and again same path for user/...
app.use("/users", userRouter);

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

//using error middleware
app.use(errorMiddleWare);
