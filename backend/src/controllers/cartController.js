import supabase from "../config/supabase.js";

/* ======================
   TAMBAH KE CART
====================== */
export const addToCart = async (req, res) => {

  try {

    const {
      user_id,
      book_key,
      title,
      author,
      cover,
      price,
      stock,
    } = req.body;

    // cek item sudah ada belum
    const { data: existing, error: checkError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user_id)
      .eq("book_key", book_key)
      .single();

    // kalau ada → tambah qty
    if (existing) {

      const { data, error } = await supabase
        .from("cart")
        .update({
          qty: existing.qty + 1,
        })
        .eq("id", existing.id)
        .select();

      if (error) throw error;

      return res.json({
        message: "Qty bertambah",
        data,
      });

    }

    // kalau belum ada → insert baru
    const { data, error } = await supabase
      .from("cart")
      .insert([
        {
          user_id,
          book_key,
          title,
          author,
          cover,
          price,
          stock,
          qty: 1,
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      message: "Berhasil masuk keranjang",
      data,
    });

  } catch (error) {

    res.status(500).json({
      message: "Gagal tambah cart",
      error: error.message,
    });

  }

};

/* ======================
   GET CART USER
====================== */
export const getCart = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal ambil cart",
      error: error.message,
    });
  }
};

/* ======================
   DELETE ITEM CART
====================== */
export const removeCart = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      message: "Item dihapus dari cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal hapus cart",
      error: error.message,
    });
  }
};