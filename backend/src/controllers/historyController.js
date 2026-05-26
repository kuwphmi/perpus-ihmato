import supabase from "../config/supabase.js";

export const getHistoryDetail = async (req, res) => {

  try {

    const { id } = req.params;

    // =========================
    // REQUEST BOOK
    // =========================
    if (id.startsWith("request-")) {

      const realId =
        id.replace("request-", "");

      const { data, error } =
        await supabase
          .from("loan_requests")
          .select("*")
          .eq("id", realId)
          .single();

      if (error || !data) {

        return res.status(404).json({
          message: "Data tidak ditemukan",
        });

      }

      return res.json({
        ...data,
        id: `request-${data.id}`,
        loan_date: data.request_date,
        due_date: null,
      });

    }

    // =========================
    // LOAN BOOK
    // =========================
    const { data, error } =
      await supabase
        .from("loans")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {

      return res.status(404).json({
        message: "Data tidak ditemukan",
      });

    }

    return res.json(data);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: err.message,
    });

  }

};