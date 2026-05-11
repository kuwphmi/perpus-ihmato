import snap from "../config/midtrans.js";
import supabase from "../config/supabase.js";

// CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  try {

    const { user_id, items, loan_id } = req.body;

    if (!user_id || !items) {
      return res.status(400).json({
        message: "user_id dan items wajib",
      });
    }

    const order_id = `ORDER-${Date.now()}`;

    const gross_amount = items.reduce((sum, item) => {
      return sum + item.price * (item.qty || 1);
    }, 0);

    // MIDTRANS PARAMETER
    const parameter = {
      transaction_details: {
        order_id,
        gross_amount,
      },

      item_details: items.map((item) => ({
        id: item.book_key,
        price: item.price,
        quantity: item.qty || 1,
        name: item.title,
      })),
    };

    // CREATE MIDTRANS TRANSACTION
    const transaction = await snap.createTransaction(parameter);

    console.log("MASUK CONTROLLER");
    console.log("REQ BODY:", req.body);
    console.log("ITEMS:", items);
    console.log("USER:", user_id);

    // SAVE TO DATABASE
    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          user_id,
          loan_id: loan_id || null,
          order_id,
          amount: gross_amount,
          status: "pending",
          payment_method: "midtrans",

          snap_token: transaction.token,

          title: items[0]?.title || null,
          author: items[0]?.author || null,
          cover: items[0]?.cover || null,
        },
      ])
      .select();

    if (error) throw error;

    // RESPONSE
    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// MIDTRANS NOTIFICATION
export const midtransNotification = async (req, res) => {

  try {

    const status = req.body.transaction_status;
    const order_id = req.body.order_id;

    console.log("MIDTRANS NOTIF:", req.body);

    // SUCCESS
    if (status === "settlement") {

      await supabase
        .from("payments")
        .update({
          status: "success",
        })
        .eq("order_id", order_id);

    }

    // PENDING
    if (status === "pending") {

      await supabase
        .from("payments")
        .update({
          status: "pending",
        })
        .eq("order_id", order_id);

    }

    // EXPIRED
    if (status === "expire") {

      await supabase
        .from("payments")
        .update({
          status: "expired",
        })
        .eq("order_id", order_id);

    }

    // CANCELLED
    if (status === "cancel") {

      await supabase
        .from("payments")
        .update({
          status: "cancelled",
        })
        .eq("order_id", order_id);

    }

    res.sendStatus(200);

  } catch (err) {

    console.log(err);

    res.sendStatus(500);

  }

};

// GET USER PAYMENTS
export const getPayments = async (req, res) => {

  try {

    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};