import express from "express";
import { validateCoupon, getAvailableCoupons } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAvailableCoupons);
router.post("/validate", protectRoute, validateCoupon); 

export default router;