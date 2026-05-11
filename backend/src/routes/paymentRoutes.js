import express from "express";

import {
  createTransaction,
  midtransNotification,
  getPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createTransaction);

router.post("/notification", midtransNotification);

router.get("/:user_id", getPayments);

export default router;