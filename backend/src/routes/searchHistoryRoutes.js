import express from "express";
import {
  addSearchHistory,
  getSearchHistory,
} from "../controllers/searchHistoryController.js";

const router = express.Router();

/* TEST */
router.get("/test", (req, res) => {
  res.send("SEARCH HISTORY NYAMBUNG");
});

/* TAMBAH HISTORY */
router.post("/", addSearchHistory);

/* GET HISTORY USER */
router.get("/:user_id", getSearchHistory);

export default router;