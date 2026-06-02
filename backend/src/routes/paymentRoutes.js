import express from "express";
import {
  createTransaction,
  midtransNotification,
  getPayments,
  cancelOrder, 
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.post("/notification", midtransNotification);
router.get("/:user_id", getPayments);
router.delete("/cancel/:id", cancelOrder);

export default router;