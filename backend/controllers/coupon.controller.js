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