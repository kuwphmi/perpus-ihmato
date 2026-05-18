import supabase from "../config/supabase.js";

export const saveAddress = async (req, res) => {

  try {
console.log(req.body);
    const {
      user_id,
      label,
      receiver_name,
      phone,
      district,
      postal_code,
      full_address,
      is_primary,
    } = req.body;

    const { data, error } = await supabase
      .from("addresses")
      .insert([
        {
          user_id,
          label,
          receiver_name,
          phone,
          district,
          postal_code,
          full_address,
          is_primary,
        }
      ])
      .select();

    if (error) throw error;

    res.json({
      status: true,
      data,
      message: "Address saved successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });

  }

};

export const getAddress = async (req, res) => {

  try {

    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user_id)
      .order("is_primary", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });

  }

};

export const setPrimaryAddress = async (req, res) => {

  try {

    const { id } = req.params;

    // ambil alamat dipilih
    const { data: selected, error: selectError } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", id)
      .single();

    if (selectError) throw selectError;

    // reset semua alamat user
    await supabase
      .from("addresses")
      .update({
        is_primary: false,
      })
      .eq("user_id", selected.user_id);

    // set primary baru
    const { error } = await supabase
      .from("addresses")
      .update({
        is_primary: true,
      })
      .eq("id", id);

    if (error) throw error;

    res.json({
      status: true,
      message: "Primary address updated",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });

  }

};

/* ================= UPDATE ================= */

export const updateAddress =
  async (req, res) => {

    const { id } = req.params;

    try {

      const { error } =
        await supabase
          .from("addresses")
          .update({

            label:
              req.body.label,

            receiver_name:
              req.body.receiver_name,

            phone:
              req.body.phone,

            district:
              req.body.district,

            postal_code:
              req.body.postal_code,

            full_address:
              req.body.full_address,

          })
          .eq("id", id);

      if (error) throw error;

      res.json({
        message:
          "Address updated",
      });

    } catch (err) {

      res.status(500).json({
        error:
          err.message,
      });

    }

};

/* ================= DELETE ================= */
export const deleteAddress =
  async (req, res) => {

    const { id } = req.params;

    try {

      const { error } =
        await supabase
          .from("addresses")
          .delete()
          .eq("id", id);

      if (error) throw error;

      res.json({
        message:
          "Address deleted",
      });

    } catch (err) {

      res.status(500).json({
        error:
          err.message,
      });

    }

};