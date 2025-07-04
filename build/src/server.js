"use strict";
// D:\Nengxiong\Next JS\Shop\fashion-shop-api\src\server.ts
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
const swagger_json_1 = __importDefault(require("./docs/swagger.json")); // Path นี้จะยังคงเหมือนเดิม
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
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
        console.error("Error during registration:", err);
        if (err instanceof Error && 'code' in err && err.code === 'P2002') {
            res.status(409).json({ error: "ລາຍຊື່ນີ້ມີຜູ້ໃຊ້ຢູ່ແລ້ວ!" });
        }
        else {
            res.status(500).json({ error: "Something went wrong during registration." });
        }
    }
}));
// **********************************************
// ส่วนของ app.listen() สำหรับ Local Development เท่านั้น
// Vercel จะไม่รันไฟล์นี้โดยตรง
// **********************************************
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// *** สิ่งสำคัญ: Export Express app instance เพื่อให้ api/index.ts ดึงไปใช้ได้ ***
exports.default = app;
