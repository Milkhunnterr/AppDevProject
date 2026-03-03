import User from "../models/User.model.js";
import jwt from "jsonwebtoken"

export const protectRoute = async(req,res,next) => {
    try{
        // ดึง Token จาก Cookies
        const accessToken = req.cookies.accessToken;

        if(!accessToken){
            return res.status(404).json({succcess:false , message:"ไม่พบ Toekn กรุณาเข้าสู่ระบบอีกครั้ง"});
        }

        //ตรวจสอบความถูกต้องของ Token
        try{
            const decoded = jwt.verify(accessToken , process.env.JWT_ACCESS_SECRET);

            const user = await User.findById(decoded.id);

            if(!user){
                return res.status(401).json({success:false , message:"ไม่พบผู้ใช้งาน กรุณาตรวจสอบอีกครั้ง"})
            }

            if(user.accountStatus == "suspended" || user.accountStatus == "banned"){
                return res.status(404).json({success:false , message:"บัญชีของผู้ใช้งานถูกระงับการใช้งานอยู่"});
            }

            req.user = user;
            next();

        }catch(error){
            if(error.name == "TokenExpiredError"){
                return res.status(401).json({
                    success:false,
                    message:"Unauthorized Token หมดอายุ",
                    isExpired:true
                });
            }

            throw error;
        }

    }catch(error){
        console.log(`Error protectRoute controller : ${error}`);
        res.status(500).json({success:false , message : `Server Error : ${error}`});
    }
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user ได้มาจากตอนผ่านด่าน protectRoute 
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied - ระดับ ${req.user?.role} ไม่มีสิทธิ์ใช้งานส่วนนี้` 
            });
        }
    };
};