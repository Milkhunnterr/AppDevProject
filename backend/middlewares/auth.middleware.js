import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import redis from "../utils/redis.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({ success: false, message: "ไม่พบ Token กรุณาล็อกอินอีกครั้ง" });
        }

        // 🛡️ เช็ค Blacklist ใน Redis (กรณี User เพิ่ง Logout ไป)
        const isBlacklisted = await redis.get(`blacklist:${accessToken}`);
        if (isBlacklisted) {
            return res.status(401).json({ success: false, message: "เซสชั่นหมดอายุ กรุณาล็อกอินใหม่" });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ success: false, message: "ไม่พบผู้ใช้งาน" });
            }

            if (user.accountStatus === "suspended" || user.accountStatus === "banned") {
                return res.status(403).json({ success: false, message: "บัญชีของคุณถูกระงับ" });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Token หมดอายุ", isExpired: true });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ success: false, message: `สิทธิ์ ${req.user?.role} เข้าถึงไม่ได้` });
        }
    };
};