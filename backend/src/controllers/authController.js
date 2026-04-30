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
