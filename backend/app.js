import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";

import bukuRoutes from "./src/routes/bukuRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import favGenreRoutes from "./src/routes/favGenreRoutes.js";

const app = express();

/* ======================
   MIDDLEWARE
====================== */
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: frontendUrl }));

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Backend aktif 🚀");
});

app.get("/api/fav-genres/test", (req, res) => {
  res.send("FAV GENRE WORK");
});

/* ======================
   ROUTES
====================== */
app.use("/api/buku", bukuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", reportRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", authRoutes);
app.use("/api/fav-genres", favGenreRoutes);

/* ======================
   ERROR HANDLER
====================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Terjadi kesalahan server",
  });
});

/* ======================
   SERVER RUN
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
