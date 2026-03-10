import express from "express";
import { createReview } from "../controllers/review.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createReview); // ต้องล็อกอินถึงจะรีวิวได้

export default router;