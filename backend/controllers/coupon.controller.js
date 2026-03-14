import Coupon from "../models/Coupon.model.js";

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) return res.status(404).json({ success: false, message: "ไม่พบคูปองนี้" });
        if (new Date() > coupon.expiryDate) return res.status(400).json({ success: false, message: "คูปองหมดอายุแล้ว" });
        if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: "คูปองสิทธิ์เต็มแล้ว" });

        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAvailableCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({
            isActive: true,
            expiryDate: { $gt: new Date() },
            $expr: { $lt: ["$usedCount", "$usageLimit"] }
        }).sort({ discountValue: -1 });
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minAmount, expiryDate, usageLimit } = req.body;
        const newCoupon = new Coupon({
            code,
            discountType,
            discountValue,
            minAmount,
            expiryDate,
            usageLimit
        });
        await newCoupon.save();
        res.status(201).json({ success: true, data: newCoupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "ลบคูปองเรียบร้อยแล้ว" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minAmount, expiryDate, usageLimit, isActive } = req.body;
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: "ไม่พบคูปองนี้" });
        }

        if (code) coupon.code = code;
        if (discountType) coupon.discountType = discountType;
        if (discountValue !== undefined) coupon.discountValue = discountValue;
        if (minAmount !== undefined) coupon.minAmount = minAmount;
        if (expiryDate) coupon.expiryDate = expiryDate;
        if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
        if (isActive !== undefined) coupon.isActive = isActive;

        await coupon.save();
        res.status(200).json({ success: true, message: "อัปเดตคูปองสำเร็จ", data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};