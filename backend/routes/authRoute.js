import express from "express";
// 1. ดึง Controller ทั้ง 8 ตัวที่เราเพิ่งเขียนเสร็จมาใช้งาน
import { 
    register, login, logout, refreshToken, 
    getMe, updatePassword, forgotPassword, resetPassword 
} from "../controllers/auth.controller.js";

// 2. ดึงยามด่านแรกมาใช้งาน (ด่านที่ 2 authorize ยังไม่ต้องใช้ในนี้ครับ เก็บไว้ใช้กับ Product/Trade)
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==========================================
// 🟢 โซนคนทั่วไป (ไม่ต้องล็อกอิน)
// ==========================================
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);

// ==========================================
// 🟡 โซนสมาชิก (ต้องผ่านยาม protectRoute ก่อน)
// ==========================================
// ดึงข้อมูลตัวเอง
router.get("/me", protectRoute, getMe);

// เปลี่ยนรหัสผ่านตัวเอง
router.put("/update-password", protectRoute, updatePassword);

export default router;