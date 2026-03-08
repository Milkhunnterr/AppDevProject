import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    // ฝั่งคนยื่นข้อเสนอ
    requestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true , "ต้องระบุผู้ยื่นข้อเสนอ"]
    },
    // ฝั่งคนรับข้อเสนอ
    receiveId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true , "ต้องระบุผู้รับข้อเสนอ"]
    },
    //ของที่เราเอาไปเสนอแลก
    offerItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true , "กรุณาระบุของที่จะนำไปแลก"]
    }],
    //ของที่เราอยากได้จากเขา
    requestedItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true , "กรุณาระบุของที่อยากได้"]
    }],
    //ข้อความที่แนบไปตอนกำลังดำเนินงาน
    message:{
        type:String,
        maxlength:[500 , "ข้อความต้องมีขนาดความยาวไม่เกิน 500 ตัวอักษร"]
    },
    // เงินส่วนต่างที่เราต้องการกรณีที่ของเรามีมูลค่ามากกว่า
    offerMoney:{
        type:Number,
        default:0
    },
    // เงินส่วนต่างที่เรายินดีจะจ่ายให้เขา ตามข้อตกลง
    requestedMoney:{
        type:Number,
        default:0
    },
    // ระบุว่าจะส่งของกันยังไง
    delivered:{
        type:String,
        enum:["MEETUP" , "SHIPPING" , "UNKNOWN"],
        default:"UNKNOWN"
    },
    // กรณีที่มีการนัดรับสินค้ากัน
    meetupLocation:{
        type:String,
        default:""
    },
    // คำขอนี้จะหมดอายุตอนไหน
    expiredAt:{
        type:Date
    },
    //สถานะของการดำเนินการเทรด
    status:{
        type:String,
        enum:["PENDING" , "ACCEPTED" , "REJECTED" , "CANCELLED" , "COMPLETED"],
        default:"PENDING"
    }
} , {timestamps:true});

const Trade = mongoose.model("Trade" , tradeSchema);
export default Trade;