import supabase from "../config/supabase.js";

export const createLoanRequest = async (req, res) => {

  try {

    const {
      user_id,
      title,
      author,
      cover,
      book_key,
    } = req.body;

    // cek pinjaman aktif
    const { data: existingLoans, error: checkError } =
      await supabase
        .from("loan_requests")
        .select("*")
        .eq("user_id", user_id)
        .in("status", ["pending", "approved"]);

    if (checkError) throw checkError;

    // maksimal 2 buku
    if (existingLoans.length >= 2) {

      return res.json({
        status: false,
        message: "Borrow limit reached",
      });

    }

    // insert
    const { data, error } = await supabase
      .from("loan_requests")
      .insert([
        {
          user_id,
          title,
          author,
          cover,
          book_key,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      status: true,
      message: "Borrow request submitted",
      data,
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: error.message,
    });

  }

};