import express from "express"
import {signIn,logOut,allusers,getprofile} from "../controllers/admin.js"
import { isAuth } from "../controllers/authadmin.js";
export const router = express.Router();

router.post("/login",signIn)
router.get("/logout",logOut)
router.get("/allusers",isAuth,allusers)
router.get("/profile",getprofile)
