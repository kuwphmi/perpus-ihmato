import express from "express";
import passport from "passport";
import upload from "../middleware/upload.js";

import {
  register,
  login,
  updateProfile,
  googleCallback,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put(
  "/update-profile",
  upload.single("profile_image"),
  updateProfile
);
/* =======================
   GOOGLE LOGIN
======================= */

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  googleCallback
);
export default router;