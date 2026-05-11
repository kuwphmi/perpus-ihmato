import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import {
  FiArrowLeft,
  FiMapPin,
  FiShoppingBag,
  FiCreditCard,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import Floating from "./floating";

export default function Checkout() {

  const location = useLocation();
  const navigate = useNavigate();

  const items = location.state?.items || [];

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notif, setNotif] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const showNotif = (message) => {

    setNotif(message);

    setTimeout(() => {
      setNotif("");
    }, 2000);

  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const shipping = 5000;
  const serviceFee = 2000;

  const total = subtotal + shipping + serviceFee;

  const handlePayment = async () => {

    if (!name || !phone || !address) {

      showNotif("Please complete the form first");
      return;

    }

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      // SAVE ADDRESS
      await axios.post(
        "http://localhost:3000/api/address",
        {
          user_id: user.id,
          receiver_name: name,
          phone,
          province: "-",
          city: "-",
          district: "-",
          postal_code: "-",
          full_address: address,
        }
      );

      // CREATE PAYMENT
      const res = await axios.post(
        "http://localhost:3000/api/payment/create",
        {
          user_id: user.id,
          items,
          customer_name: name,
          phone,
          address,
        }
      );

      const token = res.data.token;

      window.snap.pay(token, {

        onSuccess: function () {

          showNotif("Payment successful");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);

        },

        onPending: function () {

          showNotif("Waiting for payment");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);

        },

        onClose: function () {

          showNotif("Payment cancelled");

        },

      });

    } catch (err) {

      console.log(err);

      showNotif("Checkout failed");

    }

  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* NOTIF */}
      {notif && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]">

          <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium">
            {notif}
          </div>

        </div>
      )}

      {/* HEADER */}
<div className="bg-white p-4 shadow-sm flex justify-between items-center relative">

  {/* LEFT */}
 <h1 className="text-lg font-bold text-blue-700 flex items-center gap-2">

  <FiCreditCard className="text-xl" />

  Checkout

</h1>

  {/* RIGHT */}
  <div className="flex items-center gap-3">

    {/* PROFILE */}
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsProfileOpen(!isProfileOpen);
      }}
      className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
    >
      {user.name ? user.name.charAt(0) : "U"}
    </div>

  </div>

  {/* POPUP */}
  {isProfileOpen && (
    <div className="absolute right-4 top-16 z-50">

      <div className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

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
              My Profile
            </button>
          </Link>

        </div>

      </div>

    </div>
  )}

</div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* SHIPPING */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          <div className="px-6 py-5 border-b flex items-center gap-3">

            <FiMapPin className="text-blue-600 text-xl" />

            <h2 className="text-xl font-semibold text-blue-700">
              Shipping Information
            </h2>

          </div>

          <div className="p-6">

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Recipient Name
                </label>

                <input
                  type="text"
                  placeholder="Input recipient name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                />

              </div>

            </div>

            <div className="mt-5">

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Address
              </label>

              <textarea
                placeholder="Input your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 h-32 resize-none outline-none focus:ring-2 focus:ring-blue-200"
              />

            </div>

          </div>

        </div>

        {/* PRODUCT */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          <div className="px-6 py-5 border-b flex items-center gap-3">

            <FiShoppingBag className="text-blue-600 text-xl" />

            <h2 className="text-lg font-semibold text-blue-700">
              Ordered Product
            </h2>

          </div>

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3 text-sm text-gray-400 border-b bg-gray-50">

            <div className="col-span-6">
              Product
            </div>

            <div className="col-span-2 text-center">
              Price
            </div>

            <div className="col-span-2 text-center">
              Qty
            </div>

            <div className="col-span-2 text-right">
              Subtotal
            </div>

          </div>

          {/* ITEMS */}
          <div className="divide-y">

            {items.map((item, index) => (

              <div
                key={index}
                className="grid md:grid-cols-12 gap-4 px-6 py-5 items-center bg-white"
              >

                {/* PRODUCT */}
                <div className="md:col-span-6 flex gap-4">

                  <div className="w-24 h-24 bg-blue-50 rounded-xl overflow-hidden border flex items-center justify-center">

                    {item.cover ? (

                      <img
                        src={`https://covers.openlibrary.org/b/id/${item.cover}-M.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="text-gray-400 text-sm">
                        No Cover
                      </div>

                    )}

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-800 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Premium Book Collection
                    </p>

                  </div>

                </div>

                {/* PRICE */}
                <div className="md:col-span-2 text-center font-medium text-gray-700">
                  Rp {item.price?.toLocaleString("id-ID")}
                </div>

                {/* QTY */}
                <div className="md:col-span-2 text-center text-gray-700">
                  {item.qty || 1}
                </div>

                {/* SUBTOTAL */}
                <div className="md:col-span-2 text-right font-bold text-blue-700">
                  Rp {(item.price * (item.qty || 1)).toLocaleString("id-ID")}
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-5 border-b flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FiCreditCard className="text-blue-600 text-xl" />

              <h2 className="text-xl font-semibold text-blue-700">
                Payment Method
              </h2>

            </div>

            <div className="text-sm text-gray-600">
              Midtrans Payment Gateway
            </div>

          </div>

          {/* SUMMARY */}
          <div className="p-6">

            <div className="w-full space-y-4">

              <div className="flex justify-between text-gray-600">

                <span>Subtotal Product</span>

                <span>
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>

              </div>

              <div className="flex justify-between text-gray-600">

                <span>Shipping Fee</span>

                <span>
                  Rp {shipping.toLocaleString("id-ID")}
                </span>

              </div>

              <div className="flex justify-between text-gray-600">

                <span>Service Fee</span>

                <span>
                  Rp {serviceFee.toLocaleString("id-ID")}
                </span>

              </div>

              <div className="border-t pt-5 flex justify-between items-center">

                <span className="text-lg font-semibold text-gray-800">
                  Total Payment
                </span>

                <span className="text-4xl font-bold text-blue-600">
                  Rp {total.toLocaleString("id-ID")}
                </span>

              </div>

              {/* BUTTON */}
              <button
                onClick={handlePayment}
                className="w-full mt-6 bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 transition text-white py-4 rounded-lg text-lg font-semibold"
              >
                Proceed Payment
              </button>

            </div>

          </div>

        </div>

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
            {/* MASCOT (INI YANG KAMU TAMBAH) */}
            <Floating />

    </div>
    
  );
}