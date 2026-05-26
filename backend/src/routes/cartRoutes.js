import express from "express";
import {
  addToCart,
  getCart,
  removeCart,
  updateQty,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/:user_id", getCart);
router.delete("/:id", removeCart);
router.put("/:id", updateQty);

export default router;

