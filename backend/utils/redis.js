import Redis from "ioredis";

// ดึง URL มาจาก .env ที่นายน้อยเพิ่งวางค่าไปครับ
const redis = new Redis(process.env.REDIS_URL); 

redis.on("connect", () => console.log("✅ Upstash Redis Connected!"));
redis.on("error", (err) => console.log("❌ Redis Error:", err));

export default redis;