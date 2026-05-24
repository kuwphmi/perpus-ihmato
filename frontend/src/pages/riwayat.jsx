import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiHeart,
  FiHome,
  FiBook,
  FiShoppingCart,
  FiClock,
} from "react-icons/fi";

import logo from "../assets/logo.png";
import Floating from "./floating";

export default function Riwayat() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  const [historyBooks, setHistoryBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [notifications, setNotifications] =
    useState([]);

  const unreadCount =
    notifications.filter(
      (n) => !n.is_read
    ).length;
  const [search, setSearch] = useState("");


  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetchHistory();
    fetchNotifications();
  }, []);

  useEffect(() => {

    if (!search.trim()) {

      setFilteredBooks(historyBooks);
      return;

    }

    const filtered = historyBooks.filter((book) =>
      book.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredBooks(filtered);

  }, [search, historyBooks]);

  const fetchNotifications =
    async () => {

      try {

        const res =
          await fetch(
            `http://localhost:3000/api/notifications/${user.id}`
          );

        const data =
          await res.json();

        setNotifications(data);

      } catch (err) {

        console.log(err);

      }

    };

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/history/${user.id}`
      );

      const data = await res.json();

      setHistoryBooks(data || []);
      setFilteredBooks(data || []);

    } catch (err) {
      console.error(err);
    }
  };



  const handleExtension = async (book) => {
    try {

      // tanggal lama
      const oldDate = new Date(book.due_date);

      // copy tanggal
      const newDate = new Date(oldDate);

      // tambah 14 hari
      newDate.setDate(newDate.getDate() + 14);

      const res = await fetch(
        `${API_BASE}/extensions/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            loan_id: book.id,
            book_title: book.title,

            old_due_date: book.due_date,

            // tanggal baru +14 hari
            new_due_date: newDate.toISOString(),

            status: "pending",
          }),
        }
      );

      const result = await res.json();

      console.log(result);

      if (result.status) {
        alert("Extension request sent successfully");
      } else {
        alert(result.message);
      }

    } catch (err) {
      console.error(err);
    }
  };


  return (
   <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER BIRU */}
      <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">
        <div className="flex gap-6">
          {[
            { name: "Home", path: "/koleksi" },
            { name: "History", path: "/riwayat" },
            { name: "Shop", path: "/belanja" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="px-3 py-1 rounded-md transition-all duration-200 
              hover:text-blue-200 hover:bg-white/10"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center px-6 py-2">

          {/* LOGO */}
          <img src={logo} alt="logo" className="w-12 h-12 mr-4" />

          {/* SEARCH */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-lg">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-blue-500"
              />
            </div>
          </div>

          {/* ICON */}
          <div className="flex items-center gap-3 ml-4 relative">
            <Link to="/favorite">
              <FiHeart className="text-2xl text-gray-600 cursor-pointer transition duration-300 hover:text-yellow-400" />
            </Link>

            {/* NOTIF */}
            {/* NOTIFICATION */}
            <div className="relative">

              <div
                onClick={async (e) => {

                  e.stopPropagation();

                  if (!isNotifOpen) {

                    await fetch(
                      `http://localhost:3000/api/notifications/read/${user.id}`,
                      {
                        method: "PUT",
                      }
                    );

                    setNotifications((prev) =>
                      prev.map((n) => ({
                        ...n,
                        is_read: true,
                      }))
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
          min-w-[18px]
          h-[18px]
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

                  <div className="p-4 border-b font-semibold text-gray-700">

                    Notifications

                  </div>

                  <div className="max-h-96 overflow-y-auto">

                    {notifications.length === 0 ? (

                      <div className="p-6 text-sm text-gray-400 text-center">

                        No notifications yet

                      </div>

                    ) : (

                      notifications
                        .slice(0, 2)
                        .map((notif) => (

                          <div
                            key={notif.id}
                            className={`
                  p-4
                  border-b
                  hover:bg-gray-50
                  transition

                  ${!notif.is_read
                                ? "bg-blue-50"
                                : ""
                              }
                `}
                          >

                            <p className="font-medium text-sm text-gray-800">

                              {notif.title}

                            </p>

                            <p className="text-xs text-gray-500 mt-1">

                              {notif.message}

                            </p>

                          </div>


                        ))

                    )}

                  </div>

                  <button
                    onClick={() =>
                      navigate("/notifikasi")
                    }
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
                  hover:shadow-blue-400/40
                  transition-all duration-300
                  border-2 border-white
                "
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
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

      {/* OVERLAY */}
      {(isNotifOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => {
            setIsNotifOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}

      {/* CONTENT */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8 md:py-10">

        <h1 className="
text-2xl
md:text-4xl
font-bold
text-blue-700
mb-8
text-center
md:text-left
">
          Borrowing History
        </h1>

        <div className="grid gap-5">

          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="
group
bg-white
rounded-3xl
p-4 md:p-5
shadow-sm
border
border-gray-100
hover:shadow-2xl
hover:-translate-y-1
transition-all
duration-300
flex
items-start
justify-between
gap-3 md:gap-4
"
            >
              <div className="flex items-center gap-4 flex-1">

                {/* COVER */}
                <div className="
      w-16
      h-24
      md:w-20
      md:h-28
      bg-gradient-to-br
      from-blue-50
      to-blue-100
      rounded-2xl
      overflow-hidden
      flex-shrink-0
      shadow-lg
      group-hover:scale-105
      transition
      duration-300
      ">

                  {book.cover ? (

                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                      No Cover
                    </div>

                  )}

                </div>

                {/* INFO */}
                <div>

                  <h3 className="font-bold text-sm md:text-lg text-gray-800 line-clamp-1">
                    {book.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {book.loan_date
                      ? new Date(book.loan_date).toLocaleDateString("id-ID")
                      : "-"}
                  </p>

                  <div className="mt-2">
                    <span
                      className={`
        text-xs px-3 py-1 rounded-full font-medium
        ${book.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : book.status === "approved" || book.status === "borrowed"
                            ? "bg-green-100 text-green-700"
                            : book.status === "returned"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }
      `}
                    >
                      {book.status === "pending"
                        ? "Pending"
                        : book.status === "approved" || book.status === "borrowed"
                          ? "Approved"
                          : book.status === "returned"
                            ? "Returned"
                            : "Rejected"}
                    </span>
                  </div>

                </div>

                {/* ACTION BUTTON */}
                {console.log("BOOK:", book)}

                <div className="flex flex-col gap-2 w-[110px] ml-auto">

                  <Link to={`/detail-riwayat/${book.id}`}>
                    <button
                      className="
        w-full h-10 rounded-xl bg-blue-50 text-blue-700
        text-[12px] md:text-sm font-medium hover:bg-blue-100 transition
      "
                    >
                      Detail
                    </button>
                  </Link>

                  {book.status !== "returned" && (
                    <button
                      onClick={() => handleExtension(book)}
                      className="
        w-full h-10 bg-yellow-500 hover:bg-yellow-600 text-white
        rounded-xl text-[12px] md:text-sm font-medium shadow-md transition
      "
                    >
                      Extend Book
                    </button>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>



        {/* MOBILE NAV */}
        <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-xl shadow-lg z-50">
          <Link to="/koleksi"><FiHome size={24} /></Link>
          <Link to="/riwayat"><FiClock size={24} /></Link>
          <Link to="/belanja"><FiShoppingCart size={24} /></Link>
        </div>

        {/* CONTENT */}
        <main className="flex-1 bg-white">
          {/* semua isi halaman */}
        </main>


        {/* MASCOT */}
        <Floating />
      </div>
      {/* FOOTER */}
        <footer className="mt-auto bg-gray-900 text-white">

          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

            {/* BRAND */}
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-3">
                BookIn
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

          {/* BOTTOM */}
          <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
            © 2026 BookIn. All rights reserved.
          </div>

        </footer>
    </div>
  );
}