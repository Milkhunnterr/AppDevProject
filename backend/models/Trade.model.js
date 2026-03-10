import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    requestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true , "ต้องระบุผู้ยื่นข้อเสนอ"]
    },
    receiveId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true , "ต้องระบุผู้รับข้อเสนอ"]
    },
    offerItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true , "กรุณาระบุของที่จะนำไปแลก"]
    }],
    requestedItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true , "กรุณาระบุของที่อยากได้"]
    }],
    message:{
        type:String,
        maxlength:[500 , "ข้อความต้องมีขนาดความยาวไม่เกิน 500 ตัวอักษร"]
    },
    offerMoney:{
        type:Number,
        default:0
    },
    requestedMoney:{
        type:Number,
        default:0
    },
    delivered:{
        type:String,
        enum:["MEETUP" , "SHIPPING" , "UNKNOWN"],
        default:"UNKNOWN"
    },
    meetupLocation:{
        type:String,
        default:""
    },
    expiredAt:{
        type:Date
    },
    trackingNumber: { type: String }, // เติมเลขพัสดุ
    shippingCompany: { type: String }, // เติมบริษัทขนส่ง
    status:{
        type:String,
        enum:["PENDING" , "ACCEPTED" , "REJECTED" , "SHIPPED", "CANCELLED" , "COMPLETED"],
        default:"PENDING"
    }
} , {timestamps:true});

const Trade = mongoose.model("Trade" , tradeSchema);
export default Trade;