import express from "express";
import bukuRoutes from "./routes/bukuRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/buku", bukuRoutes);

export default app;