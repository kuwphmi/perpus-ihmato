import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Cek email sudah ada
  const { data: existing } = await supabase
    .from("users") // ← ganti ke "users"
    .select("id")
    .eq("email", email)
    .single();

  if (existing) return res.json({ status: false, message: "Email sudah dipakai" });

  const hashed = await bcrypt.hash(password, 10);

   const year = new Date().getFullYear().toString().slice(-2);

  const { count } = await supabase
    .from("users")
    .select("*", {
      count: "exact",
      head: true,
    });

  const sequence = String((count || 0) + 1).padStart(4, "0");

  const memberCode = `${year}${sequence}`;

  const { error } = await supabase.from("users").insert({
    // ← ganti ke "users"
    name,
    email,
    password: hashed,
    phone,
  });

  if (error) return res.json({ status: false, message: error.message });

  res.json({ status: true, message: "Register berhasil" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users") // ← ganti ke "users"
    .select("*")
    .eq("email", email)
    .single();

  if (!user) return res.json({ status: false, message: "Email tidak ditemukan" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ status: false, message: "Password salah" });

  res.json({ status: true, user });
};

export const updateProfile = async (req, res) => {
  const { id, name, phone, birth, gender } = req.body;

  const { data, error } = await supabase.from("users").update({ name, phone, birth, gender }).eq("id", id).select().single();

  if (error) return res.json({ status: false, message: error.message });

  res.json({ status: true, user: data });
};

export const googleCallback = async (req, res) => {
  try {
    const profile = req.user;

    const email = profile.emails[0].value;

    // cek user ada di database
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // kalau akun tidak ada
    if (!existingUser) {
      return res.redirect(
        "http://localhost:5173/login"
      );
    }

    // encode data user
    const userData = encodeURIComponent(
      JSON.stringify(existingUser)
    );

    // redirect ke frontend
    return res.redirect(
      `http://localhost:5173/google-success?user=${userData}`
    );

  } catch (err) {
    console.log(err);

    return res.redirect(
      "http://localhost:5173/login"
    );
  }
}; 