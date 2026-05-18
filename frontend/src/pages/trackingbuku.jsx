import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBell, FiHeart, FiSearch, FiShoppingCart, FiPackage, FiTruck, FiCheckCircle, FiClock, FiHome } from "react-icons/fi";

import logo from "../assets/logo.png";
import Floating from "./floating";

export default function Trackingbuku() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const popupRef = useRef();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  useEffect(() => {
    fetchOrders();

    fetchNotifications();

    const interval = setInterval(() => {
      fetchOrders();

      fetchNotifications();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(`http://localhost:3000/api/notifications/${user.id}`);

      setNotifications(res.data || []);

      const unread = res.data.filter((item) => !item.is_read).length;

      setUnreadCount(unread);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(`http://localhost:3000/api/payment/${user.id}`);

      const data = await res.json();

      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const unpaidCount = orders.filter((o) => o.order_status === "waiting_payment").length;

  const shippingCount = orders.filter((o) => o.order_status === "shipping").length;

  const completedCount = orders.filter((o) => o.order_status === "completed").length;
  return (
    <div className="min-h-screen bg-[#f7faff]">
      {/* TOP NAVBAR */}
      <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">
        <div className="flex items-center gap-4 text-gray-100 text-sm">
          {[
            { name: "Home", path: "/koleksi" },
            { name: "Shop", path: "/belanja" },
            { name: "Orders", path: "/trackingbuku" },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="px-3 py-1 rounded-md hover:text-blue-200 transition">
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
            <img src={logo} alt="logo" className="w-12 h-12 mr-4" />

            <h1 className="text-xl font-bold text-blue-700"></h1>
          </div>

          {/* ICON */}
          <div className="flex items-center gap-3 ml-4 relative z-50">
            {/* CART */}
            <Link to="/keranjang">
              <FiShoppingCart className="text-2xl text-gray-600 hover:text-blue-600 transition cursor-pointer" />
            </Link>

            {/* NOTIFICATION */}
            <div className="relative">
              <div
                onClick={async (e) => {
                  e.stopPropagation();

                  if (!isNotifOpen) {
                    await fetch(`http://localhost:3000/api/notifications/read/${user.id}`, {
                      method: "PUT",
                    });

                    setNotifications((prev) =>
                      prev.map((n) => ({
                        ...n,
                        is_read: true,
                      })),
                    );
                  }

                  setIsNotifOpen(!isNotifOpen);
                }}
                className="relative cursor-pointer"
              >
                <FiBell className="text-2xl text-gray-600 hover:text-yellow-500 transition" />

                {unreadCount > 0 && (
                  <div
                    className="
          absolute
          -top-1
          -right-1
          min-w-4.5
          h-4.5
          px-1
          bg-red-500
          text-white
          text-[10px]
          rounded-full
          flex
          items-center
          justify-center
          font-semibold
        "
                  >
                    {unreadCount}
                  </div>
                )}
              </div>

              {isNotifOpen && (
                <div
                  className="
        absolute
        right-0
        mt-3
        w-80
        bg-white
        rounded-2xl
        shadow-2xl
        border
        z-50
        overflow-hidden
      "
                >
                  <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-sm text-gray-400 text-center">No notifications yet</div>
                    ) : (
                      notifications
                        .filter((n) => !n.is_read)
                        .slice(0, 2)
                        .map((notif) => (
                          <div
                            key={notif.id}
                            className={`
                  p-4
                  border-b
                  hover:bg-gray-50
                  transition

                  ${!notif.is_read ? "bg-blue-50" : ""}
                `}
                          >
                            <p className="font-medium text-sm text-gray-800">{notif.title}</p>

                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          </div>
                        ))
                    )}
                  </div>

                  <button
                    onClick={() => navigate("/notifikasi")}
                    className="
          w-full
          py-3
          text-sm
          font-medium
          text-blue-600
          hover:bg-blue-50
        "
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="px-6 md:px-12 pt-10">
        <div className="max-w-7xl mx-auto bg-linear-to-r from-blue-700 to-blue-500 rounded-4xl p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3">Order Tracking</h1>

            <p className="text-blue-100 max-w-2xl">Track your latest purchases, monitor shipping progress, and manage your bookstore orders easily.</p>
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

            <h2 className="text-2xl font-bold text-gray-800">{unpaidCount}</h2>

            <p className="text-gray-500 mt-1">Unpaid Orders</p>
          </div>

          {/* SHIPPING */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
              <FiTruck className="text-2xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">{shippingCount}</h2>

            <p className="text-gray-500 mt-1">Shipping Orders</p>
          </div>

          {/* COMPLETED */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
              <FiCheckCircle className="text-2xl text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">{completedCount}</h2>

            <p className="text-gray-500 mt-1">Completed Orders</p>
          </div>
        </div>
      </section>

      {/* ORDER LIST */}
      <section className="px-6 md:px-12 py-10">
        <div className="max-w-7xl mx-auto bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
          {/* HEADER */}
          <div className="px-8 py-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>

              <p className="text-gray-400 text-sm mt-1">Manage all your orders in one place</p>
            </div>

            <FiPackage className="text-3xl text-blue-600" />
          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 border rounded-3xl hover:shadow-md transition">
                {/* LEFT */}
                <div className="flex items-center gap-5">
                  <img src={`https://covers.openlibrary.org/b/id/${order.cover}-L.jpg`} alt={order.title} className="w-24 h-32 rounded-2xl object-cover" />

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{order.title}</h3>

                    <p className="text-gray-400 mt-1">Order ID: {order.order_id}</p>

                    <p className="text-blue-600 font-bold mt-3">Rp {order.amount?.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-start md:items-end gap-3">
                  {order.order_status === "waiting_payment" && (
                    <>
                      <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium">Waiting Payment</span>

                      <button onClick={() => setSelectedOrder(order)} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition">
                        View Detail
                      </button>
                    </>
                  )}

                  {order.order_status === "processing" && <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">Processing</span>}

                  {order.order_status === "shipping" && <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">Shipping</span>}

                  {order.order_status === "completed" && <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">Completed</span>}
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
            <h2 className="text-2xl font-bold text-blue-400 mb-3">BukuIn</h2>

            <p className="text-gray-400 text-sm leading-relaxed">Discover thousands of books, explore new worlds, and enjoy a modern digital library experience.</p>
          </div>

          {/* MENU */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>

            {/* MOBILE NAV */}
            <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-xl shadow-lg z-50">
              <Link to="/koleksi">
                <FiHome size={24} />
              </Link>
              <Link to="/belanja">
                <FiShoppingCart size={24} />
              </Link>
              <Link to="/trackingbuku">
                <FiPackage size={24} />
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>

            <p className="text-gray-400 text-sm leading-relaxed">Built for book lovers who want a simple, elegant, and interactive reading platform.</p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">© 2026 BukuIn. All rights reserved.</div>
      </footer>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative animate-fadeIn">
            {/* CLOSE */}
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl">
              ✕
            </button>

            {/* COVER */}
            <img src={`https://covers.openlibrary.org/b/id/${selectedOrder.cover}-L.jpg`} alt={selectedOrder.title} className="w-32 h-44 object-cover rounded-2xl mx-auto shadow" />

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-center mt-5">{selectedOrder.title}</h2>

            {/* STATUS */}
            <div className="flex justify-center mt-3">
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                {selectedOrder.order_status === "waiting_payment" && "Waiting Payment"}

                {selectedOrder.order_status === "processing" && "Processing"}

                {selectedOrder.order_status === "shipping" && "Shipping"}

                {selectedOrder.order_status === "completed" && "Completed"}
              </span>
            </div>

            {/* DETAIL */}
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>

                <span className="font-medium">{selectedOrder.order_id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>

                <span className="font-medium">Midtrans</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>

                <span className="font-bold text-blue-600">Rp {selectedOrder.amount?.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* PAYMENT BUTTON */}
            {selectedOrder.order_status === "waiting_payment" && (
              <button
                onClick={() => {
                  window.snap.pay(
                    selectedOrder.snap_token,

                    {
                      onSuccess: function () {
                        fetchOrders();
                      },
                    },
                  );
                }}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition"
              >
                View Payment QR
              </button>
            )}

            {/* COMPLETED */}
            {selectedOrder.order_status === "processing" && <div className="mt-6 bg-indigo-100 text-indigo-700 py-3 rounded-2xl text-center font-semibold">Order is being processed</div>}

            {selectedOrder.order_status === "shipping" && <div className="mt-6 bg-blue-100 text-blue-700 py-3 rounded-2xl text-center font-semibold">Your order is being shipped</div>}

            {selectedOrder.order_status === "completed" && <div className="mt-6 bg-green-100 text-green-700 py-3 rounded-2xl text-center font-semibold">Order Completed</div>}
          </div>
        </div>
      )}
      {/* FLOATING */}
      <Floating />
    </div>
  );
}
