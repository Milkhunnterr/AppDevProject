import Trade from "../models/Trade.model.js";
import Product from "../models/Product.model.js";

// ==========================================
// 1. สร้างใบคำขอแลกของ (ยื่นข้อเสนอ ร่างทอง!)
// ==========================================
export const createTrade = async (req, res) => {
    try {
        // รับค่ามาให้ครบทุกฟีเจอร์ที่เราเพิ่มไป
        const { 
            receiveId, offerItems, requestedItems, message,
            offerMoney, requestedMoney, delivered, meetupLocation, expiredAt 
        } = req.body;
        
        const requestId = req.user._id;

        // 🛡️ ดักทาง: ห้ามแลกของกับตัวเอง
        if (requestId.toString() === receiveId.toString()) {
            return res.status(400).json({ success: false, message: "ไม่สามารถยื่นข้อเสนอให้ตัวเองได้" });
        }

        // ⏳ เวทมนตร์: ถ้าหน้าเว็บไม่ได้ส่งวันหมดอายุมา ให้ตั้งเวลา "หมดอายุใน 3 วัน" อัตโนมัติ!
        let finalExpiredAt = expiredAt;
        if (!finalExpiredAt) {
            const today = new Date();
            today.setDate(today.getDate() + 3); // บวกไปอีก 3 วัน
            finalExpiredAt = today;
        }

        // สร้างใบเสนอแลกของลง Database
        const newTrade = await Trade.create({
            requestId,
            receiveId,
            offerItems,    
            requestedItems,  
            message,
            offerMoney,       // แถมเงินให้เขา
            requestedMoney,   // ขอเงินเขาเพิ่ม
            delivered,        // วิธีส่งของ
            meetupLocation,   // สถานที่นัดรับ
            expiredAt: finalExpiredAt // วันหมดอายุ
        });

        res.status(201).json({ success: true, message: "ส่งคำขอแลกเปลี่ยนแบบพรีเมียมสำเร็จ!", data: newTrade });
    } catch (error) {
        console.log(`create trade error: ${error}`);
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// ==========================================
// 2. กล่องจดหมายขาเข้า (Inbox) - มีใครมาขอแลกของกับเราบ้าง?
// ==========================================
export const getTradeRequests = async (req, res) => {
    try {
        // หาเฉพาะใบเสนอที่เราเป็นคนรับ (receiveId)
        const trades = await Trade.find({ receiveId: req.user._id })
            .populate("requestId", "username profilePic") // ดูหน้าคนขอ
            .populate("offerItems", "productName images") // ดูของที่เขาเอามาแลก
            .populate("requestedItems", "productName images") // ดูของของเราที่เขาอยากได้
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: trades.length, data: trades });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// ==========================================
// 3. กล่องจดหมายขาออก (Outbox) - เราไปขอแลกใครไว้บ้าง?
// ==========================================
export const getMyOffers = async (req, res) => {
    try {
        // หาเฉพาะใบเสนอที่เราเป็นคนไปขอเขา (requestId)
        const trades = await Trade.find({ requestId: req.user._id })
            .populate("receiveId", "username profilePic")
            .populate("offerItems", "productName images")
            .populate("requestedItems", "productName images")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: trades.length, data: trades });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// ==========================================
// 4. ตัดสินใจ! ยอมรับ หรือ ปฏิเสธ (Respond to Trade)
// ==========================================
export const respondToTrade = async (req, res) => {
    try {
        const { status } = req.body; 
        const tradeId = req.params.id;

        // ดักคนซน ส่งสเตตัสมั่วมา
        if (!["ACCEPTED", "REJECTED"].includes(status)) {
            return res.status(400).json({ success: false, message: "สถานะไม่ถูกต้อง" });
        }

        const trade = await Trade.findById(tradeId);
        if (!trade) return res.status(404).json({ success: false, message: "ไม่พบข้อมูลการแลกเปลี่ยน" });

        // 🛡️ ดักความปลอดภัย: คนที่จะกดตอบรับได้ ต้องเป็นเจ้าของของ (receiveId) เท่านั้น!
        if (trade.receiveId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์ตัดสินใจข้อเสนอนี้" });
        }

        // อัปเดตสถานะใบเสนอเป็น ตกลง หรือ ปฏิเสธ
        trade.status = status;
        await trade.save();

        // 🔥 เวทมนตร์: ถ้ายอมรับแลก ให้เปลี่ยนสถานะสินค้าทั้งหมดเป็น "TRADED" อัตโนมัติ!
        if (status === "ACCEPTED") {
            const allItemIds = [...trade.offerItems, ...trade.requestedItems];
            
            // สั่ง Database ให้แก้สถานะรวดเดียวจบ!
            await Product.updateMany(
                { _id: { $in: allItemIds } },
                { $set: { status: "TRADED" } }
            );
        }

        res.status(200).json({ 
            success: true, 
            message: `คุณได้ ${status === 'ACCEPTED' ? 'ตกลง' : 'ปฏิเสธ'} การแลกเปลี่ยนแล้ว`, 
            data: trade 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};