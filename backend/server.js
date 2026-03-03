import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import "dotenv/config"


const app = express();
const PORT = process.env.PORT || 5000

//Middle Ware
app.use(cors());
app.use(express.json());
app.use(cookieParser());



app.get("/" , (req,res) => {
    res.send(`Server is Running on Port : ${PORT}`);
})

app.listen(PORT , (req,res) => {
    console.log(`Server is Running on Port : ${PORT}`);
})
