import express from "express";
import { createTransaction } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.post("/notification", midtransNotification); // 🔥 ini webhook
export default router;