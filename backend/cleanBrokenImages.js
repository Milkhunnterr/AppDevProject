import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/Product.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanup = async () => {
  try {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB.\n");

    // ดึงสินค้าทั้งหมดที่ยังมี localhost URL
    const products = await Product.find({
      images: { $elemMatch: { $regex: "^http://localhost" } }
    });

    console.log(`📦 Found ${products.length} products with localhost image URLs\n`);

    let cleaned = 0;

    for (const product of products) {
      const newImages = [];

      for (const imgUrl of product.images) {
        // ถ้าเป็น Cloudinary URL → เก็บไว้
        if (!imgUrl.startsWith("http://localhost")) {
          newImages.push(imgUrl);
          continue;
        }

        // ถ้าเป็น localhost URL → เช็คว่าไฟล์ยังอยู่ไหม
        const filename = imgUrl.split("/uploads/").pop();
        const localPath = path.join(__dirname, "uploads", filename);

        if (fs.existsSync(localPath)) {
          newImages.push(imgUrl); // ไฟล์ยังอยู่ → เก็บไว้
          console.log(`  ✅ [${product.productName}] file exists: ${filename}`);
        } else {
          console.log(`  🗑️  [${product.productName}] removed broken URL: ${filename}`);
          cleaned++;
          // ไม่เพิ่มเข้า newImages = ลบออก
        }
      }

      await Product.findByIdAndUpdate(product._id, { images: newImages });
    }

    console.log(`\n🎉 Cleanup complete! Removed ${cleaned} broken image URL(s)`);
    console.log(`💡 เจ้าของสินค้าสามารถเข้า ShopDetail แล้วอัปโหลดรูปใหม่ได้เลย (จะขึ้น Cloudinary อัตโนมัติ)`);
    process.exit(0);
  } catch (error) {
    console.error("💥 Cleanup failed:", error);
    process.exit(1);
  }
};

cleanup();
