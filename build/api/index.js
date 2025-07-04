"use strict";
// D:\Nengxiong\Next JS\Shop\fashion-shop-api\api\index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// *** สำคัญ: Import app instance จาก src/server.ts ***
const server_1 = __importDefault(require("../src/server"));
// *** สิ่งสำคัญ: Export Express app instance ออกไปสำหรับ Vercel ***
// Vercel จะใช้ app ที่ export จากไฟล์นี้ไปรันเป็น Serverless Function
exports.default = server_1.default;
