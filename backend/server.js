import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

// ✅ 1. แก้พาธให้ชี้ไปที่โฟลเดอร์ utils ตามรูปของนายน้อยเป๊ะๆ
import { connectDB } from "./utils/db.js"; 

// 📦 2. นำเข้า Routes ครบทุกฟีเจอร์ (100% Full System)
import authRoute from "./routes/auth.route.js"; 
import productRoute from "./routes/product.route.js";
import tradeRoute from "./routes/trade.route.js"; 
import communityRoute from "./routes/community.route.js";
import shopRoute from "./routes/shop.route.js"; // ⚠️ อย่าลืมแก้ชื่อไฟล์ shop.roue.js เป็น shop.route.js นะครับ!
import chatRoutes from "./routes/chat.route.js"; // 🟢 เพิ่มบรรทัดนี้ลงไป
import notificationRoute from "./routes/notification.route.js";
import reviewRoute from "./routes/review.route.js"; 
import couponRoute from "./routes/coupon.route.js"; 

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Middlewares
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// 🛣️ Routes เปิดใช้งานครบทุกเส้นทาง
app.use("/api/auth", authRoute);  
app.use("/api/products", productRoute);
app.use("/api/trades", tradeRoute);
app.use("/api/community", communityRoute);
app.use("/api/shops", shopRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/chats", chatRoutes); // บรรทัดนี้ถูกต้องแล้ว แต่มันต้องการบรรทัด Import ด้านบนถึงจะทำงานได้
app.use("/api/reviews", reviewRoute); 
app.use("/api/coupons", couponRoute); 

// 🚀 สตาร์ทเซิร์ฟเวอร์ และต่อ Database
app.listen(PORT, () => {
    connectDB(); 
    console.log(`Server is running on http://localhost:${PORT}`);
});