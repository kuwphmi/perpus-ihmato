import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

// ─── Password Strength Helper ──────────────────────────────────────────────
function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
const strengthLabels = ["Lemah", "Cukup", "Kuat", "Sangat Kuat"];

// ─── Google Icon ──────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
      <span className="text-white font-semibold text-base tracking-tight">BukuIn</span>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────
function Field({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
      />
    </div>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────
function SidePanel({ title, description, dotIndex, bgColor }) {
  return (
    <div className={`hidden md:flex flex-col justify-between w-2/5 p-12 ${bgColor} relative overflow-hidden`}>
      {/* Decorative circles */}
      <div className="absolute w-64 h-64 rounded-full border-40 border-white/5 -bottom-20 -left-16" />
      <div className="absolute w-40 h-40 rounded-full border-30 border-white/5 -top-10 -right-10" />

      <Logo />

      <div className="relative z-10">
        <h2 className="text-white font-semibold text-xl leading-snug mb-3">{title}</h2>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === dotIndex ? "w-5 bg-white" : "w-1.5 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── LOGIN FORM (SUDAH KE DATABASE) ───────────────────────────────────────
function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      if (res.data.status) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/halamanutama"); // sesuaikan route kamu
      } else {
        alert(res.data.message || "Login gagal");
      }
    } catch (error) {
      console.log(error);
      alert("Server error / backend belum jalan");
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-8 md:px-12 py-10 max-w-md w-full mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Masuk ke akun</h1>

        <p className="text-sm text-gray-500">
          Belum punya akun?{" "}
          <button onClick={onSwitch} className="text-blue-700 font-medium hover:underline">
            Daftar sekarang
          </button>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Alamat Email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="flex flex-col gap-1.5">
          <Field label="Kata Sandi" type="password" placeholder="Masukkan kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="text-right">
            <button type="button" className="text-xs text-blue-700 hover:underline">
              Lupa kata sandi?
            </button>
          </div>
        </div>

        <button type="submit" className="mt-1 h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all">
          Masuk
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />

        <span className="text-xs text-gray-400">atau lanjutkan dengan</span>

        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button className="flex items-center justify-center gap-2.5 h-11 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
        <GoogleIcon />
        Masuk dengan Google
      </button>
    </div>
  );
}

// ─── REGISTER FORM (SUDAH KE DATABASE) ────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    agree: false,
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) return alert("Setujui syarat dulu");

    try {
      await axios.post("http://localhost:8000/api/register", {
        name: form.firstName + " " + form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      alert("Register berhasil");
      onSwitch();
    } catch (error) {
      console.log(error);
      alert("Register gagal");
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-8 md:px-12 py-10 max-w-md w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Daftar</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Nama Depan" value={form.firstName} onChange={set("firstName")} />
        <Field label="Nama Belakang" value={form.lastName} onChange={set("lastName")} />
        <Field label="Email" value={form.email} onChange={set("email")} />
        <Field label="No HP" value={form.phone} onChange={set("phone")} />
        <Field label="Password" type="password" value={form.password} onChange={set("password")} />

        <label>
          <input type="checkbox" checked={form.agree} onChange={set("agree")} /> Setuju
        </label>

        <button className="h-11 bg-blue-700 text-white rounded-lg">Daftar</button>
      </form>

      <button onClick={onSwitch} className="text-blue-600 mt-4">
        Sudah punya akun?
      </button>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex min-h-130">
        {/* Side Panel */}
        {isLogin ? (
          <SidePanel bgColor="bg-blue-700" dotIndex={0} title="Selamat datang kembali!" description="Masuk ke akun Anda untuk melanjutkan dan mengakses semua fitur yang tersedia." />
        ) : (
          <SidePanel bgColor="bg-blue-900" dotIndex={1} title="Bergabung bersama kami hari ini" description="Buat akun gratis dan nikmati semua fitur platform kami tanpa batas waktu." />
        )}

        {/* Form Area */}
        {isLogin ? <LoginForm onSwitch={() => setMode("register")} /> : <RegisterForm onSwitch={() => setMode("login")} />}
      </div>
    </div>
  );
}
