// D:\Nengxiong\Next JS\Shop\fashion-shop-api\src\server.ts

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./docs/swagger.json"; // Path นี้จะยังคงเหมือนเดิม

import dotenv from "dotenv";
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ******************************
// ตั้งค่า CORS (สำคัญมากเมื่อ Deploy)
// สำหรับ Local Dev อาจจะตั้งค่ากว้างๆ ก่อน แล้วค่อยปรับให้ละเอียดเมื่อ Deploy
// ******************************
const allowedOrigins = [
    'http://localhost:3000', // Front-end Dev Server
    'http://localhost:4000', // หากคุณรัน API ใน Localhost แล้ว Front-end อยู่คนละ port
    // เพิ่ม URL ของ fashion-shop-web ที่ Deploy บน Vercel เมื่อคุณได้ URL นั้นแล้ว
    // ตัวอย่าง: 'https://fashion-shop-web-xxxx.vercel.app' 
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin. So cool';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// *****************************************

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/", (req, res) => {
    res.send("API is running");
});

app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        res.json(user);
    } catch (err) {
        console.error("Error during registration:", err);
        if (err instanceof Error && 'code' in err && err.code === 'P2002') {
            res.status(409).json({ error: "ລາຍຊື່ນີ້ມີຜູ້ໃຊ້ຢູ່ແລ້ວ!" });
        } else {
            res.status(500).json({ error: "Something went wrong during registration." });
        }
    }
});

// **********************************************
// ส่วนของ app.listen() สำหรับ Local Development เท่านั้น
// Vercel จะไม่รันไฟล์นี้โดยตรง
// **********************************************
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// *** สิ่งสำคัญ: Export Express app instance เพื่อให้ api/index.ts ดึงไปใช้ได้ ***
export default app;