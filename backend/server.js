import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import supabase from "./src/config/supabase.js";

import bukuRoutes from "./src/routes/bukuRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend nyambung 🚀");
});

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("buku").select("*");

  if (error) {
    return res.json({ status: "error", message: error.message });
  }

  res.json({ status: "success", data });
});

app.use("/api/buku", bukuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", reportRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});