import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import bukuRoutes from "./src/routes/bukuRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors()); // biar frontend bisa akses backend
app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
/* ======================
   ROUTES
====================== */
app.use("/api/buku", bukuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", reportRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", authRoutes);

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Backend aktif 🚀");
});

/* ======================
   ERROR HANDLING (opsional tapi bagus)
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

export default app;
