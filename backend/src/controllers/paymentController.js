import snap from "../config/midtrans.js";
import supabase from "../config/supabase.js";

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

    const transaction = await snap.createTransaction(parameter);

    await supabase.from("payments").insert([
      {
        user_id,
        loan_id: loan_id || null,
        order_id,
        amount: gross_amount,
        status: "pending",
        payment_method: "midtrans",
      },
    ]);

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });

  } catch (error) {
    res.status(500).json({
      message: "Payment error",
      error: error.message,
    });
  }
};

// 🔥 INI DI LUAR FUNCTION
export const midtransNotification = async (req, res) => {
  try {

    const status = req.body.transaction_status;
    const order_id = req.body.order_id;

    console.log("NOTIF MIDTRANS:", req.body);

    if (status === "settlement") {
      await supabase
        .from("payments")
        .update({ status: "success" })
        .eq("order_id", order_id);
    }

    if (status === "pending") {
      await supabase
        .from("payments")
        .update({ status: "pending" })
        .eq("order_id", order_id);
    }

    if (status === "expire" || status === "cancel") {
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("order_id", order_id);
    }

    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};