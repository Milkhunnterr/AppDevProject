import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema({
    banner: {
        title: { type: String, default: "เทศกาลแลกของ" },
        subtitle: { type: String, default: "ลดค่าธรรมเนียม 50%" },
        description: { type: String, default: 'ใช้โค้ด "TRADE50" เมื่อทำการยืนยันการแลกเปลี่ยน' },
        buttonText: { type: String, default: "ดูรายละเอียด" },
        promoCode: { type: String, default: "TRADE50" },
        isActive: { type: Boolean, default: true }
    }
}, { timestamps: true });

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

// Ensure there's always at least one settings document
export const initializeSettings = async () => {
    try {
        const count = await SiteSettings.countDocuments();
        if (count === 0) {
            await SiteSettings.create({});
            console.log("Site settings initialized");
        }
    } catch (error) {
        console.error("Error initializing site settings:", error);
    }
};

export default SiteSettings;
