import express from "express";
import {
  chatAI,
  getBookRecommendation,
} from "../controllers/aiController.js";
const router = express.Router();

router.post("/chat", chatAI);
router.post(
  "/recommend-books",
  getBookRecommendation
);
export default router;