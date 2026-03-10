import Shop from "../models/Shop.model.js";

// 📝 1. เปิดร้านค้าใหม่ (1 คน มีได้ 1 ร้าน)
export const createShop = async (req, res) => {
    try {
        const { shopName, shopDescription, shopLogo, shopBanner } = req.body;

        // เช็คก่อนว่าเคยเปิดร้านไปหรือยัง?
        const existingShop = await Shop.findOne({ ownerId: req.user._id });
        if (existingShop) {
            return res.status(400).json({ success: false, message: "คุณมีร้านค้าอยู่แล้ว ไม่สามารถเปิดซ้ำได้" });
        }

        // เช็คชื่อร้านซ้ำ
        const nameTaken = await Shop.findOne({ shopName });
        if (nameTaken) {
            return res.status(400).json({ success: false, message: "ชื่อร้านนี้ถูกใช้งานแล้ว กรุณาตั้งชื่อใหม่" });
        }

        const newShop = await Shop.create({
            ownerId: req.user._id,
            shopName,
            shopDescription: shopDescription || "ยินดีต้อนรับสู่ร้านค้าของเรา",
            shopLogo: shopLogo || "",
            shopBanner: shopBanner || ""
        });

        res.status(201).json({ success: true, message: "เปิดร้านค้าสำเร็จ!", data: newShop });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// 🔍 2. ดึงข้อมูลร้านค้าทั้งหมด (เอาไปโชว์หน้า รวมร้านค้าเด็ด)
export const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find({ status: "active" })
            .populate("ownerId", "username imageProfile")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: shops.length, data: shops });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// 🏠 3. ดูข้อมูลหน้าร้าน (Shop Profile)
export const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate("ownerId", "username imageProfile trustScore");
        if (!shop) {
            return res.status(404).json({ success: false, message: "ไม่พบร้านค้านี้" });
        }
        res.status(200).json({ success: true, data: shop });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// ✏️ 4. แก้ไขข้อมูลร้านค้า
export const updateShop = async (req, res) => {
    try {
        let shop = await Shop.findById(req.params.id);
        if (!shop) return res.status(404).json({ success: false, message: "ไม่พบร้านค้านี้" });

        // เจ้าของร้านเท่านั้นที่แก้ได้
        if (shop.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์แก้ไขร้านค้านี้" });
        }

        shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: "อัปเดตข้อมูลร้านค้าสำเร็จ", data: shop });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};