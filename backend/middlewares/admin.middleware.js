export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: "เข้าถึงเฉพาะผู้ดูแลระบบเท่านั้น" });
    }
};
