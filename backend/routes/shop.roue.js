import express from "express";
import { createShop, getAllShops, getShopById, updateShop } from "../controllers/shop.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔓 ไม่ต้องล็อกอินก็ดูร้านคนอื่นได้
router.get("/", getAllShops);
router.get("/:id", getShopById);

// 🔒 ต้องล็อกอินถึงจะเปิดร้านหรือแก้ไขร้านตัวเองได้
router.post("/", verifyToken, createShop);
router.put("/:id", verifyToken, updateShop);

export default router;