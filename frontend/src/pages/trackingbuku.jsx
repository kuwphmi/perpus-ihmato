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
  const [cart, setCart] = useState([]);
  const popupRef = useRef();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] =
    useState("all");
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

      const user =
        JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:3000/api/cart/${user.id}`
      );

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
  const processingCount =
    orders.filter(
      (o) =>
        o.order_status === "processing"
    ).length;

  const shippingCount = orders.filter((o) => o.order_status === "shipping").length;
  const completedCount = orders.filter((o) => o.order_status === "completed").length;
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter(
        (o) =>
          o.order_status === activeFilter
      );

  const cancelOrder =
    async (id) => {

      try {

        await axios.delete(
          `http://localhost:3000/api/payment/${id}`
        );

        fetchOrders();

        setSelectedOrder(null);

      } catch (err) {

        console.log(err);

      }

    };

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
            <Link to="/keranjang" className="relative">

              <FiShoppingCart className="text-2xl text-gray-600 hover:text-yellow-500 transition cursor-pointer" />

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}

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

        <div className="
    max-w-7xl
    mx-auto
    grid
    md:grid-cols-4
    gap-6
  ">

          {/* UNPAID */}
          <div
            onClick={() =>
              setActiveFilter(
                "waiting_payment"
              )
            }
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

        ${activeFilter ===
                "waiting_payment"
                ? "border-yellow-400 ring-2 ring-yellow-100"
                : "border-gray-100"
              }
      `}
          >

            <div className="
        w-14
        h-14
        rounded-2xl
        bg-yellow-100
        flex
        items-center
        justify-center
        text-yellow-600
      ">

              <FiClock className="text-2xl" />

            </div>

            <div>

              <p className="
          text-sm
          text-gray-400
        ">

                Unpaid

              </p>

              <h2 className="
          text-2xl
          font-black
          text-yellow-600
        ">

                {unpaidCount}

              </h2>

            </div>

          </div>

          {/* PROCESSING */}
          <div
            onClick={() =>
              setActiveFilter("processing")
            }
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

    ${activeFilter === "processing"
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-100"
              }
  `}
          >

            <div className="
    w-14
    h-14
    rounded-2xl
    bg-indigo-100
    flex
    items-center
    justify-center
    text-indigo-600
  ">

              <FiPackage className="text-2xl" />

            </div>

            <div>

              <p className="
      text-sm
      text-gray-400
    ">

                Processing

              </p>

              <h2 className="
      text-2xl
      font-black
      text-indigo-600
    ">

                {processingCount}

              </h2>

            </div>

          </div>

          {/* SHIPPING */}
          <div
            onClick={() =>
              setActiveFilter("shipping")
            }
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

        ${activeFilter === "shipping"
                ? "border-blue-400 ring-2 ring-blue-100"
                : "border-gray-100"
              }
      `}
          >

            <div className="
        w-14
        h-14
        rounded-2xl
        bg-blue-100
        flex
        items-center
        justify-center
        text-blue-600
      ">

              <FiTruck className="text-2xl" />

            </div>

            <div>

              <p className="
          text-sm
          text-gray-400
        ">

                Shipping

              </p>

              <h2 className="
          text-2xl
          font-black
          text-blue-600
        ">

                {shippingCount}

              </h2>

            </div>

          </div>

          {/* COMPLETED */}
          <div
            onClick={() =>
              setActiveFilter(
                "completed"
              )
            }
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

        ${activeFilter ===
                "completed"
                ? "border-green-400 ring-2 ring-green-100"
                : "border-gray-100"
              }
      `}
          >

            <div className="
        w-14
        h-14
        rounded-2xl
        bg-green-100
        flex
        items-center
        justify-center
        text-green-600
      ">

              <FiCheckCircle className="text-2xl" />

            </div>

            <div>

              <p className="
          text-sm
          text-gray-400
        ">

                Completed

              </p>

              <h2 className="
          text-2xl
          font-black
          text-green-600
        ">

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
          <div className="
  px-8
  py-4
   border-blue-900
  flex
  items-center
  justify-between
