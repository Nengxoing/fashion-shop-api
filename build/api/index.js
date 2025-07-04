"use strict";
// D:\Nengxiong\Next JS\Shop\fashion-shop-api\api\index.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// *** สำคัญ: ปรับเส้นทางสำหรับ swagger.json เพราะตอนนี้ index.ts อยู่ในโฟลเดอร์ api ***
const swagger_json_1 = __importDefault(require("../src/docs/swagger.json"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// ******************************
// ตั้งค่า CORS (สำคัญมากเมื่อ Deploy)
// ******************************
// คุณอาจจะต้องเปลี่ยน 'http://localhost:3000' และ 'https://your-web-project.vercel.app'
// ให้เป็น URL ของ Front-end (fashion-shop-web) ของคุณจริงๆ
const allowedOrigins = [
    'http://localhost:3000', // สำหรับ Front-end ที่รันในโหมด Dev
    // เพิ่ม URL ของ fashion-shop-web ที่ Deploy บน Vercel เมื่อคุณได้ URL นั้นแล้ว
    // ตัวอย่าง: 'https://fashion-shop-web-xxxx.vercel.app' 
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// ******************************
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.get("/", (req, res) => {
    res.send("API is running");
});
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        res.json(user);
    }
    catch (err) {
        // Log ข้อผิดพลาดจริงเพื่อการ Debug (ไม่แสดงให้ผู้ใช้เห็นโดยตรง)
        console.error("Error during registration:", err);
        // ตรวจสอบว่าเป็น Unique constraint error หรือไม่ (เฉพาะถ้าใช้ Prisma)
        if (err instanceof Error && 'code' in err && err.code === 'P2002') {
            res.status(409).json({ error: "ລາຍຊື່ນີ້ມີຜູ້ໃຊ້ຢູ່ແລ້ວ!" }); // 409 Conflict สำหรับ Duplicate entry
        }
        else {
            res.status(500).json({ error: "Something went wrong during registration." });
        }
    }
}));
// *** สำคัญ: ลบ app.listen() ออก เพราะ Vercel จัดการเอง ***
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
// *** สิ่งสำคัญ: Export Express app instance ออกไป ***
exports.default = app;
