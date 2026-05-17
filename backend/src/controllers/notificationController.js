import supabase from "../config/supabase.js";

export const getNotifications =
  async (req, res) => {

    try {

      const { user_id } =
        req.params;

      const {
        data,
        error,
      } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", {
          ascending: false,
        });

      if (error)
        throw error;

      res.json(data);

    } catch (err) {

      res.status(500).json({
        error:
          err.message,
      });

    }

  };

  export const markNotificationsRead =
  async (req, res) => {

    try {

      const { user_id } =
        req.params;

      await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("user_id", user_id);

      res.json({
        success: true,
      });

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

};