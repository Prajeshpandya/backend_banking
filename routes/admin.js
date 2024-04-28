import express from "express";
import {
  signIn,
  logOut,
  allusers,
  getprofile,
  deleteuser,
  getTransaction,
  editUser,
} from "../controllers/admin.js";

import { isAuth } from "../controllers/authadmin.js";
export const router = express.Router();

router.post("/login", signIn);
router.get("/logout", logOut);
router.get("/allusers", isAuth, allusers);
router.get("/profile", getprofile);
router.get("/transaction",isAuth, getTransaction);
router.patch("/edituser",isAuth, editUser);
router.delete("/deleteuser", deleteuser);
