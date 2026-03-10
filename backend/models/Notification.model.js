import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // คนรับแจ้งเตือน
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // คนที่มาไลค์/คอมเมนต์/ขอเทรด
    type: { 
        type: String, 
        enum: ["TRADE_REQUEST", "TRADE_ACCEPTED", "TRADE_REJECTED", "TRADE_SHIPPED", "NEW_COMMENT", "NEW_LIKE", "NEW_FOLLOWER"], 
        required: true 
    },
    message: { type: String, required: true },
    linkId: { type: mongoose.Schema.Types.ObjectId }, // ID ของโพสต์หรือใบเทรดที่เกี่ยวข้อง
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;