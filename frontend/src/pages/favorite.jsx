import { useEffect, useState, useRef } from "react";
import { Heart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ ditambahin

export default function Favorit() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const popupRef = useRef();
  const navigate = useNavigate(); // ✅ ditambahin

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(data);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const filtered = favorites.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7faff]">

      {/* 🔹 HEADER */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-blue-600 fill-blue-600" />
          <h1 className="text-lg font-semibold text-blue-600 tracking-tight">
            Favorit
          </h1>
        </div>

        <div
          onClick={() => setIsProfileOpen(true)}
          className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer hover:scale-105 transition"
        >
          {user.name ? user.name.charAt(0) : "U"}
        </div>
      </div>

      {/* 🔹 SEARCH */}
      <div className="px-5 py-3">
        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Cari favorit..."
            className="outline-none text-sm w-full bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🔹 LIST */}
     <div className="px-5 pb-6 space-y-3 max-h-[70vh] overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-14 h-20 object-cover rounded-lg group-hover:scale-[1.03] transition duration-300"
              />

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {book.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {book.author || "Unknown"}
                </p>
              </div>

              <button
                onClick={() => removeFavorite(book.id)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 transition-all duration-300 active:scale-90"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          ))
        ) : (
          <>
            {/* ❌ PUNYA KAMU (TIDAK DIHAPUS) */}
            <div className="text-center mt-24">
              <p className="text-gray-400 text-sm">
                Belum ada favorit 💙
              </p>
            </div>

            {/* ✅ TAMBAHAN (BIAR LEBIH HIDUP) */}
            <div className="flex flex-col items-center justify-center mt-6 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Heart className="w-6 h-6 text-blue-500" />
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Simpan buku yang kamu suka biar gampang ditemukan lagi
              </p>

              <button
                onClick={() => navigate("/koleksi")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Jelajahi Buku
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🔥 POPUP PROFILE */}
      {isProfileOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 translate-x-[-15%] top-14"
        >
          <div className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleIn">
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3">
                {user.name ? user.name.charAt(0) : "U"}
              </div>

              <h2 className="font-semibold text-gray-800">
                {user.name || "-"}
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                {user.email || "-"}
              </p>

              <Link to="/profil">
                <button className="w-56 bg-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                  Profilku
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* FOOTER */}
      <div className="mt-16 bg-gray-900 text-white text-center py-6">
        <p className="text-sm">© 2026 BukuIn. All rights reserved.</p>
      </div>
    </div>
  );
}