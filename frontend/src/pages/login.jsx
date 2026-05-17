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
const strengthLabels = ["Weak", "Fair", "Strong", "Very Strong"];

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
      <span className="text-white font-semibold text-base tracking-tight"></span>
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

// ─── LOGIN FORM ───────────────────────────────────────────────────────────
function LoginForm({ onSwitch, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        }
      );

      if (!res.data.status) {
        alert(res.data.message);
        return;
      }

      const user = res.data.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      // CEK ROLE
      if (user.role === "admin") {
        navigate("/admin");
        return;
      }

      // CEK PROFIL MEMBER
      if (!user?.nik || !user?.birth || !user?.gender) {
        navigate("/profil");
      } else {
        navigate("/koleksi");
      }

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };


  return (
    <div className="flex flex-1 flex-col justify-center px-8 md:px-12 py-10 max-w-md w-full mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Sign in to your account</h1>
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-blue-700 font-medium hover:underline">
            Create one now
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email Address" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex flex-col gap-1.5">
          <Field label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="text-right">
            {/* ← Tombol lupa kata sandi dihubungkan ke onForgot */}
            <button type="button" onClick={onForgot} className="text-xs text-blue-700 hover:underline">
              Forgot password?
            </button>
          </div>
        </div>
        <button type="submit" className="mt-1 h-11 bg-gradient-to-br from-blue-700 to-blue-900 bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all">
          Sign In
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or continue with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button
        onClick={() => {
          window.location.href = "http://localhost:3000/api/auth/google";
        }}
        className="flex items-center justify-center gap-2.5 h-11 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
      >
        <GoogleIcon />
        Login with Google
      </button>
    </div>
  );
}

  // ─── REGISTER FORM ────────────────────────────────────────────────────────
  function RegisterForm({ onSwitch }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      agree: false,
    });
    const strength = getStrength(form.password);
    const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!form.agree) return alert("Setujui syarat dulu");
      try {
        const res = await axios.post("http://localhost:3000/api/register", {
          name: form.firstName + " " + form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone,
        });
        if (res.data.status) {
          alert("Register berhasil, silakan lengkapi profil");
          localStorage.setItem("user", JSON.stringify(res.data.data));
          navigate("/profil");
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.log(error);
        alert("Register gagal");
      }
    };

    return (
      <div className="flex flex-1 flex-col justify-center px-8 md:px-12 py-10 max-w-md w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Create a new account</h1>
          <p className="text-sm text-gray-500">
           Already have an account?{" "}
            <button onClick={onSwitch} className="text-blue-700 font-medium hover:underline">
              Sign in here
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" placeholder="Budi" value={form.firstName} onChange={set("firstName")} />
            <Field label="Last Name" placeholder="Santoso" value={form.lastName} onChange={set("lastName")} />
          </div>
          <Field label="Email Address" type="email" placeholder="nama@email.com" value={form.email} onChange={set("email")} />
          <Field label="Phone Number" type="tel" placeholder="+62 812 3456 7890" value={form.phone} onChange={set("phone")} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={set("password")}
              className="h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            />
            {form.password && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColors[strength - 1] : "bg-gray-100"}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400">{strengthLabels[strength - 1]}</p>
              </div>
            )}
          </div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.agree} onChange={set("agree")} className="mt-0.5 accent-blue-700" />
            <span className="text-sm text-gray-500 leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-blue-700 hover:underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-700 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          <button type="submit" className="h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all">
            Create Account
          </button>
        </form>
      </div>
    );
  }

  // ─── LUPA PASSWORD FORM ───────────────────────────────────────────────────
  function ForgotPasswordForm({ onBack }) {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:3000/api/forgot-password", { email });
        console.log(res.data); // ← tambah ini
        // Kirim request ke API lupa password
        await axios.post("http://localhost:3000/api/forgot-password", { email });
        setSent(true);
      } catch (error) {
        console.log(error);
        // Tetap tampilkan sukses agar tidak mengekspos email mana yang terdaftar
        setSent(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex flex-1 flex-col justify-center px-8 md:px-12 py-10 max-w-md w-full mx-auto">
        {/* Tombol kembali */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition mb-8 w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke login
        </button>

        {!sent ? (
          <>
            {/* Ikon amplop */}
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Forgot your password?</h1>
              <p className="text-sm text-gray-500 leading-relaxed">Enter your registered email address. We'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Alamat Email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" disabled={loading} className="h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          /* Tampilan setelah email terkirim */
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Sent!</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              We've sent a password reset link to <span className="font-medium text-gray-700">{email}</span>. Please check your inbox or spam folder..
            </p>
            <button onClick={onBack} className="h-11 w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm transition-all">
             Back to Login
            </button>
            <button
              onClick={() => {
                setEmail("");
                setSent(false);
              }}
              className="mt-3 text-xs text-gray-400 hover:text-blue-600 transition"
            >
              Resend email
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── MAIN ────────────────────────────────────────────────────────────────
  export default function AuthPage() {
    const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
    const isLogin = mode === "login";
    const isForgot = mode === "forgot";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4 overflow-hidden relative">
       <div className="
w-full
max-w-5xl
animate-[fadeIn_.5s_ease]
bg-white/80
backdrop-blur-xl
rounded-[32px]
overflow-hidden
shadow-2xl
border
border-white/40
flex
min-h-[720px]
relative
z-10
"
>
          {/* Side Panel */}
          {isForgot ? (
            <SidePanel bgColor="bg-blue-600" dotIndex={2} title="Reset passwordntol" description="Don't worry, we'll help you regain access to your account." />
          ) : isLogin ? (
            <SidePanel bgColor="bg-blue-700" dotIndex={0} title="Welcome Back!" description="Sign in to continue and access all available features." />
          ) : (
            <SidePanel bgColor="bg-blue-900" dotIndex={1} title="Join Us Today" description="Create a free account and enjoy unlimited access to all platform features." />
          )}

          {/* Form Area */}
          {isForgot ? <ForgotPasswordForm onBack={() => setMode("login")} /> : isLogin ? <LoginForm onSwitch={() => setMode("register")} onForgot={() => setMode("forgot")} /> : <RegisterForm onSwitch={() => setMode("login")} />}
        </div>
      </div>
    );
  }


