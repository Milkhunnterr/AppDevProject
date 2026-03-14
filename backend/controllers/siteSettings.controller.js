import SiteSettings from "../models/SiteSettings.model.js";

export const getSiteSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.findOne();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSiteSettings = async (req, res) => {
    try {
        const { banner } = req.body;
        const settings = await SiteSettings.findOneAndUpdate({}, { banner }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
