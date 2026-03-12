import express from "express";
import multer from "multer"; // 🟢 1. Import multer
import path from "path";
import { 
    createProduct, getAllProducts, getProductById, 
    getMyProducts, updateProduct, deleteProduct, getProductsByShop 
} from "../controllers/product.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🟢 2. ตั้งค่าที่เก็บรูปและชื่อรูป (ไม่ให้ชื่อซ้ำกัน)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // เก็บไว้ในโฟลเดอร์ uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อใหม่เป็นตัวเลขเวลาปัจจุบัน
    }
});
const upload = multer({ storage: storage });

// 🔓 ไม่ต้องล็อกอิน
router.get("/", getAllProducts);
router.get("/shop/:shopId", getProductsByShop); 
router.get("/user/my-products", protectRoute, getMyProducts); 

router.get("/:id", getProductById); 

// 🔒 ต้องล็อกอิน
// 🟢 3. แทรกรปภ. upload.single("image") เข้าไปก่อนเรียก createProduct
router.post("/", protectRoute, upload.single("image"), createProduct);
router.put("/:id", protectRoute, updateProduct);
router.delete("/:id", protectRoute, deleteProduct);

export default router;