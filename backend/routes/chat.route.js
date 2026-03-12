import express from "express";
import { sendMessage, getMyChats, getMessages } from "../controllers/chat.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

// 🟢 ปรับให้ตรงกับ Frontend ที่เรียกใช้
router.post("/", protectRoute, sendMessage);  // ยิงมาที่ /api/chats เพื่อส่งข้อความ
router.get("/", protectRoute, getMyChats);     // ยิงมาที่ /api/chats เพื่อดึงรายการแชท
router.get("/:chatId", protectRoute, getMessages); 

export default router;