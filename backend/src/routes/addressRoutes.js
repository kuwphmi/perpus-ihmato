import express from "express";

import {
  saveAddress,
  getAddress,
  setPrimaryAddress,
} from "../controllers/addressController.js";

const router = express.Router();

// save address
router.post("/", saveAddress);

// get all address by user
router.get("/:user_id", getAddress);

// set primary address
router.put("/primary/:id", setPrimaryAddress);

export default router;