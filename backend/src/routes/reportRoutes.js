import express from "express";
import { generateReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/report", generateReport);

export default router;