import express from "express";
import {
  getBorrowBooks,
  getShopBooks,
  getRecommendation,
} from "../controllers/bukuController.js";

const router = express.Router();

// Buku untuk dipinjam (borrow_books)
router.get("/", getBorrowBooks);

// Buku untuk dijual (books)
router.get("/shop", getShopBooks);

// Rekomendasi
router.get("/recommendation/:userId", getRecommendation);

export default router;