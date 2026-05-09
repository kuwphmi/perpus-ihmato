import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiBell,
  FiHeart,
  FiSearch,
  FiShoppingCart,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import logo from "../assets/logo.png";
import Floating from "./floating";

export default function Trackingbuku() {
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

  const orders = [
    {
      id: "#BK1021",
      title: "Atomic Habits",
      status: "Unpaid",
      price: "$12.99",
      image:
        "https://covers.openlibrary.org/b/id/12687884-L.jpg",
    },

    {
      id: "#BK1022",
      title: "Rich Dad Poor Dad",
      status: "Shipping",
      price: "$15.50",
      image:
        "https://covers.openlibrary.org/b/id/240726-L.jpg",
    },

    {
      id: "#BK1023",
      title: "The Psychology of Money",
      status: "Completed",
      price: "$18.00",
      image:
        "https://covers.openlibrary.org/b/id/10521270-L.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7faff]">

      {/* TOP NAVBAR */}
      <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">

        <div className="flex items-center gap-4 text-gray-100 text-sm">

          {[
            { name: "Shop", path: "/belanja" },
            { name: "Orders", path: "/trakingbuku" },
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
          <div className="flex items-center gap-3 ml-4 relative z-50 relative">

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

      {/* BUTTON PROFIL */}
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
              Order Tracking
            </h1>

            <p className="text-blue-100 max-w-2xl">
              Track your latest purchases, monitor shipping
              progress, and manage your bookstore orders
              easily.
            </p>

          </div>

        </div>

      </section>

      {/* STATUS CARDS */}
      <section className="px-6 md:px-12 mt-8">

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

          {/* UNPAID */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-4">
              <FiClock className="text-2xl text-yellow-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              02
            </h2>

            <p className="text-gray-500 mt-1">
              Unpaid Orders
            </p>

          </div>

          {/* SHIPPING */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
              <FiTruck className="text-2xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              01
            </h2>

            <p className="text-gray-500 mt-1">
              Shipping Orders
            </p>

          </div>

          {/* COMPLETED */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
              <FiCheckCircle className="text-2xl text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              08
            </h2>

            <p className="text-gray-500 mt-1">
              Completed Orders
            </p>

          </div>

        </div>

      </section>

      {/* ORDER LIST */}
      <section className="px-6 md:px-12 py-10">

        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="px-8 py-6 border-b flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Recent Orders
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Manage all your orders in one place
              </p>
            </div>

            <FiPackage className="text-3xl text-blue-600" />

          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 border rounded-3xl hover:shadow-md transition"
              >

                {/* LEFT */}
                <div className="flex items-center gap-5">

                  <img
                    src={order.image}
                    alt={order.title}
                    className="w-24 h-32 rounded-2xl object-cover"
                  />

                  <div>

                    <h3 className="text-xl font-semibold text-gray-800">
                      {order.title}
                    </h3>

                    <p className="text-gray-400 mt-1">
                      Order ID: {order.id}
                    </p>

                    <p className="text-blue-600 font-bold mt-3">
                      {order.price}
                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-start md:items-end gap-3">

                  {order.status === "Unpaid" && (
                    <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium">
                      Unpaid
                    </span>
                  )}

                  {order.status === "Shipping" && (
                    <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                      Shipping
                    </span>
                  )}

                  {order.status === "Completed" && (
                    <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                      Completed
                    </span>
                  )}

                </div>

              </div>
            ))}

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

    </div>
  );
}