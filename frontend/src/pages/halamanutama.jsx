import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiBell, FiHeart, FiHome, FiBook, FiUser, FiShoppingCart, FiClock } from "react-icons/fi";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import logo from "../assets/logo.png";
import Floating from "./floating";

export default function HalamanUtama() {
  const [user, setUser] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bestBooks, setBestBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const slides = [
    {
      img: banner1,
      title: "Sistem Perpustakaan Modern",
      subtitle: "Kelola buku lebih mudah, cepat, dan efisien",
    },
    {
      img: banner2,
      title: "Akses Cepat & Praktis",
      subtitle: "Semua data koleksi dalam satu genggaman",
    },
    {
      img: banner3,
      title: "Digital Library",
      subtitle: "Solusi perpustakaan masa depan",
    },
  ];

  useEffect(() => {

  // ================= BUKU TERPOPULER =================
  fetch("https://openlibrary.org/search.json?q=programming&limit=10")
    .then((res) => res.json())
    .then((data) => {
      const books = data.docs
      .filter((item) => item.cover_i) // ✅ hanya yang ada cover
      .map((item) => ({
        title: item.title ?? "-",
        author: item.author_name?.[0] ?? "-",
        cover: item.cover_i,
        year: item.first_publish_year ?? 0,
      }));

      setBestBooks(books);
    });

  // ================= BUKU TERBARU (beda query) =================
  fetch("https://openlibrary.org/search.json?q=technology&sort=new&limit=10")
    .then((res) => res.json())
    .then((data) => {
      const books = data.docs
      .filter((item) => item.cover_i) // ✅ hanya yang punya cover
      .map((item) => ({
        title: item.title ?? "-",
        author: item.author_name?.[0] ?? "-",
        cover: item.cover_i,
        year: item.first_publish_year ?? 0,
      }));

      // ambil yang paling baru (sort manual biar aman)
      const sorted = books.sort(
        (a, b) => (b.year || 0) - (a.year || 0)
      );

      setNewBooks(sorted);
    })
    .finally(() => setLoading(false));

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    setUser(storedUser);
  }

  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 4000);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">
        <div className="flex gap-6">
          {[
            { name: "Beranda", path: "/halamanutama" },
            { name: "Koleksi", path: "/koleksi" },
            { name: "Belanja", path: "/belanja" },
            { name: "Riwayat", path: "/riwayat" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="px-3 py-1 rounded-md transition-all duration-200 
              hover:text-blue-200 hover:bg-white/10"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center px-6 py-2">
          {/* LOGO */}
          <div className="shrink-0 mr-4">
            <img src={logo} alt="logo" className="w-12 h-12" />
          </div>

          {/* SEARCH */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-lg">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari buku favoritmu..." className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          {/* ICON */}
          <div className="flex items-center gap-3 shrink-0 ml-4 relative z-50">
            <FiHeart className="text-2xl text-gray-600 cursor-pointer hover:text-red-500 transition" />

            {/* 🔔 NOTIFIKASI */}
            <div className="relative">
              <FiBell
                className="text-2xl text-gray-600 cursor-pointer hover:text-yellow-500 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                }}
              />

              {/* DROPDOWN */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border z-50">
                  {/* ARROW */}
                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t"></div>

                  <div className="py-3 text-center">
                    <h3 className="font-semibold text-gray-700 pb-2 border-b">Pemberitahuanmu</h3>

                    <div className="py-6 text-sm text-gray-400 border-b">Belum ada notifikasi baru</div>

                    <button className="pt-2 text-sm text-gray-600 hover:text-blue-600">Lihat Semua</button>
                  </div>
                </div>
              )}
            </div>

            {/*  PROFIL */}
            <div className="relative">

  {/* ICON PROFILE */}
  <div
    onClick={(e) => {
      e.stopPropagation();
      setIsProfileOpen(!isProfileOpen);
    }}
    className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
  >
   {user.name ? user.name.charAt(0) : "U"}
  </div>

  {/* DROPDOWN PROFILE */}
  {isProfileOpen && (
    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col items-center py-6 bg-gray-50">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 mb-2">
          {user.name ? user.name.charAt(0) : "U"}
        </div>
        <h3 className="font-semibold text-gray-700 text-sm">
          {user.name || "-"}
        </h3>
        <p className="text-xs text-gray-500">
          {user.email || "-"}
        </p>
      </div>

      {/* BUTTON PROFIL */}
      <div className="px-4 py-4">
        <Link to="/profil">
  <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
    Profilku
  </button>
</Link>
      </div>

    </div>
  )}
</div>
</div>
</div>
</div>
        

      {/* ✅ OVERLAY FIX (tidak ganggu klik) */}
      {isNotifOpen && <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />}

      {/* BANNER FULLSCREEN */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="flex h-full transition-transform duration-700" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="min-w-full h-full relative">
              <img src={slide.img} className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl md:text-6xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-white/80 text-sm md:text-lg max-w-xl">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE NAVBAR (TETAP) */}
        {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-xl shadow-lg z-50">
        <Link to="/koleksi"><FiBook size={24} /></Link>
        <Link to="/belanja"><FiShoppingCart size={24} /></Link>
        <Link to="/riwayat"><FiClock size={24} /></Link>
      </div>

        {/* DOT */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-blue-500" : "w-2 bg-white/50"}`} />
          ))}
        </div>
      </div>

      {/* SECTION POPULER */}
      <section className="bg-white py-14 px-6 md:px-20 overflow-hidden">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">Buku Terpopuler</h2>

        {loading ? (
          <p className="text-center text-gray-400">Memuat buku...</p>
        ) : (
          <div className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
            {bestBooks.map((book, i) => (
              <div key={i} className="min-w-62.5 snap-start bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="h-48 bg-blue-100 overflow-hidden">
                  {book.cover ? (
                    <img src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`} className="w-full h-full object-cover" alt={book.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Cover</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold">{book.title}</h3>
                  <p className="text-blue-600 font-bold text-sm">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-6 md:px-20 pb-14">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-xl shadow-2xl">
          <img src={banner1} className="w-full h-80 md:h-112 object-cover" />
        </div>
      </section>

      {/* SECTION BUKU TERBARU */}
      <section className="bg-white py-14 px-6 md:px-20 overflow-hidden">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">Buku Terbaru</h2>
        <div className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
          {newBooks.map((book, i) => (
            <div key={i} className="min-w-62.5 snap-start bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-blue-100 overflow-hidden">
                {book.cover ? (
                  <img src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`} className="w-full h-full object-cover" alt={book.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Cover</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold">{book.title}</h3>
                <p className="text-blue-600 font-bold text-sm">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <div className="mt-16 bg-gray-900 text-white text-center py-6">
        <p className="text-sm">© 2026 BukuIn. All rights reserved.</p>
      </div>

       {/* MASCOT (INI YANG KAMU TAMBAH) */}
    <Floating />

    </div>
  );
}
