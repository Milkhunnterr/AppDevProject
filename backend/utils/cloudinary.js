import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// ตั้งค่าการเชื่อมต่อ
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ตั้งค่าที่เก็บรูปภาพ
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "AppDevProject_Uploads", // ชื่อโฟลเดอร์ใน Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

export const upload = multer({ storage });
export { cloudinary };