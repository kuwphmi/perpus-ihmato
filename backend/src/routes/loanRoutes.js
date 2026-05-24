import express from "express";

import {
  createLoanRequest,
  checkBorrowLimit,
  approveLoan,
} from "../controllers/loanController.js";

const router = express.Router();

router.post("/", createLoanRequest);

router.get(
  "/check/:user_id",
  checkBorrowLimit
);

router.put(
  "/approve-loan/:id",
  approveLoan
);

export default router;