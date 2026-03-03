import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true , "สินค้าต้องมีเจ้าของ"],
        ref:"User"
    },
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true , "สินค้าต้องระบุร้านค้า"],
        ref:"Shop"
    },
    productName:{
        type:String,
        required:[true , "กรุณาระบุชื่อของสินค้า"],
        trim:true,
        unique:true,
        maxlength:[100 , "ชื่อสินค้าควรมีขนาดความยาวไม่เกิน 100 ตัวอักษร"]
    },
    productDescription:{
        type:String,
        required:[true , "กรุณากรอกรายละเอียของสินค้า"],    
    },
    images:{
        type:[String],
        validate:[arrayLimit , "ใส่รูปภาพได้สูงสุด 5 รูปภาพ"]
    },
    // หมวดมหู่
    category:{
        type:String,
        enum:["weapon", "armor", "potion", "electronics", "clothing", "other"],
        required:[true , "กรุณาเลือกหมวดหมู่"]
    },
    condition: {
        type: String, // สภาพของ
        enum: ["NEW", "USED_LIKE_NEW", "USED_GOOD", "USED_FAIR"],
        default: "USED_GOOD"
    },
    tags:{
        type:[String],
        validate:[tagLimit , "ใส่ tag ได้สูงสุด 10 tag"]
    },

    // ระบบการซื้อขาย trade
    tradeType:{
        type:String,
        enum:["SELL_ONLY" , "TRADE_ONLY" , "BOTH"],
        default:"BOTH"
    },
    price:{
        type:Number,
        min:[0 , "ราคาต้องไม่ติดลบ"],
        default:0
    },
    wishlist:{
        type:String,
        maxlength:[200 , "ความยาวต้องไม่เกิน 200 ตัวอักษร"],
        default:"รับพิจารณาทุกข้อเสนอ"
    },

    // เก็บสถานะสินค้า
    status:{
        type:String,
        enum:["AVAILABLE" , "HIDDEN" , "TRADING" , "SOLD" , "TRADED"],
        default:"AVAILABLE"
    },
    views:{
        type:Number,
        default:0
    }

},{timestamps:true})

// เช็คจำนวนรูปภาพใน Array
function arrayLimit(val) {
    return val.length <= 5;
}

// เช็คจำนวนแท็กใน Array
function tagLimit(val) {
    return val.length <= 10;
}

const Product = mongoose.model("Product" , productSchema);
export default Product;