import { useState, useEffect } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiBell,
  FiHeart,
  FiHome,
  FiBook,
  FiUser,
  FiShoppingCart,
  FiClock,
  FiGlobe,
  FiTool,
  FiSmile,
  FiFileText,
} from "react-icons/fi";

import { MdOutlinePalette } from "react-icons/md";
import { GiSpellBook } from "react-icons/gi";
import { LuChefHat } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import Floating from "./floating";

import logo from "../assets/logo.png";

export default function HalamanUtama() {
  const [user, setUser] = useState({});
  const [search, setSearch] = useState("");  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [genreBooks, setGenreBooks] = useState([]);
  const [rekomendasi, setRekomendasi] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [showBorrowPopup, setShowBorrowPopup] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  const [bookDescription, setBookDescription] = useState("");
  const genreMap = {
  Art: "art",
  "Science Fiction": "science fiction",
  Fantasy: "fantasy",
  Biographies: "biography",
  Recipe: "cooking",
  Romance: "romance",
  Textbox: "textbook",
  Children: "children",
  Medicine: "medicine",
  Religion: "religion",
};

const navigate = useNavigate();
const fetchDescription = async (workKey) => {
    try {
      const res = await fetch(`https://openlibrary.org${workKey}.json`);
      const data = await res.json();

      if (typeof data.description === "string") {
        setBookDescription(data.description);
      } else if (data.description?.value) {
        setBookDescription(data.description.value);
      } else {
        setBookDescription("No description available.");
      }
    } catch (err) {
      console.log(err);
      setBookDescription("Failed to load description.");
    }
  };

const fetchGenreBooks = async (category) => {
  try {
    const query = genreMap[category] || category.toLowerCase();

    const res = await fetch(
      `https://openlibrary.org/search.json?subject=${query}&limit=12`
    );

    const data = await res.json();

    const books = data.docs.map((item) => ({
      workKey: item.key,
      title: item.title ?? "-",
      author: item.author_name?.[0] ?? "-",
      cover: item.cover_i ?? null,
    }));

    setGenreBooks(books);
    setActiveCategory(category);

  } catch (err) {
    console.log("error genre:", err);
  }
};

const [currentSlide, setCurrentSlide] = useState(0);

const slides = [
  {
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    title: "Find Your Favorite Books",
subtitle: "Thousands of digital book collections are waiting for you.",
  },
  {
    img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    title: "Read Anywhere",
subtitle: "Enjoy a modern and comfortable reading experience.",
  },
  {
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    title: "Shop & Borrow Books",
subtitle: "All your reading needs in one platform.",
  },
];

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  }, 4000);

  return () => clearInterval(interval);
}, []);

const handleSearch = async (e) => {
  if (e.key === "Enter") {

    if (!search.trim()) return;

    try {

      const res = await fetch(
        `https://openlibrary.org/search.json?q=${search}&limit=12`
      );

      const data = await res.json();

      const books = data.docs.map((item) => ({
        workKey: item.key,
        title: item.title ?? "-",
        author: item.author_name?.[0] ?? "-",
        cover: item.cover_i ?? null,
      }));

      setGenreBooks(books);

      // supaya judul berubah
      setActiveCategory(`Hasil pencarian: ${search}`);

    } catch (err) {
      console.log(err);
    }
  }
};
useEffect(() => {
  const fetchRekomendasi = async () => {
    try {
      const res = await fetch(
        "https://openlibrary.org/search.json?q=popular&limit=12"
      );

      const data = await res.json();

      const books = data.docs.map((item) => ({
        workKey: item.key,
        title: item.title ?? "-",
        author: item.author_name?.[0] ?? "-",
        cover: item.cover_i ?? null,
      }));

      setRekomendasi(books);

    } catch (err) {
      console.log(err);
    }
  };

  fetchRekomendasi();
}, []);


 const categories = [
    { name: "Art", icon: <MdOutlinePalette /> },
    { name: "Science Fiction", icon: <FiGlobe /> },
    { name: "Fantasy", icon: <GiSpellBook /> },
    { name: "Biographies", icon: <FiUser /> },
    { name: "Recipe", icon: <LuChefHat /> },
    { name: "Romance", icon: <FaRegHeart /> },
    { name: "Textbox", icon: <FiBook /> },
    { name: "Children", icon: <FiSmile /> },
    { name: "Medicine", icon: <FaUserDoctor /> },
    { name: "Religion", icon: <FiFileText /> },
  ];

 useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handlePinjam = async (book) => {
    setSelectedBook(book);
    setShowBorrowPopup(true);
    await fetchDescription(book.workKey);
  };

