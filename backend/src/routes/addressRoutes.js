import express from "express";

import {
  saveAddress,
  getAddress,
  setPrimaryAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/", saveAddress);

router.get("/:user_id", getAddress);

router.put("/primary/:id", setPrimaryAddress);

router.put("/:id", updateAddress);

router.delete("/:id", deleteAddress);

export default router;