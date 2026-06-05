import supabase from "../config/supabase.js";

/* ================= SAVE FAVORITE GENRES ================= */

export const saveFavGenres = async (req, res) => {
  const { user_id, categories } = req.body;

  try {
    if (!user_id || !Array.isArray(categories)) {
      return res.status(400).json({
        status: false,
        message: "user_id or categories invalid",
      });
    }

    // hapus duplikat
    const uniqueCategories = [
      ...new Set(
        categories.map((c) => c.trim())
      ),
    ];

    // maksimal 3 genre
    if (uniqueCategories.length > 3) {
      return res.status(400).json({
        status: false,
        message: "Maximum 3 favorite genres",
      });
    }

    // hapus genre lama user
    const { error: deleteError } = await supabase
      .from("fav_genres")
      .delete()
      .eq("user_id", user_id);

    if (deleteError) throw deleteError;

    // simpan genre baru
    const payload = uniqueCategories.map((category) => ({
      user_id,
      category,
    }));

    const { error: insertError } = await supabase
      .from("fav_genres")
      .insert(payload);

    if (insertError) throw insertError;

    return res.json({
      status: true,
      message: "Favorite genres saved",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};