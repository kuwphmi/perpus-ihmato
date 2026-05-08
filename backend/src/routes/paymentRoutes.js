import express from "express";

import {
  createTransaction,
  midtransNotification,
} from "../controllers/paymentController.js";

const router = express.Router();

/* =========================
   CREATE PAYMENT
========================= */
router.post("/create", createTransaction);

/* =========================
   MIDTRANS WEBHOOK
========================= */
router.post("/notification", midtransNotification);

export default router;