">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>

              <p className="text-gray-400 text-sm mt-1">Manage all your orders in one place</p>
            </div>

            <FiPackage className="text-3xl text-blue-600" />
          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="
    flex
    flex-col
    md:flex-row
    md:items-center
    justify-between
    gap-5
    p-5
    border
    border-blue-400
    rounded-3xl
    hover:border-blue-600
    hover:shadow-md
    transition
  "
              >
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

                  {order.order_status === "processing" && (
                    <>

                      <span className="
      bg-indigo-100
      text-indigo-600
      px-4
      py-2
      rounded-full
      text-sm
      font-medium
    ">

                        Processing

                      </span>

                      <button
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="
        border
        border-indigo-500
        text-indigo-600
        px-4
        py-2
        rounded-xl
        text-sm
        hover:bg-indigo-50
        transition
      "
                      >

                        View Receipt

                      </button>

                    </>
                  )}

                  {order.order_status ===
                    "shipping" && (

                      <>

                        <span className="
      bg-blue-100
      text-blue-600
      px-4
      py-2
      rounded-full
      text-sm
      font-medium
    ">

                          Shipping

                        </span>

                        <button
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="
        border
        border-blue-500
        text-blue-600
        px-4
        py-2
        rounded-xl
        text-sm
        hover:bg-blue-50
        transition
      "
                        >

                          View Receipt

                        </button>

                      </>

                    )}

                  {order.order_status ===
                    "completed" && (

                      <>

                        <span className="
      bg-green-100
      text-green-600
      px-4
      py-2
      rounded-full
      text-sm
      font-medium
    ">

                          Completed

                        </span>

                        <button
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="
        border
        border-green-500
        text-green-600
        px-4
        py-2
        rounded-xl
        text-sm
        hover:bg-green-50
        transition
      "
                        >

                          View Receipt

                        </button>

                      </>

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
          onClick={() =>
            setSelectedOrder(null)
          }
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
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
  bg-white/95
  backdrop-blur-md
  w-fit
  rounded-[32px]
  p-3
  relative
  animate-fadeIn
  shadow-[0_20px_60px_rgba(0,0,0,0.25)]
  scale-[0.72]
"
          >
            {/* CLOSE */}
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl">
              ✕
            </button>

            {/* COVER */}
            <img
              src={`https://covers.openlibrary.org/b/id/${selectedOrder.cover}-L.jpg`}
              alt={selectedOrder.title}
              className="w-32 h-44 object-cover rounded-2xl mx-auto shadow"
            />

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-center mt-5">
              {selectedOrder.title}
            </h2>

            {/* STATUS */}
            <div className="flex justify-center mt-3">

              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">

                {selectedOrder.order_status === "waiting_payment" &&
                  "Waiting Payment"}

                {selectedOrder.order_status === "processing" &&
                  "Processing"}

                {selectedOrder.order_status === "shipping" &&
                  "Shipping"}

                {selectedOrder.order_status === "completed" &&
                  "Completed"}

              </span>

            </div>

            {/* DETAIL */}
            <div className="mt-6 space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Order ID
                </span>

                <span className="font-medium">
                  {selectedOrder.order_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Payment
                </span>

                <span className="font-medium">
                  Midtrans
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Total
                </span>

                <span className="font-bold text-blue-600">
                  Rp {selectedOrder.amount?.toLocaleString("id-ID")}
                </span>
              </div>

            </div>

            {/* PAYMENT ACTION */}
            {selectedOrder.order_status ===
              "waiting_payment" && (

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => {

                      window.snap.pay(
                        selectedOrder.snap_token,

                        {

                          onSuccess: function (result) {

                            alert(
                              "Payment successful!"
                            );

                            console.log(result);

                            fetchOrders();

                          },

                          onPending: function (result) {

                            alert(
                              "Waiting for your payment!"
                            );

                            console.log(result);

                          },

                          onError: function (result) {

                            alert(
                              "Payment failed!"
                            );

                            console.log(result);

                          },

                          onClose: function () {

                            alert(
                              "You closed the payment popup"
                            );

                          },

                        }

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

                      const confirmCancel =
                        window.confirm(
                          "Are you sure you want to cancel this order?"
                        );

                      if (confirmCancel) {

                        cancelOrder(
                          selectedOrder.id
                        );

                      }

                    }}
                    className="
    flex-1
    border
    border-red-500
    text-red-500
    hover:bg-red-50
    py-3
    rounded-2xl
    font-semibold
    transition
  "
                  >
                    Cancel
                  </button>

                </div>

              )}


            {/* COMPLETED */}
            {selectedOrder.order_status ===
              "processing" && (

                <div className="
    mt-2
    w-full
    w-[290px]
    mx-auto
    bg-white
    border
    border-gray-300
    shadow-xl
    print-area
    overflow-hidden
    font-mono
  ">

                  {/* TOP */}
                  <div className="
      text-center
      py-4
      border-b
      border-dashed
    ">

                    <img
                      src={logo}
                      alt="logo"
                      className="
          w-16
          h-16
          mx-auto
          mb-2
        "
                    />

                    <h2 className="
        text-2xl
        font-black
        tracking-widest
      ">

                      BOOKIN

                    </h2>

                    <p className="text-xs mt-1">
                      PROCESSING RECEIPT
                    </p>

                  </div>

                  {/* COVER */}
                  <div className="
      flex
      justify-center
      py-5
      border-b
      border-dashed
    ">

                    <img
                      src={`https://covers.openlibrary.org/b/id/${selectedOrder.cover}-L.jpg`}
                      alt={selectedOrder.title}
                      className="
          w-24
          h-36
          object-cover
          shadow-md
        "
                    />

                  </div>

                  {/* CONTENT */}
                  <div className="
      p-4
      text-[12px]
      space-y-3
    ">

                    <div className="flex justify-between">
                      <span>ORDER ID</span>
                      <span>{selectedOrder.order_id}</span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>CUSTOMER</span>
                      <span>{user?.name}</span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="
  flex
  justify-between
  gap-5
">

                      <span>BOOK</span>

                      <span className="text-right">
                        {selectedOrder.title}
                      </span>

                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>STATUS</span>

                      <span className="font-bold text-indigo-600">
                        PROCESSING
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>PAYMENT</span>

                      <span className="font-bold">
                        SUCCESS
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="
        flex
        justify-between
        text-lg
        font-black
      ">

                      <span>TOTAL</span>

                      <span>
                        Rp
                        {selectedOrder.amount?.toLocaleString("id-ID")}
                      </span>

                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="
      text-center
      py-5
      border-t
      border-dashed
      text-xs
    ">

                    <p>
                      Your order is being processed
                    </p>

                    <p className="mt-1">
                      Thank you for shopping at BOOKIN
                    </p>

                    <button
                      onClick={() =>
                        window.print()
                      }
                      className="
          mt-4
          border
          border-black
          px-5
          py-2
          text-sm
          hover:bg-black
          hover:text-white
          transition
        "
                    >

                      PRINT RECEIPT

                    </button>

                  </div>

                </div>

              )}

            {/* SHIPPING RECEIPT */}
            {selectedOrder.order_status ===
              "shipping" && (

                <div className="
  mt-4
  w-full
  w-[290px]
  mx-auto
  bg-white
  border
  border-gray-300
  shadow-none
  print-area
  overflow-hidden
  font-mono
">

                  {/* TOP */}
                  <div className="
      text-center
      py-6
      border-b
      border-dashed
    ">

                    <img
                      src={logo}
                      alt="logo"
                      className="
          w-16
          h-16
          mx-auto
          mb-2
        "
                    />

                    <h2 className="
        text-2xl
        font-black
        tracking-widest
      ">

                      BOOKIN

                    </h2>

                    <p className="text-xs mt-1">
                      SHIPPING RECEIPT
                    </p>

                  </div>

                  {/* COVER */}
                  <div className="
      flex
      justify-center
      py-5
      border-b
      border-dashed
    ">

                    <img
                      src={`https://covers.openlibrary.org/b/id/${selectedOrder.cover}-L.jpg`}
                      alt={selectedOrder.title}
                      className="
          w-24
          h-36
          object-cover
          shadow-md
        "
                    />

                  </div>

                  {/* CONTENT */}
                  <div className="
  p-4
  text-[12px]
  space-y-3
">

                    <div className="flex justify-between">
                      <span>ORDER ID</span>
                      <span>{selectedOrder.order_id}</span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>CUSTOMER</span>
                      <span>{user?.name}</span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between gap-5">
                      <span>BOOK</span>

                      <span className="text-right">
                        {selectedOrder.title}
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>STATUS</span>

                      <span className="font-bold">
                        SHIPPING
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>PAYMENT</span>

                      <span className="font-bold">
                        SUCCESS
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>COURIER</span>

                      <span>BOOKIN EXPRESS</span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>TRACKING</span>

                      <span>
                        BK-
                        {selectedOrder.id}
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="
        flex
        justify-between
        text-lg
        font-black
      ">

                      <span>TOTAL</span>

                      <span>
                        Rp
                        {selectedOrder.amount?.toLocaleString("id-ID")}
                      </span>

                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="
      text-center
      py-5
      border-t
      border-dashed
      text-xs
    ">

                    <p>
                      Your package is on delivery
                    </p>

                    <p className="mt-1">
                      Thank you for shopping
                    </p>

                    <button
                      onClick={() =>
                        window.print()
                      }
                      className="
          mt-2
          border
          border-black
          px-4
          py-1.5
          text-sm
          hover:bg-black
          hover:text-white
          transition
        "
                    >

                      PRINT RECEIPT

                    </button>

                  </div>

                </div>

              )}

            {/* COMPLETED RECEIPT */}
            {selectedOrder.order_status ===
              "completed" && (

                <div className="
    mt-2
    w-full
    w-[290px]
    mx-auto
    bg-white
    border
    border-gray-300
    shadow-none
    print-area
overflow-hidden
font-mono
  ">

                  {/* TOP */}
                  <div className="
      text-center
      py-4
      border-b
      border-dashed
    ">

                    <img
                      src={logo}
                      alt="logo"
                      className="
          w-16
          h-16
          mx-auto
          mb-2
        "
                    />

                    <h2 className="
        text-2xl
        font-black
        tracking-widest
      ">

                      BOOKIN

                    </h2>

                    <p className="text-xs mt-1">
                      COMPLETED RECEIPT
                    </p>

                  </div>

                  {/* COVER */}
                  <div className="
      flex
      justify-center
      py-5
      border-b
      border-dashed
    ">

                    <img
                      src={`https://covers.openlibrary.org/b/id/${selectedOrder.cover}-L.jpg`}
                      alt={selectedOrder.title}
                      className="
          w-24
          h-36
          object-cover
          shadow-md
        "
                    />

                  </div>

                  {/* CONTENT */}
                  <div className="
  p-4
  text-[12px]
  space-y-3
">

                    <div className="flex justify-between">
                      <span>ORDER ID</span>
                      <span>{selectedOrder.order_id}</span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>CUSTOMER</span>
                      <span>{user?.name}</span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="
  flex
  justify-between
  gap-5
">
                      <span>BOOK</span>

                      <span className="text-right">
                        {selectedOrder.title}
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="flex justify-between">
                      <span>STATUS</span>

                      <span className="font-bold">
                        COMPLETED
                      </span>
                    </div>

                    <div className="border-b border-dashed"></div>

                    <div className="
        flex
        justify-between
        text-lg
        font-black
      ">

                      <span>TOTAL</span>

                      <span>
                        Rp
                        {selectedOrder.amount?.toLocaleString("id-ID")}
                      </span>

                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="
      text-center
      py-5
      border-t
      border-dashed
      text-xs
    ">

                    <p>
                      Order completed successfully
                    </p>

                    <p className="mt-1">
                      Thank you for shopping at BOOKIN
                    </p>

                    <button
                      onClick={() =>
                        window.print()
                      }
                      className="
          mt-4
          border
          border-black
          px-5
          py-2
          text-sm
          hover:bg-black
          hover:text-white
          transition
        "
                    >

                      PRINT RECEIPT

                    </button>

                  </div>

                </div>

              )}

          </div>
        </div>
      )}
      {/* FLOATING */}
      <Floating />
    </div>
  );
}
