import express from "express";
// 1. ดึงสมอง (Controller) ทั้ง 6 ตัวที่เราเพิ่งเขียนมาใช้งาน
import { 
    createProduct, getAllProducts, getProductById, 
    getMyProducts, updateProduct, deleteProduct 
} from "../controllers/product.controller.js";

// 2. ดึงยามด่านแรกมาใช้งาน (เพราะการลงของ/ลบ/แก้ ต้องล็อกอินเท่านั้น!)
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==========================================
// 🟢 โซนคนทั่วไป (ไม่ต้องล็อกอินก็เดินดูของในตลาดได้)
// ==========================================
router.get("/", getAllProducts); // ดึงของทั้งหมดไปโชว์หน้าฟีด

// ==========================================
// 🟡 โซนสมาชิก (ต้องผ่านยาม protectRoute ก่อน)
// ==========================================
router.post("/", protectRoute, createProduct); // ลงของใหม่

// 🚨 ทริคโปรแกรมเมอร์: ต้องเอา /me ขึ้นก่อน /:id เสมอนะครับ!
// ไม่งั้น Express จะงง คิดว่าคำว่า "me" คือรหัส ID สินค้า
router.get("/me/items", protectRoute, getMyProducts); // ดูคลังแสงส่วนตัว

// ==========================================
// 🔴 โซนที่ต้องใช้ ID สินค้าในการทำงาน
// ==========================================
router.get("/:id", getProductById); // กดดูรายละเอียดของ 1 ชิ้น (คนทั่วไปดูได้)
router.put("/:id", protectRoute, updateProduct); // กดแก้ไขข้อมูลของ (ต้องล็อกอิน)
router.delete("/:id", protectRoute, deleteProduct); // กดลบของ (ต้องล็อกอิน)

export default router;