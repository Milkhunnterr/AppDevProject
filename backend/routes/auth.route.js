import express from "express";
import { 
    register, login, logout, getMe, updateProfile, 
    updatePassword, addAddress, deleteAddress, 
    getUserProfile, forgotPassword, resetPassword,
    verifyEmail, refreshToken, toggleFollow 
} from "../controllers/auth.controller.js";
import { uploadCloud } from "../utils/cloudinary.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

// 🔓 ไม่ต้องล็อกอิน
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken); 
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword); // ✅ เปิดใช้งานแล้ว!
router.get("/profile/:id", getUserProfile); 

// 🔒 ต้องล็อกอิน
router.get("/me", protectRoute, getMe);
router.put("/profile", protectRoute, uploadCloud.single("imageProfile"), updateProfile);
router.put("/password", protectRoute, updatePassword);
router.post("/address", protectRoute, addAddress);
router.delete("/address/:addressId", protectRoute, deleteAddress);
router.put("/verify-email", protectRoute, verifyEmail); 

// 👥 ระบบ Social
router.put("/follow/:id", protectRoute, toggleFollow); 

// 🚪 ออกจากระบบ
router.post("/logout", logout); 

export default router;