import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`เชื่อมต่อ MongoDB สำเร็จ! (${conn.connection.host})`);
    } catch (error) {
        console.error(`เชื่อมต่อ MongoDB ไม่สำเร็จ: ${error.message}`);
        process.exit(1); // สั่งปิดโปรแกรมทันทีถ้าต่อ Database ไม่ติด (สำคัญมาก)
    }
};