import express from "express";

import {
  createTransaction,
  midtransNotification,
  getPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// CREATE PAYMENT
router.post(
  "/create",
  createTransaction
);

// MIDTRANS WEBHOOK
router.post(
  "/notification",
  midtransNotification
);

// GET USER PAYMENT
router.get(
  "/:user_id",
  getPayments
);

export default router;