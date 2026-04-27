import express from "express";
import cors from "cors";
import supabase from "./src/config/supabase.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend nyambung ke Supabase 🚀");
});

// 🔥 TEST KONEKSI
app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("buku")
    .select("*");

  if (error) {
    return res.json({
      status: "error",
      message: error.message
    });
  }

  res.json({
    status: "success",
    data: data
  });
});

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});