import express from "express";
import {
  createTransaction,
  midtransNotification,
  getPayments,
  cancelOrder,
} from "../controllers/paymentController.js";

const router = express.Router();

// create payment
router.post("/create", createTransaction);

// 🔥 INI WEBHOOK MIDTRANS
router.post("/notification", midtransNotification);

// get history
router.get("/:user_id", getPayments);

// cancel
router.delete("/cancel/:order_id", cancelOrder);

export default router;