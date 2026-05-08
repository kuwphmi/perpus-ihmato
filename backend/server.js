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
import reportRoutes from "./src/routes/reportRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
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
   UPDATE PROFILE
======================= */
app.put("/api/update-profile", async (req, res) => {
  try {
    const { id, name, nik, birth, gender } = req.body;

    if (!id) {
      return res.json({
        status: false,
        message: "ID user tidak ditemukan",
      });
    }

    const { error } = await supabase
      .from("users")
      .update({
        name,
        nik,
        birth,
        gender,
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
      message: "Profil berhasil diupdate",
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
    const { user_id, title, author, cover, price, stock } = req.body;

    const { data, error } = await supabase
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

app.use("/api/buku", bukuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", reportRoutes);
app.use("/api", authRoutes);
app.use("/api/cart", cartRoutes);
/* =======================
   ADMIN DASHBOARD
======================= */
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const { count: totalMembers } = await supabase.from("users").select("*", { count: "exact", head: true });

    const { count: totalLoans } = await supabase.from("loans").select("*", { count: "exact", head: true });

    const { count: totalReturns } = await supabase.from("loans").select("*", { count: "exact", head: true }).eq("status", "returned");

    const { count: totalLoanRequests } = await supabase.from("loan_requests").select("*", { count: "exact", head: true });

    const { count: totalExtensionRequests } = await supabase.from("extensions").select("*", { count: "exact", head: true });

    const totalRequests = (totalLoanRequests || 0) + (totalExtensionRequests || 0);

    return res.json({
      total_loans: totalLoans || 0,
      total_members: totalMembers || 0,
      total_returns: totalReturns || 0,
      total_requests: totalRequests || 0,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
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
   ADMIN LOANS
======================= */
app.get("/api/admin/loans", async (req, res) => {
  try {
    const { data: loans, error } = await supabase.from("loans").select("*");

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    const userIds = loans.map((item) => item.user_id);

    const { data: users } = await supabase.from("users").select("id, name, member_code").in("id", userIds);

    const formatted = loans.map((loan) => {
      const user = users.find((u) => u.id === loan.user_id);

      return {
        loan_id: loan.id, // ini unik
        member_code: user?.member_code || "-",
        member_name: user?.name || "-",
        book_title: loan.title,
        loan_date: loan.loan_date,
        due_date: loan.due_date,
        status: loan.status,
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
   APPROVE LOAN REQUEST
======================= */

app.post("/api/admin/loan-requests/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    // ambil request
    const { data: requestData, error: requestError } = await supabase.from("loan_requests").select("*").eq("id", id).single();

    if (requestError || !requestData) {
      return res.json({
        status: false,
        message: "Pengajuan tidak ditemukan",
      });
    }

    // insert ke loans
    const { error: loanError } = await supabase.from("loans").insert([
      {
        user_id: requestData.user_id,
        book_key: requestData.book_key,
        title: requestData.book_title,
        author: requestData.author,
        cover: requestData.cover,
        loan_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "borrowed",
      },
    ]);

    if (loanError) {
      return res.json({
        status: false,
        message: loanError.message,
      });
    }

    // update request jadi approved
    // update request jadi approved
await supabase
  .from("loan_requests")
  .update({
    status: "approved",
  })
  .eq("id", id);

// kirim notifikasi
await supabase
  .from("notifications")
  .insert([
    {
      user_id: requestData.user_id,
      type: "loan_approved",
      title: "Peminjaman Disetujui",
      message: `Pengajuan buku "${requestData.book_title}" telah disetujui admin.`,
      is_read: false,
    },
  ]);

    return res.json({
      status: true,
      message: "Pengajuan disetujui",
    });
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

    const { data: requestData } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("id", id)
      .single();

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
    const { loan_id } = req.body;

    // ambil data loan
    const { data: loan, error: loanError } = await supabase.from("loans").select("*").eq("id", loan_id).single();

    if (loanError || !loan) {
      return res.json({
        status: false,
        message: "Data pinjaman tidak ditemukan",
      });
    }

    // cek apakah sudah pernah ajukan
    const { data: existing } = await supabase.from("extensions").select("*").eq("loan_id", loan_id).eq("status", "pending");

    if (existing && existing.length > 0) {
      return res.json({
        status: false,
        message: "Perpanjangan sudah diajukan",
      });
    }

    // tambah extension request
    const { error } = await supabase.from("extensions").insert([
      {
        loan_id: loan.id,
        user_id: loan.user_id,
        book_title: loan.title,
        old_due_date: loan.due_date,
        new_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
      },
    ]);

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Pengajuan perpanjangan berhasil",
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
        member_name: user?.name || "-",
        book_title: item.book_title || "-",
        old_due_date: item.old_due_date || "-",
        new_due_date: item.new_due_date,
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
          <<td>${item.member_code}</td>
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

    const { data, error } = await supabase.from("loans").select("*").eq("user_id", user_id).order("loan_date", { ascending: false });

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
   AJUKAN PERPANJANGAN
======================= */

app.post("/api/extensions", async (req, res) => {
  try {
    const { user_id, loan_id, book_title, old_due_date, new_due_date, status } = req.body;

    const { error } = await supabase.from("extensions").insert([
      {
        user_id,
        loan_id,
        book_title,
        old_due_date,
        new_due_date,
        status,
      },
    ]);

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    return res.json({
      status: true,
      message: "Perpanjangan diajukan",
    });
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

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

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
   START SERVER
======================= */
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
