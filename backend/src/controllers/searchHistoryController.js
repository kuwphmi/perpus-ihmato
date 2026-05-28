import supabase from "../config/supabase.js";

/* =========================
   ADD SEARCH HISTORY
========================= */
export const addSearchHistory = async (
  req,
  res
) => {
  try {

    const {
      user_id,
      keyword,
      source,
    } = req.body;

    const { data, error } =
      await supabase
        .from("search_history")
        .insert([
          {
            user_id,
            keyword,
            source,
          },
        ])
        .select();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.json(data);

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });

  }
};

/* =========================
   GET SEARCH HISTORY
========================= */
export const getSearchHistory = async (
  req,
  res
) => {
  try {

    const { user_id } =
      req.params;

    const { data, error } =
      await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", {
          ascending: false,
        })
        .limit(10);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.json(data);

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });

  }
};