// D:\Nengxiong\Next JS\Shop\fashion-shop-api\api\index.ts

// *** สำคัญ: Import app instance จาก src/server.ts ***
import app from '../src/server';

// *** สิ่งสำคัญ: Export Express app instance ออกไปสำหรับ Vercel ***
// Vercel จะใช้ app ที่ export จากไฟล์นี้ไปรันเป็น Serverless Function
export default app;