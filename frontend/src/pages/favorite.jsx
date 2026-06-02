import { useEffect, useState, useRef } from "react";
import {
  Heart,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ ditambahin
import Floating from "./floating";
import { FiBell } from "react-icons/fi";

export default function Favorit() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBorrowPopup, setShowBorrowPopup] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [bookDescription, setBookDescription] = useState("");
  const [notif, setNotif] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const popupRef = useRef();
  const navigate = useNavigate(); // ✅ ditambahin
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(data);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeFavorite = (workKey) => {
  const updated = favorites.filter(
    (item) => item.workKey !== workKey
  );
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const filtered = favorites.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const showNotif = (message) => {
  setNotif(message);

  setTimeout(() => {
    setNotif("");
  }, 2000);
};

const fetchDescription = async (workKey, book) => {
  try {
    const res = await fetch(
      `https://openlibrary.org${workKey}.json`
    );

    const data = await res.json();

    if (typeof data.description === "string") {
      setBookDescription(data.description);

    } else if (data.description?.value) {
      setBookDescription(data.description.value);

    } else {
      setBookDescription(
        `${book.title} is written by ${book.author}.`
      );
    }

  } catch (err) {

    if (book.firstSentence) {

      setBookDescription(book.firstSentence);

    } else {

      setBookDescription(
        `No detailed description available.`
      );
    }
  }
};

const handleDetail = async (book) => {
  setSelectedBook(book);
  setShowDetailPopup(true);

  await fetchDescription(book.workKey, book);
};

const handleBorrow = async (book) => {
  setSelectedBook(book);
  setShowBorrowPopup(true);

  await fetchDescription(book.workKey, book);
};

const submitLoanRequest = async () => {
  try {

    const res = await fetch(
      "http://localhost:3000/api/loan-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user.id,
          book_key:
            selectedBook.cover +
            "_" +
            selectedBook.title,

          title: selectedBook.title,
          author: selectedBook.author,
          cover: selectedBook.cover,
        }),
      }
    );

    const data = await res.json();

    if (!data.status) {
      showNotif(data.message);
      return;
    }

    showNotif("Borrow request submitted");

    setShowBorrowPopup(false);
    setSelectedBook(null);

  } catch (err) {
    showNotif("Failed to borrow book");
  }
};

  return (
    <div className="min-h-screen bg-[#f7faff]">

      {/* 🔹 HEADER */}
<div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
  
  {/* LEFT */}
<div className="flex items-center gap-3">

  {/* BACK */}
  <button
    onClick={() => navigate(-1)}
    className="
      w-10
      h-10
      rounded-full
      bg-blue-50
      hover:bg-blue-100
      flex
      items-center
      justify-center
      transition
    "
  >
    <ArrowLeft className="w-5 h-5 text-blue-600" />
  </button>

  <div>

    <h1 className="text-[20px] font-semibold text-blue-600">
      My Favorites
    </h1>

  </div>

</div>

  {/* RIGHT */}
  <div className="flex items-center gap-4">

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
    text-sm
    font-semibold
    shadow-lg
    hover:scale-105
    transition-all duration-300
    border-2 border-white
  "
>
  {user.name ? user.name.charAt(0).toUpperCase() : "U"}

  
</button>

  </div>
</div>

{/* 🔹 SEARCH */}
<div className="px-5 py-3">
  <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition">
    <Search className="text-gray-400 w-4 h-4 mr-2" />

    <input
      type="text"
      placeholder="Search favorites..."
      className="outline-none text-sm w-full bg-transparent"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>

{/* 🔹 LIST */}
<div className="px-5 pb-10">
  {filtered.length > 0 ? (

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

      {filtered.map((book) => (

        <div
          key={book.workKey}
          className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >

          {/* COVER */}
          <div className="relative h-44 md:h-60 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 z-10"></div>

          {book.cover ? (
           <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-sm">No Cover</div>
          )}

            {/* LOVE BUTTON */}
            <button
              onClick={() => removeFavorite(book.workKey)}
              className="absolute top-3 right-3 z-20 bg-white/90 p-2 rounded-full shadow hover:scale-110 transition"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </button>

          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col h-[190px]">

            <div>

              <h3 className="text-xs md:text-sm font-semibold line-clamp-2 min-h-[34px] md:min-h-[40px]">
                {book.title}
              </h3>

              <p className="text-[11px] md:text-xs text-gray-500 min-h-[18px] md:min-h-[20px]">
                {book.author}
              </p>

              <p className="text-gray-400 text-xs mt-1 mb-3 line-clamp-2 min-h-[32px]">
                {book.firstSentence ||
                  `This book discusses ${
                    book.subjects?.join(", ") || "various topics"
                  }.`}
              </p>

            </div>

            {/* BUTTON */}
            <div className="flex gap-2 mt-auto">

             <button
                onClick={() => handleBorrow(book)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs md:text-sm font-semibold transition"
              >
                Borrow
              </button>

              <button
                onClick={() => handleDetail(book)}
                className="flex-1 bg-gray-200 py-2 rounded-lg text-[11px] md:text-sm hover:bg-gray-300"
              >
                Detail
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>

  ) : (
    <>
      {/* EMPTY STATE */}
      <div className="text-center mt-24">

        <p className="text-gray-400 text-sm">
          No favorites yet 💙
        </p>

        <div className="flex flex-col items-center justify-center mt-6 text-center">

          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <Heart className="w-6 h-6 text-blue-500" />
          </div>

          <p className="text-gray-400 text-sm mb-4">
            Save the books you love so they’re easier to find later.
          </p>

          <button
            onClick={() => navigate("/koleksi")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Explore Books
          </button>

        </div>

      </div>
    </>
  )}
</div>

{/* 🔥 POPUP PROFILE */}
{isProfileOpen && (
  <>
    {/* CLICK OUTSIDE */}
    <div
      className="fixed inset-0 z-40"
      onClick={() => setIsProfileOpen(false)}
    ></div>

    {/* POPUP */}
    <div
      ref={popupRef}
      className="
        absolute right-5 top-16 z-50
        w-72
        rounded-[28px]
        overflow-hidden
        bg-white/80
        backdrop-blur-2xl
        border border-white/40
        shadow-[0_12px_40px_rgba(0,0,0,0.16)]
        animate-[fadeIn_.25s_ease]
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


{/* NOTIFICATION */}
{notif && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium">
      {notif}
    </div>
  </div>
)}

{/* BORROW POPUP */}
{showBorrowPopup && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={() => setShowBorrowPopup(false)}
  >
    <div
      className="bg-white p-5 rounded-2xl w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold text-blue-700">
        Borrow Request
      </h2>

      <p className="mt-4 text-gray-700">
        Your borrowing request will be sent to the admin.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowBorrowPopup(false)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={submitLoanRequest}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Borrow
        </button>
      </div>
    </div>
  </div>
)}

{/* DETAIL POPUP */}
{showDetailPopup && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={() => setShowDetailPopup(false)}
  >
    <div
      className="bg-white p-5 rounded-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >

      {/* COVER */}
      <div className="w-full h-64 bg-blue-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
        {selectedBook?.cover ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${selectedBook.cover}-L.jpg`}
            alt={selectedBook?.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <p>No Cover</p>
        )}
      </div>

      {/* TITLE */}
      <div className="flex justify-between items-start gap-3">

        <h2 className="text-2xl font-bold text-gray-800">
          {selectedBook?.title}
        </h2>

        <button
          onClick={() =>
            removeFavorite(selectedBook?.workKey)
          }
          className="bg-red-100 p-2 rounded-full"
        >
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </button>

      </div>

      {/* AUTHOR */}
      <p className="text-gray-500 mt-1">
        {selectedBook?.author}
      </p>

      {/* DESC */}
      <p className="mt-5 text-sm text-gray-600 leading-relaxed">
        {bookDescription}
      </p>

    </div>
  </div>
)}


       {/* FOOTER */}
      <footer className="mt-20 bg-gray-900 text-white">
      
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