import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import "dotenv/config"
import authRoute from "./routes/authRoute.js"
import productRoute from "./routes/productRoute.js"


const app = express();
const PORT = process.env.PORT || 5000

//Middle Ware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRoute);
app.use("/api/products",productRoute);