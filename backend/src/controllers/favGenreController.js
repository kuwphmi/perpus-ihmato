import supabase from "../config/supabase.js";

/* ================= SAVE FAVORITE GENRES ================= */

export const saveFavGenres =
  async (req, res) => {

    const {
      user_id,
      categories,
    } = req.body;

    try {

      // bikin payload array
      const payload =
        categories.map(
          (category) => ({
            user_id,
            category,
          })
        );

      const { error } =
        await supabase
          .from("fav_genres")
          .insert(payload);

      if (error)
        throw error;

      res.json({
        status: true,
        message:
          "Favorite genres saved",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        status: false,
        error: err.message,
      });

    }

  };

/* ================= DELETE OLD GENRES ================= */

export const deleteFavGenres =
  async (req, res) => {

    const { user_id } =
      req.params;

    try {

      const { error } =
        await supabase
          .from("fav_genres")
          .delete()
          .eq("user_id", user_id);

      if (error)
        throw error;

      res.json({
        status: true,
        message:
          "Old genres deleted",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        status: false,
        error: err.message,
      });

    }

  };