import User from "../models/User.model.js";
import Product from "../models/Product.model.js";

// ระบบสร้างสินค้าสำหรับลงขาย หรือ เทรด
export const createProduct = async(req,res) => {
    try{
        const { 
            productName, productDescription, category, 
            condition, tradeType, price, wishlist, 
            images, tags, shopId 
        } = req.body;

        //สร้างสินค้าใหม่ และเอาไอดีของคนที่ login มาใส่
        const newProduct = await Product.create({
            ownerId: req.user._id,
            shopId: shopId, 
            productName,
            productDescription,
            category,
            condition,
            tradeType,
            price,
            wishlist,
            images,
            tags
        });

        res.status(201).json({success:true , message:"ลงประกาศสินค้าสำเร็จ" , data:newProduct});

    }catch(error){
        console.log(`create product controller error : ${error}`);
        res.status(500).json({success:false , message:`Server Error : ${error}`});
    }
}

// ระบบกรองค้นหาข้อมูลสินค้า
export const getAllProducts = async(req,res) => {
    try{
        const {category , search} = req.query;

        let query = {status:"AVAILABLE"};

        if (category) query.category = category;
        if (search) query.productName = { $regex: search, $options: "i" };

        const products = await Product.find(query)
            .populate("ownerId", "username imageProfile") // ✅ แก้เป็น imageProfile ตาม Model
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: products.length, data: products });
    }catch(error){
        console.log(`get all products controller error : ${error}`);
        res.status(500).json({success:false , message:`Server Error : ${error}` , data:products});
    }
}

//ระบบแสดงรายละเอียดสินค้า
export const getProductById = async (req,res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {$inc:{views:1}},
            {new:true}
        ).populate("ownerId" , "username email imageProfile");

        if (!product) {
            return res.status(404).json({ success: false, message: "ไม่พบข้อมูลสินค้านี้" });
        }

        res.status(200).json({ success: true, data: product });
    }catch(error){
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: "รูปแบบ ID ไม่ถูกต้อง" });
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด", error: error.message });
    }
}

//ระบบดูคลังสินค้าของเรา
export const getMyProducts = async(req,res) => {
    try{
        const myProducts = await Product.find({ ownerId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: myProducts.length, data: myProducts });
    }catch(error){
        console.log(`getMyProducts controller error : ${error}`);
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}

//ระบบเปลี่ยนแปลงรายละเอียดสินค้า
export const updateProduct = async(req,res) => {
    try{
        let product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({success : false , message : "ไม่พบข้อมูลสินค้า"});
        }

        if (product.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์แก้ไขสินค้านี้" });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body,
            { new: true, 
              runValidators: true 
            });

        res.status(200).json({ success: true, message: "แก้ไขข้อมูลสำเร็จ!", data: product });

    }catch(error){
        console.log(`updatecontroller error : ${error}`);
        res.status(500).json({success:false,message : `Server Error : ${error}`});
    }
}

//ระบบการลบข้อมูลสินค้า
export const deleteProduct = async (req, res) => {
    try {
        // 1. ตามหาเป้าหมายที่ต้องการลบ
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "ไม่พบข้อมูลสินค้า" });

        // 2. 🛡️ ด่านตรวจความปลอดภัย: ใครสั่งลบ?
        if (product.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์ลบสินค้านี้" });
        }

        // 3. สั่งประหาร! (ลบทิ้งออกจาก Database)
        await product.deleteOne();

        // 4. ส่งข้อความยืนยันการลบ
        res.status(200).json({ success: true, message: "ลบสินค้าเรียบร้อยแล้ว" });
    } catch (error) {
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด", error: error.message });
    }
};

// ✅ ระบบใหม่ที่เติมให้: ดึงสินค้าทั้งหมดของร้านค้านั้นๆ (ใช้โชว์ในหน้า Shop Profile)
export const getProductsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        const products = await Product.find({ shopId: shopId, status: "AVAILABLE" })
            .populate("ownerId", "username imageProfile")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.log(`getProductsByShop error : ${error}`);
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}