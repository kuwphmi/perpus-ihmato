import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

/* =========================
   TEST
========================= */
router.get("/test", (req, res) => {
  res.json({
    status: true,
    message: "Fav genre jalan 🚀",
  });
});

/* =========================
   SAVE GENRES
========================= */
router.post("/", async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const { user_id, genres } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: false,
        message: "user_id kosong",
      });
    }

    if (!Array.isArray(genres)) {
      return res.status(400).json({
        status: false,
        message: "genres harus array",
      });
    }

    const insertData = genres.map((genre) => ({
      user_id,
      category: genre,
    }));

    console.log("INSERT:", insertData);

    const { data, error } = await supabase
      .from("fav_genres")
      .insert(insertData)
      .select();

    if (error) {

      console.log("SUPABASE ERROR:", error);

      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      data,
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });

  }
});

/* =========================
   GET GENRES USER
========================= */
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("fav_genres")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      data,
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

/* =========================
   DELETE GENRE
========================= */
router.delete("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const { error } = await supabase
      .from("fav_genres")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Genre berhasil dihapus",
    });

  } catch (err) {

    return res.status(500).json({
      status: false,
      message: err.message,
    });

  }
});

export default router;