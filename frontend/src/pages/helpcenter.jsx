import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiBell,
  FiShoppingCart,
  FiShoppingBag,
  FiHelpCircle,
  FiBookOpen,
  FiTruck,
  FiShield,
  FiChevronRight,
  FiHome,
  FiPackage,
  FiCompass,
} from "react-icons/fi";

import logo from "../assets/logo.png";
import Floating from "./floating";

export default function HelpCenter() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const popupRef = useRef();

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  return (
    <div className="min-h-screen bg-[#f7faff]">

      {/* TOP NAVBAR */}
      <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">

        <div className="flex items-center gap-4 text-gray-100 text-sm">

          {[
            { name: "Shop", path: "/belanja" },
            { name: "Orders", path: "/trackingbuku" },
            { name: "Discover", path: "/helpcenter" },

          ].map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="px-3 py-1 rounded-md hover:text-blue-200 transition"
            >
              {item.name}
            </Link>
          ))}

        </div>

      </div>

      {/* NAVBAR */}
      <div className="bg-white shadow sticky top-0 z-50">

        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-2">

          {/* LOGO */}
          <div className="flex items-center gap-2 mr-5">

            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 mr-4"
            />

            <h1 className="text-xl font-bold text-blue-700">

            </h1>

          </div>

          {/* ICON */}
          <div
            ref={popupRef}
            className="flex items-center gap-3 ml-4 relative z-50"
          >

            {/* CART */}
            <Link to="/keranjang">
              <FiShoppingCart className="text-2xl text-gray-600 hover:text-blue-600 transition cursor-pointer" />
            </Link>

            {/* NOTIFICATION */}
            <div className="relative">

              <FiBell
                className="text-2xl text-gray-600 cursor-pointer hover:text-yellow-500 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                }}
              />

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border z-50">

                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t"></div>

                  <div className="py-3 text-center">

                    <h3 className="font-semibold text-gray-700 pb-2 border-b">
                      Your Notification
                    </h3>

                    <div className="py-6 text-sm text-gray-400 border-b">
                      No new notifications yet.
                    </div>

                    <button
                      onClick={() => navigate("/notip")}
                      className="pt-2 text-sm text-gray-600 hover:text-blue-600"
                    >
                      View All
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
                className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
              >
                {user.name ? user.name.charAt(0) : "U"}
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">

                  {/* HEADER */}
                  <div className="flex flex-col items-center py-6 bg-gray-50">

                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>

                    <h3 className="font-semibold text-gray-700 text-sm">
                      {user.name || "-"}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {user.email || "-"}
                    </p>

                  </div>

                  {/* BUTTON PROFILE */}
                  <div className="px-4 py-4">

                    <Link to="/profil">
                      <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
                        My Profile
                      </button>
                    </Link>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* HERO */}
      <section className="px-6 md:px-12 pt-10">

        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-700 to-blue-500 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">

          <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            <h1 className="text-4xl font-bold mb-3">
             Discover BukuIn
            </h1>

            <p className="text-blue-100 max-w-2xl">
              Explore a modern bookstore platform for buying,
  borrowing, and managing your favorite books
  more easily with BukuIn.
            </p>

          </div>

        </div>

      </section>

      {/* CTA CARDS */}
      <section className="px-6 md:px-12 mt-8">

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

          {/* CARD */}
<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
    <FiBookOpen className="text-2xl text-blue-600" />
  </div>

  <h2 className="text-2xl font-bold text-gray-800">
    Easy Borrowing
  </h2>

  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
    Borrow your favorite books online
    quickly and more conveniently.
  </p>

</div>

{/* CARD */}
<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

  <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-4">
    <FiTruck className="text-2xl text-yellow-500" />
  </div>

  <h2 className="text-2xl font-bold text-gray-800">
    Order Tracking
  </h2>

  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
    Monitor purchases and shipping
    progress directly from BukuIn.
  </p>

</div>

{/* CARD */}
<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
    <FiShield className="text-2xl text-green-600" />
  </div>

  <h2 className="text-2xl font-bold text-gray-800">
    Trusted Platform
  </h2>

  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
    Enjoy a simple, secure, and modern
    bookstore experience every day.
  </p>

</div>

</div>

</section>

      {/* SHOWCASE SECTION */}
<section className="px-6 md:px-12 py-10">

  <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">

    {/* HEADER */}
    <div className="px-8 py-6 border-b flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          BukuIn Experience
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          Modern digital bookstore platform
        </p>

      </div>

    </div>

    {/* CONTENT */}
    <div className="p-8">

      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[2rem] p-10 text-white relative overflow-hidden">

        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-3xl">

          <p className="uppercase tracking-[4px] text-blue-100 text-sm mb-4">
            Digital Reading Platform
          </p>

          <h1 className="text-4xl font-bold leading-tight mb-5">
            Discover a smarter and more modern way to enjoy books.
          </h1>

          <p className="text-blue-100 leading-relaxed text-lg">
            BukuIn combines a clean interface, modern bookstore
            experience, and seamless navigation designed for
            readers who love simplicity and elegance.
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

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
        <Link to="/belanja" className="hover:text-white">
          Shop
        </Link>

        <Link to="/trackingbuku" className="hover:text-white">
          Orders
        </Link>
         <Link to="/helpcenter" className="hover:text-white">
          Discover
        </Link>
      </div>
    </div>

    {/* CONTACT */}
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

  {/* BOTTOM */}
  <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
    © 2026 BukuIn. All rights reserved.
  </div>

</footer>

      {/* FLOATING */}
      <Floating />
      {/* MOBILE NAV */}
<div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-2xl shadow-xl z-50">

  <Link to="/belanja">
    <FiShoppingCart size={24} />
  </Link>

  <Link to="/trackingbuku">
    <FiPackage size={24} />
  </Link>

  <Link to="/helpcenter">
    <FiCompass size={24} />
  </Link>



</div>

    </div>
  );
}