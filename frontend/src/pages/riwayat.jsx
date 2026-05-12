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
const [search, setSearch] = useState("");


const storedUser = localStorage.getItem("user");

const user = storedUser ? JSON.parse(storedUser) : null;

useEffect(() => {
  fetchHistory();
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

const requestExtension = async (loanId) => {
  try {
    const res = await fetch(
      `${API_BASE}/extensions/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loan_id: loanId,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Pengajuan perpanjangan berhasil");
      fetchHistory();
      useEffect(() => {

  if (!search.trim()) {

    setFilteredBooks(historyBooks);
    return;

  }

  const filtered = historyBooks.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  setFilteredBooks(filtered);

}, [search, historyBooks]);
    } else {
      alert(data.message || "Gagal mengajukan");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan");
  }
};

const handleExtension = async (book) => {
  try {

    const res = await fetch(
      `${API_BASE}/extensions`,
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
          new_due_date: book.due_date,
          status: "pending",
        }),
      }
    );

    const data = await res.json();

    if (data.status) {
      alert("Pengajuan perpanjangan berhasil");
    } else {
      alert(data.message);
    }

  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="min-h-screen bg-gray-100">

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

            {/* 👤 PROFILE */}
          <div className="relative">

            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen(!isProfileOpen);
              }}
              className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">

              {/* HEADER */}
              <div className="flex flex-col items-center py-6 bg-gray-50">

                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <h3 className="font-semibold text-gray-700 text-sm">
                  {user?.name || "-"}
                </h3>

                <p className="text-xs text-gray-500">
                  {user?.email || "-"}
                </p>

              </div>

              {/* BUTTON */}
              <div className="px-4 py-4">
                <Link to="/profil">
                  <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
                    My profile
                  </button>
                </Link>
              </div>

            </div>
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
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Borrowing History
        </h1>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="bg-white rounded-xl shadow p-6 space-y-4 max-h-80 overflow-y-auto"></div>

         {filteredBooks.map((book) => (
            <div
  key={book.id}
  className="flex items-center justify-between border-b pb-4 gap-4"
>
              <div className="flex items-center gap-4">

  {/* COVER */}
  <div className="w-16 h-20 bg-blue-100 rounded-lg overflow-hidden flex-shrink-0 shadow">

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

    <h3 className="font-semibold text-gray-800">
      {book.title}
    </h3>

    <p className="text-sm text-gray-500">
      {book.loan_date
        ? new Date(book.loan_date).toLocaleDateString("id-ID")
        : "-"}
    </p>

  </div>

</div>

              <div className="flex gap-3">

              <button className="text-blue-600 text-sm hover:underline">
                Detail
              </button>

              {book.status !== "returned" && (
                <button
                  onClick={() => handleExtension(book)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600"
                >
                  Borrow Request
                </button>
              )}
            </div>
            </div>
          ))}

        </div>

      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-xl shadow-lg z-50">
        <Link to="/koleksi"><FiHome size={24} /></Link>
        <Link to="/riwayat"><FiClock size={24} /></Link>
        <Link to="/belanja"><FiShoppingCart size={24} /></Link>
      </div>

       <div className="min-h-screen flex flex-col bg-gray-900">

  {/* CONTENT */}
  <main className="flex-1 bg-white">
    {/* semua isi halaman */}
  </main>

  {/* FOOTER */}
  <footer className="bg-gray-900 text-white">
    
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
      © 2026 BukuIn. All rights reserved.
    </div>

  </footer>

  {/* MASCOT */}
  <Floating />

</div>
      

    </div>
  );
}