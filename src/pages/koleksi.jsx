import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiHeart,
  FiHome,
  FiBook,
  FiUser,
  FiShoppingCart,
  FiClock,
  FiFeather,
  FiBriefcase,
  FiTrendingUp,
  FiGlobe,
  FiTool,
  FiSmile,
  FiFileText,
} from "react-icons/fi";

import logo from "../assets/logo.png";

export default function HalamanUtama() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const categories = [
    { name: "Art", icon: <FiFeather /> },
    { name: "Science Fiction", icon: <FiUser /> },
    { name: "Fantasy", icon: <FiBriefcase /> },
    { name: "Biographies", icon: <FiBook /> },
    { name: "Recipe", icon: <FiHeart /> },
    { name: "Romance", icon: <FiTrendingUp /> },
    { name: "Textbox", icon: <FiGlobe /> },
    { name: "Children", icon: <FiTool /> },
    { name: "Medicine", icon: <FiSmile /> },
    { name: "Religion", icon: <FiFileText /> },
  ];

  return (
    <div className="bg-white min-h-screen">

      {/* NAVBAR ATAS (TETAP) */}
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
              className="px-3 py-1 hover:text-blue-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center px-6 py-3">

          <img src={logo} className="w-8 h-8 mr-4" />

          {/* SEARCH */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-lg">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari buku favoritmu..."
                className="w-full pl-10 pr-4 py-2 border rounded-full"
              />
            </div>
          </div>

          {/* ICON */}
          <div className="flex items-center gap-3 ml-4 relative z-50">

            <FiHeart className="text-xl text-gray-600 cursor-pointer" />

            {/* NOTIF */}
            <div className="relative">
              <FiBell
                className="text-xl cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                }}
              />

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border z-50">
                  <div className="py-3 text-center">
                    <h3 className="font-semibold border-b pb-2">
                      Pemberitahuanmu
                    </h3>
                    <div className="py-6 text-gray-400">
                      Belum ada notifikasi
                    </div>
                    <button className="pt-2 text-sm text-gray-600 hover:text-blue-600">
                      Lihat Semua
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full cursor-pointer"
              >
                R
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow rounded-xl p-4">
                  <p className="font-semibold">REVANDA</p>
                  <Link to="/profil">
                    <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded">
                      Profilku
                    </button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {isNotifOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsNotifOpen(false)}
        />
      )}

      {/* ================= KATEGORI ================= */}
      <section className="bg-blue-50 py-12 px-6 md:px-20">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-8">
          Kategori Buku
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition text-center cursor-pointer"
            >
              <div className="text-3xl text-blue-600 mb-2 flex justify-center">
                {item.icon}
              </div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIST BUKU ================= */}
      <section className="px-6 md:px-20 py-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Rekomendasi Bacaan
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="h-40 bg-blue-100 flex items-center justify-center">
                Cover {i + 1}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold">
                  Judul Buku {i + 1}
                </h3>
                <p className="text-gray-500 text-xs">Penulis</p>

                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm">
                  Baca
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE NAVBAR (TETAP) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-blue-600 text-white flex justify-around py-3">
        <Link to="/halamanutama"><FiHome className="text-2xl" /></Link>
        <Link to="/koleksi"><FiBook className="text-2xl" /></Link>
        <Link to="/belanja"><FiShoppingCart className="text-2xl" /></Link>
        <Link to="/riwayat"><FiClock className="text-2xl" /></Link>
      </div>

      {/* FOOTER */}
      <div className="mt-16 bg-gray-900 text-white text-center py-6">
        © 2026 BukuIn
      </div>

    </div>
  );
}