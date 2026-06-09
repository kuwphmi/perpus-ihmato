import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { FiMapPin, FiShoppingBag, FiCreditCard, FiArrowLeft } from "react-icons/fi";

import Floating from "./floating";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items || [];
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [notif, setNotif] = useState("");
  const [notifType, setNotifType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState("delivery");
  const showNotif = (message, type = "info") => {
    setNotif(message);
    setNotifType(type);
    setTimeout(() => {
      setNotif("");
    }, 2500);
  };

  const getNotifColor = () => {
    switch (notifType) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  // Fungsi untuk menghapus cart items yang sudah dibayar
  const removeCartItems = async (cartItemIds) => {
    try {
      // Hapus setiap item dari cart
      await Promise.all(cartItemIds.map((id) => axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart/${id}`)));
      console.log("Cart items removed successfully");
    } catch (err) {
      console.log("Error removing cart items:", err);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

  const shipping = deliveryType === "pickup" ? 0 : 5000;
  const serviceFee = 2000;

  const total = subtotal + shipping + serviceFee;

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/address/${userData.id}`);

      const data = Array.isArray(res.data) ? res.data : [];

      const primary = data.find((item) => item.is_primary === true);

      setSelectedAddress(primary || null);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = async () => {
    if (deliveryType === "delivery" && !selectedAddress) {
      showNotif("Please add address first", "warning");
      return;
    }

    try {
      setIsLoading(true);

      const userData = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/create`, {
        user_id: userData.id,
        items,
        address_id: deliveryType === "delivery" ? selectedAddress.id : null,
        delivery_type: deliveryType,
      });

      console.log("PAYMENT RESPONSE:", res.data);

      const token = res.data.token;

      if (!token) {
        showNotif("Midtrans token failed", "error");
        return;
      }

      if (!window.snap) {
        showNotif("Midtrans not loaded", "error");
        return;
      }

      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log("SUCCESS:", result);

          // Hapus cart items yang sudah dibayar
          const cartItemIds = items.map((item) => item.id);
          removeCartItems(cartItemIds);

          showNotif("Payment successful", "success");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);
        },

        onPending: function (result) {
          console.log("PENDING:", result);

          // Hapus cart items untuk pending juga (user sudah memulai pembayaran)
          const cartItemIds = items.map((item) => item.id);
          removeCartItems(cartItemIds);

          showNotif("Waiting for payment", "info");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);
        },

        onError: function (result) {
          console.log("ERROR:", result);
          showNotif("Payment failed", "error");
        },

        onClose: function () {
          showNotif("Waiting for payment", "info");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);
        },
      });
    } catch (err) {
      console.log(err);
      showNotif("Checkout failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Checkout Item</h2>

          <p className="text-gray-500 mb-6">Please add product first</p>

          <button onClick={() => navigate("/belanja")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
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
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-9999 px-4">
          <div className={`${getNotifColor()} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {notifType === "success" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notifType === "error" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {notifType === "warning" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{notif}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-5 py-2.5 shadow-md">
        <div className="w-full flex items-center gap-3">
          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="
        w-9
        h-9
        rounded-full
        bg-white/10
        hover:bg-white/20
        flex
        items-center
        justify-center
        transition
      "
          >
            <FiArrowLeft className="text-white text-lg" />
          </button>

          <div>
            <h1 className="text-[20px] font-semibold">Checkout</h1>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* ADDRESS */}
        {/* ADDRESS / PICKUP */}
        {deliveryType === "delivery" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-blue-100 flex items-center gap-3">
              <FiMapPin className="text-blue-600 text-xl" />

              <h2 className="text-xl font-semibold text-blue-700">Shipping Information</h2>
            </div>

            <div className="p-6">
              {selectedAddress ? (
                <div className="border border-blue-100 rounded-2xl p-5 bg-blue-50">
                  <div className="flex justify-between items-start gap-5">
                    <div>
                      <p className="text-blue-600 text-sm font-semibold">Main Address</p>

                      <h3 className="font-bold text-lg mt-2">{selectedAddress.receiver_name}</h3>

                      <p className="text-gray-600 text-sm">{selectedAddress.phone}</p>

                      <p className="text-gray-600 text-sm mt-2">{selectedAddress.full_address}</p>

                      <p className="text-gray-500 text-sm mt-2">{selectedAddress.district}, Surabaya</p>
                    </div>

                    <button onClick={() => navigate("/address?from=checkout")} className="text-blue-600 text-sm font-semibold">
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-5">No address yet</p>

                  <button onClick={() => navigate("/address")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-emerald-100 flex items-center gap-3">
              <FiMapPin className="text-emerald-600 text-xl" />

              <h2 className="text-xl font-semibold text-emerald-700">Pickup Location</h2>
            </div>

            <div className="p-6">
              <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50">
                <p className="text-emerald-600 text-sm font-semibold">Library Pickup Point</p>

                <h3 className="font-bold text-lg mt-2">BukuIn Library</h3>

                <p className="text-gray-600 text-sm mt-2">Jl. Ketintang, Surabaya</p>

                <p className="text-gray-600 text-sm">08.00 - 16.00 WIB</p>

                <p className="text-emerald-700 text-sm mt-3">
                  Your order can be picked up after admin updates the status to
                  <span className="font-bold"> Ready Pickup</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-700">Delivery Method</h2>
          </div>

          <div className="p-6 flex gap-4">
            <button onClick={() => setDeliveryType("delivery")} className={`flex-1 border rounded-2xl p-4 ${deliveryType === "delivery" ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
              Delivery
            </button>

            <button onClick={() => setDeliveryType("pickup")} className={`flex-1 border rounded-2xl p-4 ${deliveryType === "pickup" ? "border-emerald-600 bg-emerald-50" : "border-gray-200"}`}>
              Pickup
            </button>

            {deliveryType === "pickup" && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
                Pickup Location:
                <br />
                BookIn Library
                <br />
                08.00 - 16.00 WIB
              </div>
            )}
          </div>
        </div>
        {/* PRODUCTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-blue-100 flex items-center gap-3">
            <FiShoppingBag className="text-blue-600 text-xl" />

            <h2 className="text-xl font-semibold text-blue-700">Ordered Product</h2>
          </div>

          <div className="divide-y divide-blue-100">
            {items.map((item, index) => (
              <div key={index} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
                    {item.cover ? (
                      item.cover.startsWith("http") ? (
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://covers.openlibrary.org/b/id/${item.cover}-M.jpg`} alt={item.title} className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No Cover</div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>

                    <p className="text-sm text-gray-500 mt-2">Qty: {item.qty || 1}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>

                  <p className="font-bold text-blue-700 text-lg">Rp {(item.price * (item.qty || 1)).toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-blue-100 flex items-center gap-3">
            <FiCreditCard className="text-blue-600 text-xl" />

            <h2 className="text-xl font-semibold text-blue-700">Payment Summary</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>

              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>

              <span>Rp {shipping.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Service Fee</span>

              <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
            </div>

            <div className="border-t border-blue-100 pt-5 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total</span>

              <span className="text-3xl font-bold text-blue-700">Rp {total.toLocaleString("id-ID")}</span>
            </div>

            <button onClick={handlePayment} disabled={isLoading} className="w-full mt-5 bg-linear-to-r from-blue-700 to-blue-500 hover:opacity-90 transition text-white py-4 rounded-xl font-semibold disabled:opacity-50">
              {isLoading ? "Processing..." : "Proceed Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">BookIn</h2>

            <p className="text-gray-400 text-sm leading-relaxed">Discover thousands of books, explore new worlds, and enjoy a modern digital library experience.</p>
          </div>

          <div>
  <h3 className="font-semibold text-lg mb-4">Platform</h3>

  <div className="space-y-3 text-sm text-gray-400">
    <div className="flex items-center justify-between">
      <span>Digital Library</span>
      <span className="text-blue-400">Active</span>
    </div>

    <div className="flex items-center justify-between">
      <span>Book System</span>
      <span className="text-blue-400">Modern</span>
    </div>

    <div className="flex items-center justify-between">
      <span>Service</span>
      <span className="text-blue-400">Borrow & Buy</span>
    </div>
  </div>
</div>

          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>

            <p className="text-gray-400 text-sm leading-relaxed">Built for book lovers who want a simple, elegant, and interactive reading platform.</p>
          </div>
        </div>

        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">© 2026 BukuIn. All rights reserved.</div>
      </footer>

      <Floating />
    </div>
  );
}
