import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiBell,
  FiHeart,
  FiSearch,
  FiArrowLeft,
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

  const [notifications,
    setNotifications] =
    useState([]);

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications =
    async () => {
      try {

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const res =
          await axios.get(
            `http://localhost:3000/api/notifications/${user.id}`
          );

        setNotifications(
          res.data || []
        );

      } catch (err) {

        console.log(err);

      }
    };


  return (
    <div className="min-h-screen bg-[#f7faff]">

      {/* 🔹 HEADER */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">

        <div className="px-5 py-3 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="
      w-10
      h-10
      rounded-full
      bg-blue-50
      hover:bg-blue-100
      flex
      items-center
      justify-center
      transition
    "
            >
              <FiArrowLeft className="text-blue-600 text-lg" />
            </button>

            <div>

              <h1 className="text-[20px] font-semibold text-blue-600">
                Notifications
              </h1>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 relative">
            {/* ❤️ FAVORITE */}
            <Link to="/favorite">
              <FiHeart className="text-2xl text-gray-600 hover:text-yellow-400 cursor-pointer transition" />
            </Link>

            {/* ================= PROFILE ================= */}
<div className="relative">

  {/* PROFILE BUTTON */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      setIsProfileOpen(!isProfileOpen);
    }}
    className="
      relative
      z-50
      w-9 h-9
      rounded-full
      bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500
      flex items-center justify-center
      text-white
      font-semibold
      shadow-lg
      hover:scale-105
      transition-all duration-300
      border-2 border-white
    "
  >
    {user.name ? user.name.charAt(0).toUpperCase() : "U"}

    
  </button>

  {/* DROPDOWN */}
  {isProfileOpen && (
    <>
      {/* CLICK OUTSIDE */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsProfileOpen(false)}
      ></div>

      {/* POPUP */}
      <div
        className="
          absolute right-0 mt-4 w-72
          rounded-[28px]
          overflow-hidden
          bg-white/80
          backdrop-blur-2xl
          border border-white/40
          shadow-[0_12px_40px_rgba(0,0,0,0.16)]
          animate-[fadeIn_.25s_ease]
          z-50
        "
      >

        {/* HEADER */}
        <div className="
          h-28
          bg-gradient-to-r
          from-blue-600
          via-blue-500
          to-cyan-400
          relative
        ">

          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>

          {/* AVATAR */}
          <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">

            <div className="
              w-20 h-20
              rounded-full
              bg-white
              p-[3px]
              shadow-2xl
            ">

              <div className="
                w-full h-full
                rounded-full
                bg-gradient-to-br from-blue-500 to-blue-700
                flex items-center justify-center
                text-white
                text-3xl
                font-bold
              ">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="pt-14 pb-6 px-6 text-center">

          <h3 className="text-[18px] font-bold text-gray-800 tracking-tight">
            {user.name || "Unknown User"}
          </h3>

          <p className="text-sm text-gray-500 mt-1 break-all">
            {user.email || "No email available"}
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5"></div>

          <Link to="/profil">
            <button
              className="
                w-full
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-blue-700
                hover:from-blue-700
                hover:to-blue-800
                text-white
                font-semibold
                shadow-lg
                hover:shadow-blue-300/40
                transition-all duration-300
              "
            >
              View Profile
            </button>
          </Link>

        </div>

      </div>
    </>
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
                    {
                      new Date(
                        notif.created_at
                      ).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",

                        }
                      )
                    }
                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {notif.message}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>


      {/* MASCOT */}
      <Floating />

    </div>
  );
}