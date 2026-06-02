import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBell, FiHeart, FiSearch, FiShoppingCart, FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiClock, FiHome } from "react-icons/fi";

import logo from "../assets/logo.png";
import Lottie from "lottie-react";
import processingAnim from "../assets/lottie/prosesing.json";
import shippingAnim from "../assets/lottie/shipping.json";
import Floating from "./floating";

export default function Trackingbuku() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const popupRef = useRef();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pickupOrder, setPickupOrder] = useState(null);
  const [popup, setPopup] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [cancelConfirmModal, setCancelConfirmModal] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [notif, setNotif] = useState("");
  const [notifType, setNotifType] = useState("info");
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
    fetchCart();

    const interval = setInterval(() => {
      fetchOrders();
      fetchNotifications();
      fetchCart();
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

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(`http://localhost:3000/api/cart/${user.id}`);

      setCart(res.data.data || []);
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
  const processingCount = orders.filter((o) => o.order_status === "processing").length;

  const shippingCount = orders.filter((o) => o.order_status === "shipping").length;
  const readyPickupCount = orders.filter((o) => o.order_status === "ready_pickup").length;
  const completedCount = orders.filter((o) => o.order_status === "completed").length;
  const filteredOrders = activeFilter === "all" ? orders : orders.filter((o) => o.order_status === activeFilter);

  const handleFilterClick = (status) => {
    setActiveFilter(status);

    // khusus mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const section = document.getElementById("orders-section");

        if (section) {
          const y = section.getBoundingClientRect().top + window.pageYOffset - 120;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  // Toast Notification
  const showNotif = (message, type = "info") => {
    setNotif(message);
    setNotifType(type);
    setTimeout(() => setNotif(""), 3000);
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

  const cancelOrder = async (id) => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await axios.delete(`http://localhost:3000/api/payment/cancel/${id}`);

      // Show success message
      setSuccessMessage("Order cancelled successfully!");

      // Auto-hide success message after 2 seconds
      setTimeout(() => setSuccessMessage(null), 2000);

      // Close modal and refresh orders
      setTimeout(() => {
        setCancelConfirmModal(null);
        setSelectedOrder(null);
        fetchOrders();
      }, 500);
    } catch (err) {
      console.log(err);
      // Show user-friendly error message
      setCancelError(err.response?.data?.message || "Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faff]">
      {/* NOTIFICATION TOAST */}
      {notif && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4">
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
            <Link to="/keranjang" className="relative">
              <FiShoppingCart className="text-2xl text-gray-600 hover:text-yellow-500 transition cursor-pointer" />

              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{cart.length}</span>}
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
                      notifications.slice(0, 2).map((notif) => (
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
        <div
          className="
    max-w-7xl
    mx-auto
    grid
    grid-cols-2
    md:grid-cols-5
    gap-5
  "
        >
          {/* UNPAID */}
          <div
            onClick={() => handleFilterClick("waiting_payment")}
            className={`
        flex
        items-center
        gap-4
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border
        cursor-pointer
        transition-all
        hover:shadow-lg
h-full

        ${activeFilter === "waiting_payment" ? "border-yellow-400 ring-2 ring-yellow-100" : "border-gray-100"}
      `}
          >
            <div
              className="
        w-14
        h-14
        rounded-2xl
        bg-yellow-100
        flex
        items-center
        justify-center
        text-yellow-600
      "
            >
              <FiClock className="text-2xl" />
            </div>

            <div>
              <p
                className="
          text-sm
          text-gray-400
        "
              >
                Unpaid
              </p>

              <h2
                className="
          text-2xl
          font-black
          text-yellow-600
        "
              >
                {unpaidCount}
              </h2>
            </div>
          </div>

          {/* PROCESSING */}
          <div
            onClick={() => handleFilterClick("processing")}
            className={`
              min-w-37.5
shrink-0
            flex
            items-center
            gap-4
            bg-white
            rounded-3xl
            p-6
            shadow-sm
            border
            cursor-pointer
            transition-all
            hover:shadow-lg

            ${activeFilter === "processing" ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-100"}
          `}
          >
            <div
              className="
              w-14
              h-14
              rounded-2xl
              bg-indigo-100
              flex
              items-center
              justify-center
              text-indigo-600
            "
            >
              <FiPackage className="text-2xl" />
            </div>

            <div>
              <p
                className="
      text-sm
      text-gray-400
    "
              >
                Processing
              </p>

              <h2
                className="
      text-2xl
      font-black
      text-indigo-600
    "
              >
                {processingCount}
              </h2>
            </div>
          </div>

          {/* SHIPPING */}
          <div
            onClick={() => handleFilterClick("shipping")}
            className={`
              p-7
h-full
        flex
        items-center
        gap-4
        bg-white
        rounded-3xl
        shadow-sm
        border
        cursor-pointer
        transition-all
        hover:shadow-lg

        ${activeFilter === "shipping" ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-100"}
      `}
          >
            <div
              className="
        w-14
        h-14
        rounded-2xl
        bg-blue-100
        flex
        items-center
        justify-center
        text-blue-600
      "
            >
              <FiTruck className="text-2xl" />
            </div>

            <div>
              <p
                className="
          text-sm
          text-gray-400
        "
              >
                Shipping
              </p>

              <h2
                className="
          text-2xl
          font-black
          text-blue-600
        "
              >
                {shippingCount}
              </h2>
            </div>
          </div>

          {/* READY PICKUP */}
          <div
            onClick={() => handleFilterClick("ready_pickup")}
            className={`
              p-7
h-full
    flex
    items-center
    gap-4
    bg-white
    rounded-3xl
    shadow-sm
    border
    cursor-pointer
    transition-all
    hover:shadow-lg

    ${activeFilter === "ready_pickup" ? "border-emerald-400 ring-2 ring-emerald-100" : "border-gray-100"}
  `}
          >
            <div
              className="
    w-14
    h-14
    rounded-2xl
    bg-emerald-100
    flex
    items-center
    justify-center
    text-emerald-600
  "
            >
              <FiMapPin className="text-2xl" />
            </div>

            <div>
              <p
                className="
      text-sm
      text-gray-400
    "
              >
                Ready Pickup
              </p>

              <h2
                className="
      text-2xl
      font-black
      text-emerald-600
    "
              >
                {readyPickupCount}
              </h2>
            </div>
          </div>

          {/* COMPLETED */}
          <div
            onClick={() => handleFilterClick("completed")}
            className={`
              p-7
h-full
        flex
        items-center
        gap-4
        bg-white
        rounded-3xl
        shadow-sm
        border
        cursor-pointer
        transition-all
        hover:shadow-lg

        ${activeFilter === "completed" ? "border-green-400 ring-2 ring-green-100" : "border-gray-100"}
      `}
          >
            <div
              className="
        w-14
        h-14
        rounded-2xl
        bg-green-100
        flex
        items-center
        justify-center
        text-green-600
      "
            >
              <FiCheckCircle className="text-2xl" />
            </div>

            <div>
              <p
                className="
          text-sm
          text-gray-400
        "
              >
                Completed
              </p>

              <h2
                className="
          text-2xl
          font-black
          text-green-600
        "
              >
                {completedCount}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER LIST */}
      <section className="px-6 md:px-12 py-10">
        <div className="max-w-7xl mx-auto bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
          {/* HEADER */}
          <div
            className="
          px-8
          py-4
          border-blue-900
          flex
          items-center
          justify-between
        "
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <p className="text-gray-400 text-sm mt-1">Manage all your orders in one place</p>
            </div>

            <FiPackage className="text-3xl text-blue-600" />
          </div>

          {/* CONTENT */}
          <div
            id="orders-section"
            className="
    p-5
    md:p-8
    space-y-5
  "
          >
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="
  flex
  flex-col
  md:flex-row
  md:items-center
  justify-between
  gap-4

  p-4
  md:p-5

  border
  border-blue-300
  rounded-[28px]

  bg-white

  hover:border-blue-500
  hover:shadow-lg

  transition-all
  duration-300
"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={order.cover}
                    alt={order.title}
                    className="
  w-20
  h-28
  md:w-24
  md:h-32
  rounded-2xl
  object-cover
  shadow
"
                  ></img>

                  <div>
                    <h3
                      className="
  text-lg
  md:text-xl
  font-bold
  text-gray-800
"
                    >
                      {order.title}
                    </h3>
                    <p className="text-gray-400 mt-1">Order ID: {order.order_id}</p>
                    <p className="text-blue-600 font-bold mt-3">Rp {order.amount?.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-start md:items-end gap-3">
                  {order.order_status === "waiting_payment" && (
                    <div onClick={() => setSelectedOrder(order)} className="cursor-pointer flex flex-col gap-2">
                      <span
                        className="
bg-yellow-100
    text-yellow-600
      px-4
      py-2
      rounded-full
      text-sm
      font-medium
      cursor-pointer
     hover:bg-yellow-200
      transition
    "
                      >
                        Waiting Payment
                      </span>
                    </div>
                  )}
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-400 mb-1">Delivery Method</div>

                    <div className="font-semibold text-slate-800">{order.delivery_type === "pickup" ? "Pickup" : "Delivery"}</div>
                  </div>

                  {order.order_status === "processing" && (
                    <span onClick={() => setPopup("processing")} className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-indigo-200 transition">
                      Processing
                    </span>
                  )}

                  {order.order_status === "shipping" && (
                    <span onClick={() => setPopup("shipping")} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition">
                      Shipping
                    </span>
                  )}
                  {order.order_status === "ready_pickup" && (
                    <button
                      onClick={() => setPickupOrder(order)}
                      className="
      bg-emerald-100
      text-emerald-600
      px-4
      py-2
      rounded-full
      text-sm
      font-medium
      cursor-pointer
      hover:bg-emerald-200
      transition
    "
                    >
                      Ready Pickup
                    </button>
                  )}

                  {order.order_status === "completed" && (
                    <span
                      className="
      bg-emerald-100
      text-emerald-600
      px-4
      py-2
      rounded-full
      text-sm
      font-medium
      cursor-pointer
      hover:bg-emerald-200
      transition
    "
                      onClick={() => setSelectedOrder(order)}
                    >
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
            <h2 className="text-2xl font-bold text-blue-400 mb-3">BookIn</h2>

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
        <div
          onClick={() => setSelectedOrder(null)}
          className="
    fixed
    inset-0
   bg-black/50 backdrop-blur-sm
    flex
    items-center
    justify-center
    z-50
    px-4
  "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
  bg-white
  w-95
  md:w-107.5
  rounded-xl
  p-6
  relative
  animate-fadeIn
  shadow-2xl
  border
  border-gray-200
"
          >
            {/* CLOSE */}
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl">
              ✕
            </button>

            {/* COVER */}
            <img
              src={selectedOrder.cover}
              alt={selectedOrder.title}
              className="
    w-36
    h-52
    object-cover
    rounded-lg
    mx-auto
    shadow-lg
  "
            />

            {/* TITLE */}
            <h2
              className="
  text-3xl
  font-bold
  text-center
  mt-6
  text-gray-800
"
            >
              {selectedOrder.title}
            </h2>

            {/* STATUS */}
            <div className="flex justify-center mt-3">
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                {selectedOrder.order_status === "waiting_payment" && "Waiting Payment"}

                {selectedOrder.order_status === "processing" && "Processing"}
                {selectedOrder.order_status === "ready_pickup" && "Ready Pickup"}

                {selectedOrder.order_status === "shipping" && "Shipping"}

                {selectedOrder.order_status === "completed" && "Completed"}
              </span>
            </div>

            {/* DETAIL */}
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>

                <span className="font-medium">{user.name}</span>
              </div>

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
              {/* PRINT BUTTON (ONLY COMPLETED) */}
              {selectedOrder.order_status === "completed" && (
                <button
                  onClick={() => window.print()}
                  className="
      mt-6
      w-full
      bg-black
      text-white
      py-3
      rounded-2xl
      font-semibold
      hover:bg-gray-800
      transition
    "
                >
                  Print Receipt
                </button>
              )}
            </div>

            {/* PAYMENT ACTION */}
            {selectedOrder.order_status === "waiting_payment" && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    window.snap.pay(
                      selectedOrder.snap_token,

                      {
                        onSuccess: function (result) {
                          showNotif("Payment successful!", "success");
                          console.log(result);
                          fetchOrders();
                        },

                        onPending: function (result) {
                          showNotif("Waiting for your payment!", "info");
                          console.log(result);
                        },

                        onError: function (result) {
                          showNotif("Payment failed!", "error");

                          console.log(result);
                        },

                        onClose: function () {
                          setSelectedOrder(null); // tutup modal detail order

                          navigate("/trackingbuku"); // pindah ke tracking
                        },
                      },
                    );
                  }}
                  className="
        flex-1
        bg-blue-600
        hover:bg-blue-700
        text-white
        py-3
        rounded-2xl
        font-semibold
        transition
      "
                >
                  Continue Payment
                </button>

                <button
                  onClick={() => {
                    setCancelConfirmModal(selectedOrder.id);
                    setCancelError(null);
                  }}
                  disabled={isCancelling}
                  className="
    flex-1
    border
    border-red-500
    text-red-500
    hover:bg-red-50
    disabled:opacity-50
    disabled:cursor-not-allowed
    py-3
    rounded-2xl
    font-semibold
    transition
  "
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {pickupOrder && (
        <div onClick={() => setPickupOrder(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="
        bg-white
        w-95
        md:w-107.5
        rounded-xl
        p-6
        relative
        shadow-2xl
        border
        border-gray-200
      "
          >
            {/* CLOSE */}
            <button onClick={() => setPickupOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl">
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-3xl font-bold text-center text-gray-800">RECEIPT</h2>

            <p className="text-center text-sm text-gray-500 mt-1">Pickup Order Confirmation</p>

            {/* COVER */}
            <img
              src={`https://covers.openlibrary.org/b/id/${pickupOrder.cover}-L.jpg`}
              alt={pickupOrder.title}
              className="
          w-36
          h-52
          object-cover
          rounded-lg
          mx-auto
          mt-6
          shadow-lg
        "
            />

            {/* BOOK TITLE */}
            <h3 className="text-xl font-bold text-center mt-4 text-gray-800">{pickupOrder.title}</h3>

            {/* STATUS */}
            <div className="flex justify-center mt-3">
              <span className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium">Ready for Pickup</span>
            </div>

            {/* DETAIL */}
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>

                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">{pickupOrder.order_id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-blue-600">Rp {pickupOrder.amount?.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">Pickup</span>
              </div>
            </div>

            {/* PRINT BUTTON */}
            <button
              onClick={() => window.print()}
              className="
          mt-6
          w-full
          bg-black
          text-white
          py-3
          rounded-2xl
          font-semibold
          hover:bg-gray-800
          transition
        "
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}
      {popup === "processing" && (
        <div onClick={() => setPopup(null)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white w-90 rounded-3xl shadow-2xl p-6 text-center">
            {/* close button */}
            <button onClick={() => setPopup(null)} className="absolute top-3 right-3 text-gray-400 hover:text-black">
              ✕
            </button>

            {/* badge */}
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Processing</span>

            {/* title */}
            <h2 className="text-lg font-semibold text-blue-600 mt-3">Preparing Your Order</h2>

            {/* animation */}
            <Lottie animationData={processingAnim} loop autoplay className="w-48 h-48 mx-auto" />

            {/* subtitle */}
            <p className="text-sm text-gray-500 mt-2">We are carefully packing your items. Please wait a moment.</p>

            {/* progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
              <div className="h-1 bg-blue-600 w-1/3 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {popup === "shipping" && (
        <div onClick={() => setPopup(null)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white w-90 rounded-3xl shadow-2xl p-6 text-center">
            {/* close button */}
            <button onClick={() => setPopup(null)} className="absolute top-3 right-3 text-gray-400 hover:text-black">
              ✕
            </button>

            {/* badge */}
            <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">On Delivery</span>

            {/* title */}
            <h2 className="text-lg font-semibold text-indigo-600 mt-3">Your Order is On The Way</h2>

            {/* animation */}
            <Lottie animationData={shippingAnim} loop autoplay className="w-48 h-48 mx-auto" />

            {/* subtitle */}
            <p className="text-sm text-gray-500 mt-2">Courier is delivering your package. Stay tuned!</p>

            {/* progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
              <div className="h-1 bg-indigo-600 w-2/3 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {cancelConfirmModal && (
        <div onClick={() => !isCancelling && setCancelConfirmModal(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-85 md:w-95 rounded-2xl p-6 shadow-2xl">
            {/* ICON */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* TITLE */}
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Cancel Order?</h3>

            {/* MESSAGE */}
            <p className="text-center text-gray-600 text-sm mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>

            {/* ERROR MESSAGE */}
            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{cancelError}</p>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirmModal(null)}
                disabled={isCancelling}
                className="
                  flex-1
                  px-4
                  py-2.5
                  bg-gray-100
                  hover:bg-gray-200
                  disabled:opacity-50
                  text-gray-700
                  font-semibold
                  rounded-lg
                  transition
                "
              >
                Keep Order
              </button>

              <button
                onClick={() => cancelOrder(cancelConfirmModal)}
                disabled={isCancelling}
                className="
                  flex-1
                  px-4
                  py-2.5
                  bg-red-600
                  hover:bg-red-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  rounded-lg
                  transition
                "
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS NOTIFICATION TOAST */}
      {successMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* FLOATING */}
      <Floating />
    </div>
  );
}
