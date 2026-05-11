import express from "express";

import {
  saveAddress,
  getAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/", saveAddress);

router.get("/:user_id", getAddress);

export default router;