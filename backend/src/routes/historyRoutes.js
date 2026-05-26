import express from "express";

import {
  getHistoryDetail
} from "../controllers/historyController.js";

const router = express.Router();

router.get(
  "/history/detail/:id",
  getHistoryDetail
);

export default router;