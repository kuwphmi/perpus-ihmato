import express from "express";
import * as admin from "../controllers/adminController.js";

const router = express.Router();

/* ================= DASHBOARD ================= */
router.get("/dashboard", admin.getDashboard);

/* ================= MANAGE BOOKS ================= */
router.get("/books", admin.getBooks);
router.post("/books", admin.addBooks);

/* ================= LOANS ================= */
router.get("/loans", admin.getLoans);
router.post("/loans/:id/return", admin.markAsReturned);

/* ================= LOAN REQUESTS ================= */
router.get("/loan-requests", admin.getLoanRequests);
router.post("/loan-requests/:id/approve", admin.approveLoanRequest);
router.post("/loan-requests/:id/reject", admin.rejectLoanRequest);

/* ================= MEMBERS ================= */
router.get("/members", admin.getMembers);

/* ================= RETURNS ================= */
router.get("/returns", admin.getReturns);

/* ================= EXTENSIONS ================= */
router.get("/extension-requests", admin.getExtensions);
router.post("/extension-requests/:id/approve", admin.approveExtension);
router.post("/extension-requests/:id/reject", admin.rejectExtension);

export default router;