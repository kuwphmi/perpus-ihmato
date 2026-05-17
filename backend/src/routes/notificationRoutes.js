import express from "express";

import {
  getNotifications,
  markNotificationsRead,
} from "../controllers/notificationController.js";

const router =
  express.Router();

router.get(
  "/:user_id",
  getNotifications
);

router.put(
  "/read/:user_id",
  markNotificationsRead
);

export default router;