const handleDetail = async (book) => {
    setSelectedBook(book);
    setShowDetailPopup(true);
    await fetchDescription(book.workKey);
  };

  const submitLoanRequest = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch("http://localhost:3000/api/loan-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          book_key: selectedBook.cover + "_" + selectedBook.title,
          title: selectedBook.title,
          author: selectedBook.author,
          cover: selectedBook.cover,
        }),
      });

      const data = await res.json();

      if (!data.status) return alert(data.message);

      alert("Pengajuan berhasil dikirim");

      setShowBorrowPopup(false);
      setSelectedBook(null);
    } catch (err) {
      console.log(err);
      alert("Gagal mengajukan peminjaman");
    }
  };

 return (
    <div className="bg-white min-h-screen">


      {/* BORROW POPUP */}
      {showBorrowPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded-xl w-full max-w-md">

      <h2 className="text-xl font-bold text-blue-700">
        Borrow Request
      </h2>

      <p className="mt-4 text-gray-700">
        Your borrowing request will be sent to the admin for approval.
        Please wait for a notification regarding the status of your request.
      </p>

      <div className="mt-4 text-sm text-gray-500 space-y-2">

        <p><b>📌 Process:</b> The admin will review your request.</p>

        <p><b>⏳ After approval:</b> You will receive a notification.</p>

        <p><b>📚 Book Pickup Requirements:</b></p>
        <ul className="list-disc ml-5">
          <li>Bring your library membership card</li>
          <li>Show your borrowing confirmation</li>
          <li>Collect the book within 1×24 hours after approval</li>
        </ul>

        <p><b>⚠️ Penalties:</b></p>
        <ul className="list-disc ml-5">
          <li>Late return: daily fine will be applied</li>
          <li>Damaged or lost book: replacement fee required</li>
        </ul>

      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowBorrowPopup(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={submitLoanRequest}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit Request
        </button>
      </div>

    </div>
  </div>
)}

      {/* DETAIL POPUP */}
      {showDetailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold text-blue-700">Book Detail</h2>

            <p className="font-semibold mt-2">{selectedBook?.title}</p>
            <p className="text-gray-500">{selectedBook?.author}</p>

            <p className="mt-4 text-sm text-gray-600">
              {bookDescription}
            </p>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowDetailPopup(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* NAVBAR ATAS (TETAP) */}
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
              className="px-3 py-1 hover:text-blue-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center px-6 py-2">

          <img src={logo} className="w-12 h-12 mr-4" />

          {/* SEARCH */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-lg">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Find your favorite books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-full"
              />
            </div>
          </div>

          {/* ICON */}
          <div className="flex items-center gap-3 ml-4 relative z-50">

            <Link to="/favorite">
  <FiHeart className="text-2xl text-gray-600 cursor-pointer transition duration-300 hover:text-yellow-400" />
</Link>

            {/* NOTIF */}
            <div className="relative">
             <FiBell
  className="text-2xl cursor-pointer transition duration-300 hover:text-yellow-400"
  onClick={(e) => {
    e.stopPropagation();
    setIsNotifOpen(!isNotifOpen);
  }}
/>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border z-50">
                  <div className="py-3 text-center">
                    <h3 className="font-semibold border-b pb-2">
                       Your Notifications
                    </h3>
                    <div className="py-6 text-gray-400">
                       No notifications yet
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

      {/* OVERLAY */}
      {/* ✅ OVERLAY FIX (tidak ganggu klik popup/navbar) */}
{isNotifOpen && (
  <div
    className="fixed inset-0 z-30"
    onClick={() => setIsNotifOpen(false)}
  />
)}

{/* BANNER */}
<section className="relative w-full overflow-hidden">

  <div className="relative w-full aspect-[16/13] md:aspect-[16/7]">

    <div
      className="flex h-full transition-transform duration-700"
      style={{
        transform: `translateX(-${currentSlide * 100}%)`,
      }}
    >

      {slides.map((slide, i) => (
        <div
          key={i}
          className="min-w-full h-full relative"
        >

          <img
            src={slide.img}
            className="w-full h-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">

            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {slide.title}
            </h1>

            <p className="text-white/90 text-sm md:text-lg max-w-2xl">
              {slide.subtitle}
            </p>

          </div>

        </div>
      ))}

    </div>

  </div>

</section>

      {/* ================= KATEGORI ================= */}
      <section className="bg-blue-50 py-12 px-6 md:px-20">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-8">
          Book Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((item, i) => (
            <div
              key={i}
              onClick={() => fetchGenreBooks(item.name)}
              className={`bg-white p-5 rounded-xl shadow hover:shadow-md transition text-center cursor-pointer ${
                activeCategory === item.name
                  ? "ring-2 ring-blue-600"
                  : ""
              }`}
            >
              <div className="text-3xl text-blue-600 mb-2 flex justify-center">
                {item.icon}
              </div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIST BUKU ================= */}
  <section className="px-6 md:px-20 py-12">

 <div className="relative flex items-center justify-center mb-6">

    <h2 className="text-2xl font-bold text-blue-700 text-center">
  {activeCategory
    ? `Genre: ${activeCategory}`
    : "Recommended Books"}
</h2>

    {activeCategory && (
  <button
    onClick={() => {
      setActiveCategory(null);
      setGenreBooks([]);
    }}
    className="absolute right-0 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
  >
    Reset
  </button>
)}

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

    {(activeCategory ? genreBooks : rekomendasi).map((book, i) => (
      <div
        key={i}
        className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
      >

        <div className="h-56 bg-blue-100 flex items-center justify-center">
          {book.cover ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            "No Cover"
          )}
        </div>

        <div className="p-4">

  {/* TITLE */}
  <h3 className="text-sm font-semibold line-clamp-2">
    {book.title}
  </h3>

  {/* AUTHOR */}
  <p className="text-gray-500 text-xs">
    {book.author}
  </p>

  {/* DESKRIPSI SINGKAT */}
  <p className="text-gray-400 text-xs mt-1 mb-3 line-clamp-2">
    {bookDescription
    ? bookDescription.slice(0, 80) + "..."
    : "No description available"}
  </p>

  {/* BUTTONS */}
  <div className="flex gap-2">

    {/* 🔵 TETAP (JANGAN DIUBAH) */}
    <button
      onClick={() => handlePinjam(book)}
      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
    >
      Borrow
    </button>

    {/* 🟡 BARU: SHOW DETAIL */}
    <button
      onClick={() => handleDetail(book)}
      className="flex-1 bg-gray-200 py-2 rounded-lg text-sm hover:bg-gray-300"
    >
      Detail
    </button>

  </div>

</div>

      </div>
    ))}

  </div>

</section>



      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-xl shadow-lg z-50">
        <Link to="/koleksi"><FiHome size={24} /></Link>
        <Link to="/riwayat"><FiClock size={24} /></Link>
        <Link to="/belanja"><FiShoppingCart size={24} /></Link>
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