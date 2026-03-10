import express from "express";
import { validateCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/validate", protectRoute, validateCoupon); 

export default router;