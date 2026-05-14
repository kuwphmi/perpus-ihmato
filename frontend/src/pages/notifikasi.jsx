import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiBell,
  FiHeart,
  FiSearch,
} from "react-icons/fi";

import Floating from "./floating";

export default function Notifikasi() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsProfileOpen(false);
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Borrow Approved",
      desc: "Atomic Habits is ready to read now.",
      time: "2 min ago",
    },

    {
      id: 2,
      title: "New Arrival",
      desc: "The Psychology of Money has been added.",
      time: "1 hour ago",
    },

    {
      id: 3,
      title: "Return Reminder",
      desc: "Rich Dad Poor Dad must be returned tomorrow.",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7faff]">

      {/* 🔹 HEADER */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">

        <div className="px-5 py-3 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-2">

            <FiHeart className="text-blue-600 fill-blue-600 text-lg" />

            <h1 className="text-lg font-semibold text-blue-600">
              Notifications
            </h1>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 relative">
           {/* ❤️ FAVORITE */}
<Link to="/favorite">
  <FiHeart className="text-2xl text-gray-600 hover:text-yellow-400 cursor-pointer transition" />
</Link>

            {/* 👤 PROFILE */}
            <div className="relative">

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {isProfileOpen && (
                <div
                  ref={popupRef}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden"
                >

                  {/* HEADER */}
                  <div className="flex flex-col items-center py-6 bg-gray-50">

                    <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2">
                      {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>

                    <h3 className="font-semibold text-gray-700 text-sm">
                      {user?.name || "-"}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {user?.email || "-"}
                    </p>

                  </div>

                  {/* BUTTON */}
                  <div className="px-4 py-4">

                    <Link to="/profil">
                      <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
                        My profile
                      </button>
                    </Link>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* 🔹 SEARCH */}
      <div className="px-5 py-3">

        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition">

          <FiSearch className="text-gray-400 w-4 h-4 mr-2" />

          <input
            type="text"
            placeholder="Search notifications..."
            className="outline-none text-sm w-full bg-transparent"
          />

        </div>

      </div>

      {/* 🔹 LIST */}
      <div className="px-5 pb-10 space-y-4">

        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition"
          >

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">
                <FiBell />
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h2 className="font-semibold text-gray-800">
                    {notif.title}
                  </h2>

                  <span className="text-xs text-gray-400">
                    {notif.time}
                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {notif.desc}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <footer className="mt-20 bg-gray-900 text-white">

        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">
              BukuIn
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Discover thousands of books, explore new worlds,
              and enjoy a modern digital library experience.
            </p>
          </div>

          {/* MENU */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Navigation
            </h3>

            <div className="flex flex-col gap-2 text-gray-400 text-sm">

              <Link to="/koleksi" className="hover:text-white">
                Home
              </Link>

              <Link to="/belanja" className="hover:text-white">
                Shop
              </Link>

              <Link to="/riwayat" className="hover:text-white">
                History
              </Link>

            </div>
          </div>

          {/* ABOUT */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              About
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              Built for book lovers who want a simple,
              elegant, and interactive reading platform.
            </p>
          </div>

        </div>

        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
          © 2026 BukuIn. All rights reserved.
        </div>

      </footer>

      {/* MASCOT */}
      <Floating />

    </div>
  );
}