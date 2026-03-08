import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// accessToken && refreshToken
export const generateToken = (user) => {
    const accessToken = jwt.sign(
        {id:user._id , role:user.role},
        process.env.JWT_ACCESS_TOKEN,
        {expiresIn:"15m"}
    );

    const refreshToken = jwt.sign(
        {id:uer._id},
        process.env.JWT_SECRET_TOKEN,
        {expiresIn:"7d"}
    );

    return {accessToken , refreshToken};
}

//ระบบสมัครสมาชิก Register && SignUp
export const register = async(req,res) => {
    try{
        const {username , email , password} = req.body;

        //เช็คว่าเคยมีการสมัครไปก่อนหน้านี้รึยัง
        const existingUser = await User.findOne({
            $or : [
                {username : username},
                {email:email}
            ]
        });

        if(existingUser){
            return res.status(400).json({success:false , message:"อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว"})
        }

        // hashed password
        const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(salt,password);

        const newUser = new User ({
            username:username,
            email:email,
            password:hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            success:true,
            message:"สมัครสมาชิกสำเร็จ",
            user:{id:newUser._id , username:newUser.username , email:newUser.email}
        });


    }catch(error){
        res.status(500).json({success:false , message:`Server Error : ${error}`});
    }
}

// ระบบ login
export const login = async (req,res) => {
    try{
        const {identifier , password} = req.body;

        // หา User จาก email หรือผู้ใช้งาน
        const user = await User.findOne({
            $or:[
                {email:identifier},
                {username:identifier}
            ]
        }).select('+password')

        if(!user){
            return res.status(404).json({success:false , message : "ไม่พบบัญชีผู้ใข้งาน"})
        }

        // เช็คสถานะของบัญชี
        if(user.accountStatus == "suspended"){
            return res.status(403).json({success:false , message:"บัญชีของคุณถูกระงับ กรุณาติดต่อแอดมิน"})
        }
        if(user.accountStatus == "banned"){
            return res.status(403).json({success:false , message:"บัญชีของคุณถูกแบนถาวร"})
        }

        // เทียบ Password ว่าถูกต้องกับใน Database หรือไม่
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(401).json({success:false , message:"รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง"})
        }

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });

    }catch(error){
        res.status(500).json({success:false , message:`Server Error : ${error}`});
    }
}

export const getMe = async(req,res) => {
    try{
        const user = await User.findById(req.user._id);
        res.status(200).json({success:true , data:user});
    }catch(error){
        res.status(500).json({success:false , message:`Server Error : ${error}`});
    }
}

// ระบบอัปเดตรหัสผ่าน
export const updatePassword = async(req,res) => {
    try{

    }catch(error){

    }
}


// เมื่อลืมรหัสผ่าน
export const forgotPassword = async(req,res) => {
    try{

    }catch(error){

    }
}


// ตั้งรหัสผ่านใหม่
export const resetPassword = async(req,res) => {
    try{

    }catch(error){
        
    }
}