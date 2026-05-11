import supabase from "../config/supabase.js";

export const saveAddress = async (req, res) => {

  try {

    const {
      user_id,
      receiver_name,
      phone,
      province,
      city,
      district,
      postal_code,
      full_address,
    } = req.body;

    const { data, error } = await supabase
      .from("addresses")
      .upsert([
        {
          user_id,
          receiver_name,
          phone,
          province,
          city,
          district,
          postal_code,
          full_address,
        },
      ])
      .select();

    if (error) throw error;

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message,
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
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};