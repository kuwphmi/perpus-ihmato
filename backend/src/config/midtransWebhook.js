import supabase from "../config/supabase.js";

export const midtransNotification = async (req, res) => {
  try {
    const { transaction_status, order_id } = req.body;

    console.log("WEBHOOK:", req.body);

    let payment_status = "pending";
    let order_status = "waiting_payment";

    // SUCCESS
    if (transaction_status === "settlement" || transaction_status === "capture") {
      payment_status = "paid";
      order_status = "processing";
    }

    // PENDING
    else if (transaction_status === "pending") {
      payment_status = "pending";
      order_status = "waiting_payment";
    }

    // EXPIRED
    else if (transaction_status === "expire") {
      payment_status = "expired";
      order_status = "cancelled";
    }

    // FAILED
    else if (transaction_status === "cancel" || transaction_status === "deny") {
      payment_status = "failed";
      order_status = "cancelled";
    }

    const { error } = await supabase
      .from("payments")
      .update({
        payment_status,
        order_status,
      })
      .eq("order_id", order_id);

    if (error) throw error;

    return res.sendStatus(200);

  } catch (err) {
    console.log("WEBHOOK ERROR:", err);
    return res.sendStatus(500);
  }
};