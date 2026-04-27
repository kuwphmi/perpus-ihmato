import express from "express";
import { getBuku } from "../controllers/bukuController.js";

const router = express.Router();

router.get("/", getBuku);

export default router;