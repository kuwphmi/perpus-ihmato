import snap from "../config/midtrans.js";
import supabase from "../config/supabase.js";

/* =========================
   CREATE TRANSACTION
========================= */
export const createTransaction =
  async (req, res) => {

    try {

      const {
        user_id,
        items,
        loan_id,
        address_id,
      } = req.body;

      // VALIDATION
      if (
        !user_id ||
        !items ||
        items.length === 0
      ) {

        return res.status(400).json({
          message:
            "user_id dan items wajib",
        });

      }

      // ORDER ID
      const order_id =
        `ORDER-${Date.now()}`;

      // TOTAL PRICE
      const gross_amount =
        items.reduce((sum, item) => {

          return (
            sum +
            item.price *
            (item.qty || 1)
          );

        }, 0);

      /* =========================
         MIDTRANS PARAMETER
      ========================= */
      const parameter = {

        transaction_details: {
          order_id,
          gross_amount,
        },

        callbacks: {

          finish:
            "http://localhost:5173/trackingbuku",

          pending:
            "http://localhost:5173/trackingbuku",

          error:
            "http://localhost:5173/trackingbuku",

        },

        item_details:
          items.map((item) => ({

            id: item.book_key,

            price: item.price,

            quantity:
              item.qty || 1,

            name: item.title,

          })),

      };

      /* =========================
         CREATE MIDTRANS
      ========================= */
      const transaction =
        await snap.createTransaction(
          parameter
        );

      /* =========================
         SAVE DATABASE
      ========================= */
      const { error } =
        await supabase
          .from("payments")
          .insert([
            {
              user_id,
              address_id,

              loan_id:
                loan_id || null,

              order_id,

              amount:
                gross_amount,

              // PAYMENT STATUS
              payment_status:
                "pending",

              // ORDER STATUS
              order_status:
                "waiting_payment",

              payment_method:
                "midtrans",

              snap_token:
                transaction.token,

              redirect_url:
                transaction.redirect_url,

              title:
                items[0]?.title ||
                null,

              author:
                items[0]?.author ||
                null,

              cover:
                items[0]?.cover ||
                null,

            },
          ]);

      if (error) throw error;

      /* =========================
         RESPONSE
      ========================= */
      res.json({

        token:
          transaction.token,

        redirect_url:
          transaction.redirect_url,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* =========================
   MIDTRANS WEBHOOK
========================= */
export const midtransNotification =
  async (req, res) => {

    try {

      const transaction_status =
        req.body.transaction_status;

      const order_id =
        req.body.order_id;

      console.log(
        "MIDTRANS NOTIFICATION:",
        req.body
      );

      let payment_status =
        "pending";

      let order_status =
        "waiting_payment";

      /* =========================
         SUCCESS PAYMENT
      ========================= */
      if (

        transaction_status ===
        "settlement" ||

        transaction_status ===
        "capture"

      ) {

        payment_status =
          "paid";

        order_status =
          "processing";

      }

      /* =========================
         PENDING
      ========================= */
      else if (
        transaction_status ===
        "pending"
      ) {

        payment_status =
          "pending";

        order_status =
          "waiting_payment";

      }

      /* =========================
         EXPIRED
      ========================= */
      else if (
        transaction_status ===
        "expire"
      ) {

        payment_status =
          "expired";

        order_status =
          "cancelled";

      }

      /* =========================
         FAILED / CANCEL
      ========================= */
      else if (

        transaction_status ===
        "cancel" ||

        transaction_status ===
        "deny"

      ) {

        payment_status =
          "failed";

        order_status =
          "cancelled";

      }

      /* =========================
         UPDATE DATABASE
      ========================= */
      const { error } =
        await supabase
          .from("payments")
          .update({

            payment_status,

            order_status,

          })
          .eq(
            "order_id",
            order_id
          );

      if (error) throw error;

      res.sendStatus(200);

    } catch (err) {

      console.log(err);

      res.sendStatus(500);

    }

  };

/* =========================
   GET USER PAYMENTS
========================= */
export const getPayments =
  async (req, res) => {

    try {

      const { user_id } =
        req.params;

      const { data, error } =
        await supabase
          .from("payments")
          .select("*")
          .eq(
            "user_id",
            user_id
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) throw error;

      res.json(data);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };

  export const cancelOrder =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      // cek order dulu
      const { data: order } =
        await supabase
          .from("payments")
          .select("*")
          .eq("id", id)
          .single();

      // kalau sudah diproses
      if (
        order.order_status !==
        "waiting_payment"
      ) {

        return res.status(400).json({
          message:
            "Order cannot be cancelled",
        });

      }

      // delete
      const { error } =
        await supabase
          .from("payments")
          .delete()
          .eq("id", id);

      if (error)
        throw error;

      res.json({
        success: true,
      });

    } catch (err) {

      res.status(500).json({
        error:
          err.message,
      });

    }

  };