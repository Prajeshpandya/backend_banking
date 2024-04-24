import { register,verifyotp } from "../controllers/user.js";
import express from "express";


const router = express.Router();

// prefix route is-> /user

router.post("/register",register);
router.post("/verifyotp",verifyotp);

export default router;
