import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";


import supabase from "./src/config/supabase.js";
import "./src/config/passport.js";

import bukuRoutes from "./src/routes/bukuRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import historyRoutes from "./src/routes/historyRoutes.js";
import favGenreRoutes from "./src/routes/favGenreRoutes.js";
import searchHistoryRoutes from "./src/routes/searchHistoryRoutes.js";
import recommendationRoutes from "./src/routes/recommendationRoutes.js";
import {
  checkDueReminders, 
  checkLateLoans,
} from "./src/controllers/loanController.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("Backend nyambung 🚀");
});

/* =======================
   TEST DB
======================= */

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("buku").select("*");

  if (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }

  return res.json({
    status: true,
    data,
  });
});

/* =======================
   REGISTER
======================= */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.json({
        status: false,
        message: "Field tidak boleh kosong",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return res.json({
        status: false,
        message: error?.message || "Auth gagal",
      });
    }

    const user = data.user;

    /* =======================
   GENERATE MEMBER CODE
======================= */
    const { count } = await supabase.from("users").select("*", {
      count: "exact",
      head: true,
    });

    const memberCode = String((count || 0) + 1).padStart(4, "0");

    /* =======================
   INSERT USER
======================= */
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
          member_code: `24${memberCode}`,
          name,
          email,
          phone,
          role: "user",
        },
      ])
      .select()
      .single();

    if (insertError) {
      await supabase.auth.admin.deleteUser(user.id);

      return res.json({
        status: false,
        message: "Gagal simpan ke database",
      });
    }

    return res.json({
      status: true,
      message: "Register sukses",
      data: insertData,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   LOGIN
======================= */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    const user = data.user;

    const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single();

    if (profileError) {
      return res.json({
        status: false,
        message: "User tidak ada di tabel users",
      });
    }

    return res.json({
      status: true,
      token: data.session.access_token,
      user: profile,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   AJUKAN PEMINJAMAN
======================= */

app.post("/api/loan-requests", async (req, res) => {
  try {
    const { user_id, book_key, title, author, cover } = req.body;

    const { data, error } = await supabase
      .from("loan_requests")
      .insert([
        {
          user_id,
          book_key,
          book_title: title,
          author,
          cover,
          request_date: new Date().toISOString(),
          status: "pending",
        },
      ])
      .select();

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Pengajuan berhasil dikirim",
      data: data[0],
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   TAMBAH CART
======================= */
app.post("/api/cart", async (req, res) => {

  try {

    const {
      user_id,
      title,
      author,
      cover,
      price,
      stock,
    } = req.body;

    // ================= CEK ITEM SUDAH ADA =================

  const cleanTitle = title.trim().toLowerCase();

const { data: existing, error: existingError } = await supabase
  .from("cart")
  .select("*")
  .eq("user_id", user_id);

if (existingError) {
  return res.json({
    status: false,
    message: existingError.message,
  });
}

const sameBook = (existing || []).find(
  (item) =>
    item.title?.trim().toLowerCase() === cleanTitle
);

if (sameBook) {

  await supabase
    .from("cart")
    .update({
      qty: (sameBook.qty || 1) + 1,
    })
    .eq("id", sameBook.id);

  return res.json({
    status: true,
    message: "Qty updated",
  });

}

    // ================= INSERT BARU =================

    const { data, error } =
      await supabase
        .from("cart")
        .insert([
          {
            user_id,
            title,
            author,
            cover,
            price,
            stock,
            qty: 1,
          },
        ])
        .select();

    if (error) {

      return res.json({
        status: false,
        message: error.message,
      });

    }

    return res.json({
      status: true,
      data: data?.[0] || null,
    });

  } catch (err) {

    return res.json({
      status: false,
      message: err.message,
    });

  }

});
/* =======================
   GET CART
======================= */
app.get("/api/cart/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase.from("cart").select("*").eq("user_id", user_id).order("id", { ascending: false });

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      data,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   HAPUS CART
======================= */
app.delete("/api/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("cart").delete().eq("id", id);

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Item dihapus",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   DELETE ADDRESS
======================= */
app.delete("/api/address/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("addresses").delete().eq("id", id);

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Address deleted",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

app.use("/api/admin", adminRoutes);
app.use("/api/buku", bukuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", reportRoutes);
app.use("/api", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", historyRoutes);
app.use("/api/fav-genres", favGenreRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/recommendations", recommendationRoutes);
/* =======================
   ADMIN DASHBOARD
======================= */
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const [{ count: totalMembers }, { count: totalLoans }, { count: totalReturns }, { count: totalLoanRequests }, { count: totalExtensionRequests }] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("loans").select("*", { count: "exact", head: true }),
      supabase.from("loans").select("*", { count: "exact", head: true }).eq("status", "returned"),
      supabase.from("loan_requests").select("*", { count: "exact", head: true }),
      supabase.from("extensions").select("*", { count: "exact", head: true }),
    ]);

    return res.json({
      total_loans: totalLoans || 0,
      total_members: totalMembers || 0,
      total_returns: totalReturns || 0,
      total_requests: (totalLoanRequests || 0) + (totalExtensionRequests || 0),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/* =======================
   ADMIN MEMBERS
======================= */
app.get("/api/admin/members", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json(data);
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   ADMIN RETURNS
======================= */
app.get("/api/admin/returns", async (req, res) => {
  try {
    const { data, error } = await supabase.from("loans").select("*").eq("status", "returned");

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json(data);
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   RETURN BOOK
======================= */
app.post("/api/admin/loans/:id/return", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("loans")
      .update({
        status: "returned",
        return_date: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    // 1. cek error dulu
    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    // 2. cek apakah data benar-benar ada
    if (!data || data.length === 0) {
      return res.json({
        status: false,
        message: "Data tidak ditemukan / ID salah",
      });
    }

    // 3. success
    return res.json({
      status: true,
      message: "Buku berhasil dikembalikan",
      data: data[0], // lebih clean daripada kirim array
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   ADMIN LOAN REQUESTS
======================= */
app.get("/api/admin/loan-requests", async (req, res) => {
  try {
    const { data: requests, error } = await supabase.from("loan_requests").select("*").order("id", { ascending: false });

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    const userIds = requests.map((item) => item.user_id);

    const { data: users } = await supabase.from("users").select("id, name, member_code").in("id", userIds);

    const formatted = requests.map((item) => {
      const user = users.find((u) => u.id === item.user_id);

      return {
        id: item.id,
        member_code: user?.member_code || "-",
        member_name: user?.name || "-",
        book_title: item.book_title,
        request_date: item.request_date,
        status: item.status,
      };
    });

    return res.json(formatted);
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   REJECT LOAN REQUEST
======================= */

app.post("/api/admin/loan-requests/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: requestData } = await supabase.from("loan_requests").select("*").eq("id", id).single();

    const { error } = await supabase
      .from("loan_requests")
      .update({
        status: "rejected",
      })
      .eq("id", id);

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Pengajuan ditolak",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   REQUEST EXTENSION
======================= */

app.post("/api/extensions/request", async (req, res) => {
  try {
    const { user_id, loan_id, book_title, old_due_date, new_due_date, status } = req.body;

    const { data, error } = await supabase
      .from("extensions")
      .insert([
        {
          user_id,
          loan_id,
          book_title,
          old_due_date,
          new_due_date,
          status,
        },
      ])
      .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Extension request submitted",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   ADMIN EXTENSION REQUESTS
======================= */
app.get("/api/admin/extension-requests", async (req, res) => {
  try {
    const { data: extensions, error } = await supabase.from("extensions").select("*").order("id", { ascending: false });

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    const userIds = extensions.map((item) => item.user_id);

    const { data: users } = await supabase.from("users").select("id, name, member_code").in("id", userIds);

    const formatted = extensions.map((item) => {
      const user = users.find((u) => u.id === item.user_id);

      return {
        id: item.id,

        // INI YANG PENTING
        member_code: user?.member_code || "-",

        member_name: user?.name || "-",
        book_title: item.book_title || "-",
        old_due_date: item.old_due_date || "-",
        new_due_date: item.new_due_date || "-",
        status: item.status || "pending",
      };
    });

    return res.json(formatted);
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   APPROVE EXTENSION
======================= */

app.post("/api/admin/extension-requests/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    // ambil extension
    const { data: extension, error } = await supabase.from("extensions").select("*").eq("id", id).single();

    if (error || !extension) {
      return res.json({
        status: false,
        message: "Data tidak ditemukan",
      });
    }

    // update loans
    await supabase
      .from("loans")
      .update({
        due_date: extension.new_due_date,
      })
      .eq("id", extension.loan_id);

    // update status extension
    await supabase
      .from("extensions")
      .update({
        status: "approved",
      })
      .eq("id", id);

    return res.json({
      status: true,
      message: "Perpanjangan disetujui",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   REJECT EXTENSION
======================= */

app.post("/api/admin/extension-requests/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("extensions")
      .update({
        status: "rejected",
      })
      .eq("id", id);

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Perpanjangan ditolak",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   PRINT REPORT
======================= */
app.get("/api/admin/report/monthly/pdf", async (req, res) => {
  try {
    const { month, year } = req.query;

    const { data: loans, error } = await supabase.from("loans").select("id, user_id, title, status, loan_date");

    const userIds = loans.map((l) => l.user_id);

    const { data: users } = await supabase.from("users").select("id, member_code");

    const formatted = loans.map((loan) => {
      const user = users.find((u) => u.id === loan.user_id);

      return {
        ...loan,
        member_code: user?.member_code || "-",
      };
    });

    if (error) {
      return res.send(error.message);
    }

    let html = `
      <html>
      <head>
        <title>Laporan Bulanan</title>

        <style>
          body{
            font-family: Arial;
            padding:20px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          }

          th, td{
            border:1px solid #ccc;
            padding:10px;
            text-align:left;
          }

          h1{
            margin-bottom:10px;
          }
        </style>
      </head>

      <body>
        <h1>Laporan Peminjaman</h1>
        <p>Bulan: ${month}</p>
        <p>Tahun: ${year}</p>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul Buku</th>
              <th>Status</th>
              <th>Tanggal Pinjam</th>
            </tr>
          </thead>

          <tbody>
    `;

    formatted.forEach((item) => {
      html += `
        <tr>
          <td>${item.member_code}</td>
          <td>${item.title || "-"}</td>
          <td>${item.status || "-"}</td>
          <td>${item.loan_date || "-"}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>

        <script>
          window.print()
        </script>

      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    res.send(err.message);
  }
});

/* =======================
   USER HISTORY
======================= */

app.get("/api/history/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // ambil loans
    const { data: loans, error: loansError } = await supabase.from("loans").select("*").eq("user_id", user_id);

    // ambil loan requests
    const { data: requests, error: requestsError } = await supabase.from("loan_requests").select("*").eq("user_id", user_id);

    if (loansError || requestsError) {
      return res.json({
        status: false,
        message: loansError?.message || requestsError?.message,
      });
    }

    // format loans
    const formattedLoans = (loans || []).map((item) => ({
      ...item,
      history_type: "loan",
    }));

    // format requests
    const formattedRequests = (requests || [])
      .filter((item) => item.status === "pending")
      .map((item) => ({
        id: `request-${item.id}`,
        title: item.book_title,
        author: item.author,
        cover: item.cover,
        loan_date: item.request_date,
        due_date: null,
        status: item.status,
        history_type: "request",
      }));

    // gabung
    const combined = [...formattedLoans, ...formattedRequests];

    // urut terbaru
    combined.sort((a, b) => new Date(b.loan_date) - new Date(a.loan_date));

    return res.json(combined);
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   GET NOTIFICATIONS
======================= */

app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json(data);
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
});

/* =======================
   GOOGLE LOGIN
======================= */

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const profile = req.user;

      // cek user sudah ada atau belum
      const { data: existingUser } = await supabase.from("users").select("*").eq("email", profile.emails[0].value).single();

      // kalau belum ada → insert
      if (!existingUser) {
        const { count } = await supabase.from("users").select("*", {
          count: "exact",
          head: true,
        });

        const memberCode = String((count || 0) + 1).padStart(4, "0");

        await supabase.from("users").insert([
          {
            name: profile.displayName,
            email: profile.emails[0].value,
            member_code: `24${memberCode}`,
            role: "user",
          },
        ]);
      }

      res.redirect("http://localhost:5173");
    } catch (err) {
      res.send(err.message);
    }
  },
);

/* =======================
   FORGOT PASSWORD
======================= */
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ status: false, message: "Email tidak boleh kosong" });
    }

    // Gunakan resetPasswordForEmail dengan options yang benar
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      return res.json({ status: false, message: error.message });
    }

    return res.json({ status: true, message: "Email terkirim" });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
});

/* =======================
   DETAIL HISTORY
======================= */

app.get("/api/history/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.from("loans").select("*").eq("id", id).single();

    if (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

checkDueReminders();
checkLateLoans();

setInterval(async () => {

  await checkDueReminders();

  await checkLateLoans();

}, 1000 * 60 * 60);

/* =======================
   START SERVER
======================= */
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
