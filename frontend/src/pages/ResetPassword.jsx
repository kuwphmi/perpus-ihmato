import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import logo from "../assets/logo.png";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Baca token dari URL hash (#access_token=...&type=recovery)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (type === "recovery" && accessToken) {
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        })
        .then(({ error }) => {
          if (error) {
            setError("Link tidak valid atau sudah kadaluarsa. Minta link baru.");
          } else {
            setReady(true);
          }
        });
    } else {
      setError("Link tidak valid atau sudah kadaluarsa. Minta link baru.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    if (password !== confirm) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setDone(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-blue-700 text-base">BukuIn</span>
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Password berhasil diubah!</h2>
            <p className="text-sm text-gray-500 mb-7">Silakan login menggunakan password baru kamu.</p>
            <button onClick={() => navigate("/login")} className="h-11 w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm transition-all">
              Ke Halaman Login
            </button>
          </div>
        ) : !ready ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            {error ? (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Link Tidak Valid</h2>
                <p className="text-sm text-gray-500 mb-7">{error}</p>
                <button onClick={() => navigate("/login")} className="h-11 w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm transition-all">
                  Minta Link Baru
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500">Memverifikasi link...</p>
            )}
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Buat password baru</h1>
            <p className="text-sm text-gray-500 mb-7 leading-relaxed">Password baru harus berbeda dari password sebelumnya.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Password Baru</label>
                <input
                  type="password"
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Konfirmasi Password</label>
                <input
                  type="password"
                  placeholder="Ulangi password baru"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                {loading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
