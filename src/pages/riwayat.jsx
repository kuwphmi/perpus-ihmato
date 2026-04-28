import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiHeart,
  FiHome,
  FiBook,
  FiShoppingCart,
  FiClock,
} from "react-icons/fi";

import logo from "../assets/logo.png";

export default function Riwayat() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const historyBooks = [
    { id: 1, title: "Algoritma Dasar", date: "20 April 2026" },
    { id: 2, title: "React untuk Pemula", date: "18 April 2026" },
    { id: 3, title: "UI UX Design", date: "15 April 2026" },
    { id: 4, title: "Database MySQL", date: "10 April 2026" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER BIRU */}
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
        <div className="max-w-6xl mx-auto flex items-center px-6 py-3">

          {/* LOGO */}
          <img src={logo} alt="logo" className="w-8 h-8 mr-4" />

          {/* SEARCH */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-lg">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari buku..."
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-blue-500"
              />
            </div>
          </div>

          {/* ICON */}
          <div className="flex items-center gap-3 ml-4 relative z-50">

            <FiHeart className="text-xl text-gray-600 hover:text-red-500 cursor-pointer" />

            {/* 🔔 NOTIF */}
            <div className="relative">
              <FiBell
                className="text-xl text-gray-600 hover:text-yellow-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
              />

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border z-50">

                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t"></div>

                  <div className="py-3 text-center">
                    <h3 className="font-semibold text-gray-700 pb-2 border-b">
                      Pemberitahuanmu
                    </h3>

                    <div className="py-6 text-sm text-gray-400 border-b">
                      Belum ada notifikasi baru
                    </div>

                    <button className="pt-2 text-sm text-gray-600 hover:text-blue-600">
                      Lihat Semua
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 👤 PROFILE */}
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
              >
                R
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">

                  {/* HEADER */}
                  <div className="flex flex-col items-center py-6 bg-gray-50">
                    <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 mb-2">
                      R
                    </div>
                    <h3 className="font-semibold text-gray-700 text-sm">
                      REVANDA AVRILLITA RIZKY
                    </h3>
                    <p className="text-xs text-gray-500">
                      rizkyavrillita@gmail.com
                    </p>
                  </div>

                  {/* BUTTON */}
                  <div className="px-4 py-4">
                    <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
                      Profilku
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* OVERLAY */}
      {(isNotifOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsNotifOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Riwayat Membaca
        </h1>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">

          {historyBooks.map((book) => (
            <div
              key={book.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.date}</p>
              </div>

              <button className="text-blue-600 text-sm hover:underline">
                Lihat Lagi
              </button>
            </div>
          ))}

        </div>

      </div>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-blue-600 text-white flex justify-around py-3">
        <Link to="/halamanutama"><FiHome className="text-2xl" /></Link>
        <Link to="/koleksi"><FiBook className="text-2xl" /></Link>
        <Link to="/belanja"><FiShoppingCart className="text-2xl" /></Link>
        <Link to="/riwayat"><FiClock className="text-2xl" /></Link>
      </div>

      {/* FOOTER */}
      <div className="mt-16 bg-gray-900 text-white text-center py-6">
        <p className="text-sm">© 2026 BukuIn. All rights reserved.</p>
      </div>

    </div>
  );
}