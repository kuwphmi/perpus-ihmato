import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  FiMapPin,
  FiShoppingBag,
  FiCreditCard,
} from "react-icons/fi";

import Floating from "./floating";

export default function Checkout() {

  const location = useLocation();
  const navigate = useNavigate();

  const items = location.state?.items || [];

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [notif, setNotif] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const showNotif = (message) => {

    setNotif(message);

    setTimeout(() => {

      setNotif("");

    }, 2500);

  };

  const subtotal = items.reduce(

    (acc, item) => acc + item.price * (item.qty || 1),
    0

  );

  const shipping = 5000;

  const serviceFee = 2000;

  const total = subtotal + shipping + serviceFee;

  useEffect(() => {

    fetchAddress();

  }, []);

  const fetchAddress = async () => {

    try {

      const userData = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await axios.get(
        `http://localhost:3000/api/address/${userData.id}`
      );

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      const primary = data.find(
        (item) => item.is_primary === true
      );

      setSelectedAddress(primary || null);

    } catch (err) {

      console.log(err);

    }

  };

  const handlePayment = async () => {

    if (!selectedAddress) {

      showNotif("Please add address first");

      return;

    }

    try {

      setIsLoading(true);

      const userData = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await axios.post(
        "http://localhost:3000/api/payment/create",
        {
          user_id: userData.id,
          items,
          address_id: selectedAddress.id,
        }
      );

      console.log("PAYMENT RESPONSE:", res.data);

      const token = res.data.token;

      if (!token) {

        showNotif("Midtrans token failed");

        setIsLoading(false);

        return;

      }

      if (!window.snap) {

        showNotif("Midtrans not loaded");

        setIsLoading(false);

        return;

      }

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

        onError: function (result) {

          console.log(result);

          showNotif("Payment failed");

        },

        onClose: function () {

          showNotif("Payment cancelled");

        },

      });

    } catch (err) {

      console.log(err);

      showNotif("Checkout failed");

    } finally {

      setIsLoading(false);

    }

  };

  if (!items || items.length === 0) {

    return (

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white p-10 rounded-2xl shadow text-center">

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Checkout Item
          </h2>

          <p className="text-gray-500 mb-6">
            Please add product first
          </p>

          <button
            onClick={() => navigate("/belanja")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Go Shopping
          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* NOTIF */}
      {notif && (

        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]">

          <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-medium">
            {notif}
          </div>

        </div>

      )}

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">

          <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">

            <FiCreditCard />

            Checkout

          </h1>

          <Link
            to="/belanja"
            className="text-sm text-blue-600 font-medium"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* ADDRESS */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div className="px-6 py-5 border-b flex items-center gap-3">

            <FiMapPin className="text-blue-600 text-xl" />

            <h2 className="text-xl font-semibold text-blue-700">
              Shipping Information
            </h2>

          </div>

          <div className="p-6">

            {selectedAddress ? (

              <div className="border rounded-2xl p-5 bg-blue-50">

                <div className="flex justify-between items-start gap-5">

                  <div>

                    <p className="text-blue-600 text-sm font-semibold">
                      Main Address
                    </p>

                    <h3 className="font-bold text-lg mt-2">
                      {selectedAddress.receiver_name}
                    </h3>

                    <p className="text-gray-600 text-sm">
                      {selectedAddress.phone}
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                      {selectedAddress.full_address}
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                      {selectedAddress.district}, Surabaya
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      navigate("/address?from=checkout")
                    }
                    className="text-blue-600 text-sm font-semibold"
                  >
                    Change
                  </button>

                </div>

              </div>

            ) : (

              <div className="text-center py-10">

                <p className="text-gray-500 mb-5">
                  No address yet
                </p>

                <button
                  onClick={() => navigate("/address")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                >
                  Add Address
                </button>

              </div>

            )}

          </div>

        </div>

        {/* PRODUCTS */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div className="px-6 py-5 border-b flex items-center gap-3">

            <FiShoppingBag className="text-blue-600 text-xl" />

            <h2 className="text-xl font-semibold text-blue-700">
              Ordered Product
            </h2>

          </div>

          <div className="divide-y">

            {items.map((item, index) => (

              <div
                key={index}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
              >

                <div className="flex gap-4">

                  <div className="w-24 h-24 bg-blue-50 rounded-xl overflow-hidden border">

                    {item.cover ? (

                      <img
                        src={`https://covers.openlibrary.org/b/id/${item.cover}-M.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No Cover
                      </div>

                    )}

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Qty: {item.qty || 1}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-sm text-gray-500">
                    Price
                  </p>

                  <p className="font-bold text-blue-700 text-lg">
                    Rp {(item.price * (item.qty || 1)).toLocaleString("id-ID")}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div className="px-6 py-5 border-b flex items-center gap-3">

            <FiCreditCard className="text-blue-600 text-xl" />

            <h2 className="text-xl font-semibold text-blue-700">
              Payment Summary
            </h2>

          </div>

          <div className="p-6 space-y-4">

            <div className="flex justify-between text-gray-600">

              <span>Subtotal</span>

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

              <span className="text-lg font-bold text-gray-800">
                Total
              </span>

              <span className="text-3xl font-bold text-blue-700">
                Rp {total.toLocaleString("id-ID")}
              </span>

            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full mt-5 bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 transition text-white py-4 rounded-xl font-semibold disabled:opacity-50"
            >
              {isLoading
                ? "Processing..."
                : "Proceed Payment"}
            </button>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-20 bg-gray-900 text-white">

        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

          <div>

            <h2 className="text-2xl font-bold text-blue-400 mb-3">
              BukuIn
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Discover thousands of books, explore new worlds,
              and enjoy a modern digital library experience.
            </p>

          </div>

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

      <Floating />

    </div>

  );

}