import express from "express";
import { sendMessage, getMyChats, getMessages } from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // หรือใช้ protectRoute ตามที่คุณตั้งชื่อไว้

const router = express.Router();

router.post("/send", verifyToken, sendMessage); // ส่งข้อความ
router.get("/inbox", verifyToken, getMyChats); // ดูหน้า Inbox
router.get("/:chatId", verifyToken, getMessages); // ดูข้อความในห้องนั้นๆ

export default router;