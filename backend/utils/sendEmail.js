import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. สร้างช่องทางเชื่อมต่อกับเซิร์ฟเวอร์อีเมล (ดึงค่าจากไฟล์ .env)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // ช่วยให้ส่งผ่านในบางกรณีที่ใบรับรอง SSL มีปัญหา
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