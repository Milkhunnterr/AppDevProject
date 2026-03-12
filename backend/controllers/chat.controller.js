import Chat from "../models/Chat.model.js";

// 📨 1. ส่งข้อความ
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, chatType = "GENERAL" } = req.body;
        // 🟢 เช็คทั้ง id และ _id เพื่อความชัวร์
        const senderId = req.user.id || req.user._id; 

        if (!receiverId || !content) {
            return res.status(400).json({ success: false, message: "กรุณาระบุผู้รับและข้อความ" });
        }

        // หาห้องแชท
        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] },
            chatType: chatType 
        });

        // ถ้าไม่มีให้สร้างใหม่
        if (!chat) {
            chat = await Chat.create({
                participants: [senderId, receiverId],
                chatType: chatType,
                messages: [] // เริ่มต้นด้วยอาเรย์ว่าง
            });
        }

        // เพิ่มข้อความใหม่
        const newMessage = { sender: senderId, content };
        chat.messages.push(newMessage);
        chat.lastMessage = content;
        chat.lastMessageBy = senderId;

        await chat.save();

        res.status(200).json({ success: true, data: chat });
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📥 2. ดึงรายการแชททั้งหมด
export const getMyChats = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const chats = await Chat.find({ participants: userId })
            .populate("participants", "username imageProfile")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, data: chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📖 3. ดึงข้อความในห้องแชท
export const getMessages = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate("participants", "username imageProfile")
            .populate("messages.sender", "username imageProfile");

        if (!chat) return res.status(404).json({ success: false, message: "ไม่พบห้องแชท" });

        res.status(200).json({ success: true, data: chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};