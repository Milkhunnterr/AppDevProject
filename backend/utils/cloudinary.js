import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";

// 🟢 เชื่อมต่อ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 ตั้งค่า Multer ให้อัปโหลดขึ้น Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "AppDevShopLogos", // ชื่อโฟลเดอร์ที่จะไปโผล่ในเว็บ Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], 
  },
});

export const uploadCloud = multer({ storage });
export default cloudinary;