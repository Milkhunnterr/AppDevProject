import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. สร้างช่องทางเชื่อมต่อกับเซิร์ฟเวอร์อีเมล (ดึงค่าจากไฟล์ .env)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL, // อีเมลของเรา
            pass: process.env.SMTP_PASSWORD // รหัสผ่าน หรือ App Password (ถ้าใช้ Gmail)
        }
    });

    // 2. จัดเตรียมจ่าหน้าซองและเนื้อหาจดหมาย
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // ส่งจากใคร
        to: options.email, // ส่งไปหาใคร
        subject: options.subject, // หัวข้ออีเมล
        text: options.message // เนื้อหาข้อความ
    };

    // 3. สั่งส่งอีเมล!
    await transporter.sendMail(message);
};

export default sendEmail;