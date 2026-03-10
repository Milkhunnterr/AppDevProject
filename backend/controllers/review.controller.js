import Review from "../models/Review.model.js";
import Trade from "../models/Trade.model.js";
import User from "../models/User.model.js";

export const createReview = async (req, res) => {
    try {
        const { tradeId, rating, comment } = req.body;
        const reviewerId = req.user._id;

        const trade = await Trade.findById(tradeId);
        if (!trade || trade.status !== "COMPLETED") {
            return res.status(400).json({ success: false, message: "ต้องเทรดเสร็จสมบูรณ์ก่อนถึงรีวิวได้" });
        }

        const revieweeId = trade.requestId.toString() === reviewerId.toString() ? trade.receiveId : trade.requestId;

        const newReview = await Review.create({ tradeId, reviewer: reviewerId, reviewee: revieweeId, rating, comment });

        // คำนวณดาวเฉลี่ยใหม่ แล้วอัปเดตลง User
        const allReviews = await Review.find({ reviewee: revieweeId });
        const avgRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
        await User.findByIdAndUpdate(revieweeId, { trustScore: avgRating });

        res.status(201).json({ success: true, data: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};