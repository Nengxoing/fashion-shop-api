import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./docs/swagger.json";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/", (req, res) => {
    res.send("API is running");
})

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
        res.status(500).json({ error: "ລາຍຊື່ນີ້ມີຜູ້ໃຊ້ຢູ່ແລ້ວ!" })
    }
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});