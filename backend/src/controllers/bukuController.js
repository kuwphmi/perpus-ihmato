import supabase from "../config/supabase.js";

export const getBuku = async (req, res) => {
  const { data, error } = await supabase
    .from("books")
    .select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(
    data.map((item) => ({
      ...item,
      cover_url: item.cover, // 🔥 INI FIX UTAMA
    }))
  );
};