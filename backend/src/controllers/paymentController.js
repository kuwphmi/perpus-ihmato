import snap from "../config/midtrans.js";
import supabase from "../config/supabase.js";
import crypto from "crypto";

/* =========================
   CREATE TRANSACTION
========================= */
export const createTransaction = async (req, res) => {
  try {
    const { user_id, items, address_id, delivery_type } = req.body;

    if (!user_id || !items || items.length === 0) {
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

  callbacks: {
    finish: "http://localhost:5173/trackingorder",
  },
};

    const transaction = await snap.createTransaction(parameter);

    const { error } = await supabase.from("payments").insert([
      {
        user_id,
        address_id,
        order_id,
        amount: gross_amount,
        payment_status: "pending",
        order_status: "waiting_payment",
        payment_method: "midtrans",
        delivery_type,
        snap_token: transaction.token,
        redirect_url: transaction.redirect_url,
        title: items[0]?.title || null,
        author: items[0]?.author || null,
        cover: items[0]?.cover || null,
      },
    ]);

    if (error) throw error;

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   WEBHOOK MIDTRANS
========================= */
export const midtransNotification = async (req, res) => {
  try {
    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      signature_key,
    } = req.body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      return res.status(403).send("Invalid signature");
    }

    let payment_status = "pending";
    let order_status = "waiting_payment";

    if (["settlement", "capture"].includes(transaction_status)) {
      payment_status = "paid";
      order_status = "processing";
    } else if (transaction_status === "expire") {
      payment_status = "expired";
      order_status = "cancelled";
    } else if (["cancel", "deny"].includes(transaction_status)) {
      payment_status = "failed";
      order_status = "cancelled";
    }

    const { error } = await supabase
      .from("payments")
      .update({ payment_status, order_status })
      .eq("order_id", order_id);

    if (error) throw error;

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

/* =========================
   GET PAYMENTS
========================= */
export const getPayments = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CANCEL ORDER
========================= */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error: fetchError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.order_status !== "waiting_payment") {
      return res.status(400).json({
        message: "Order cannot be cancelled",
      });
    }

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};