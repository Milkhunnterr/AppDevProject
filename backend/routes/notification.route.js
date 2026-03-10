import express from "express";
import { getMyNotifications, markAsRead, deleteNotification } from "../controllers/notification.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; // ใช้ตัวที่คุณเพิ่งแก้ไป

const router = express.Router();

router.get("/", protectRoute, getMyNotifications);
router.put("/mark-read", protectRoute, markAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;