import { supabase } from "../config/supabase.js";

export const getBuku = async (req, res) => {
  const { data, error } = await supabase
    .from("buku")
    .select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
};