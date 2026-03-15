import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/Product.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const migrate = async () => {
  try {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB.\n");

    const products = await Product.find({
      images: { $elemMatch: { $regex: "^http://localhost" } }
    });

    console.log(`📦 Found ${products.length} products with localhost image URLs\n`);

    let success = 0, failed = 0, skipped = 0;

    for (const product of products) {
      const newImages = [];

      for (const imgUrl of product.images) {
        if (!imgUrl.startsWith("http://localhost")) {
          newImages.push(imgUrl);
          continue;
        }

        // ดึงชื่อไฟล์จาก URL แล้วหาในโฟลเดอร์ uploads โดยตรง
        const filename = imgUrl.split("/uploads/").pop();
        const localPath = path.join(__dirname, "uploads", filename);

        if (!fs.existsSync(localPath)) {
          console.log(`  ⚠️  File missing on disk: [${product.productName}] ${filename}`);
          newImages.push(imgUrl); // เก็บ URL เดิม
          skipped++;
          continue;
        }

        try {
          const uploadResult = await cloudinary.uploader.upload(localPath, {
            folder: "AppDevProducts",
          });
          console.log(`  ✅ Uploaded [${product.productName}] => ${uploadResult.secure_url}`);
          newImages.push(uploadResult.secure_url);
          success++;
        } catch (err) {
          console.log(`  ❌ Upload failed [${product.productName}]: ${err.message}`);
          newImages.push(imgUrl);
          failed++;
        }
      }

      await Product.findByIdAndUpdate(product._id, { images: newImages });
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   ✅ Uploaded to Cloudinary: ${success}`);
    console.log(`   ⚠️  Skipped (file missing): ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    process.exit(0);
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  }
};

migrate();
