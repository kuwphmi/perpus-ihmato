import express from "express";
import cors from "cors";
import supabase from "./src/config/supabase.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("Backend nyambung ke Supabase 🚀");
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

    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
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

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

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
    const {
      user_id,
      title,
      author,
      cover,
      price,
      stock,
    } = req.body;

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

    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user_id)
      .order("id", { ascending: false });

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

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("id", id);

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
   START SERVER
======================= */
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});