import express from "express";
import { 
    createProduct, getAllProducts, getProductById, 
    getMyProducts, updateProduct, deleteProduct, getProductsByShop 
} from "../controllers/product.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; // ✅ แก้ชื่อให้ตรงกัน

const router = express.Router();

// 🔓 ไม่ต้องล็อกอิน
router.get("/", getAllProducts);
router.get("/shop/:shopId", getProductsByShop); 
router.get("/user/my-products", protectRoute, getMyProducts); // ✅ ต้องย้ายมาอยู่บน /:id 

// ⚠️ กฎเหล็ก: /:id ต้องอยู่ล่างสุดของกลุ่ม GET เสมอ!
router.get("/:id", getProductById); 

// 🔒 ต้องล็อกอิน
router.post("/", protectRoute, createProduct);
router.put("/:id", protectRoute, updateProduct);
router.delete("/:id", protectRoute, deleteProduct);

export default router;