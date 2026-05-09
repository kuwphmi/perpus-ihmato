import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// IMPORT ASSETS
import banner5 from "../assets/banner5.webp";
import banner4 from "../assets/banner4.webp";
import banner6 from "../assets/banner6.webp";
import banner8 from "../assets/banner8.webp";
import banner9 from "../assets/banner9.webp";
import logo from "../assets/logo.png";
import Floating from "./floating";

import {
  FiBook,
  FiUser,
  FiBriefcase,
  FiFeather,
  FiHeart,
  FiTrendingUp,
  FiGlobe,
  FiTool,
  FiSmile,
  FiFileText,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiHome,
  FiShoppingCart,
  FiClock,
} from "react-icons/fi";

import { MdOutlinePalette } from "react-icons/md";
import { GiSpellBook } from "react-icons/gi";
import { LuChefHat } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";


export default function Belanja() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [genreBooks, setGenreBooks] = useState([]);
  const [terbaru, setTerbaru] = useState([]);
  const [terlaris, setTerlaris] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  
  const [user, setUser] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Beranda");
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {

    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

  }, []);

 

  const banners = [banner5, banner4, banner6, banner9,banner5];

  /* ================= GENRE MAP ================= */
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
  price: Math.floor(Math.random() * 100000) + 50000,
  stock: Math.floor(Math.random() * 20) + 1,
}));

      setGenreBooks(books);
      setActiveCategory(category);

    } catch (err) {
      console.log("error genre:", err);
    }
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    // BUKU TERBARU
    fetch("https://openlibrary.org/search.json?q=new&limit=8")
      .then((res) => res.json())
      .then((data) => {
        const books = data.docs.map((item) => ({
            workKey: item.key,
          title: item.title ?? "-",
          author: item.author_name?.[0] ?? "-",
          cover: item.cover_i ?? null,
          price: Math.floor(Math.random() * 100000) + 50000,
          stock: Math.floor(Math.random() * 20) + 1,
        }));

        setTerbaru(books);
      });

    // BUKU TERLARIS
    fetch("https://openlibrary.org/search.json?q=bestseller&limit=8")
      .then((res) => res.json())
      .then((data) => {
        const books = data.docs.map((item) => ({
            workKey: item.key,
          title: item.title ?? "-",
          author: item.author_name?.[0] ?? "-",
          cover: item.cover_i ?? null,
          price: Math.floor(Math.random() * 100000) + 50000,
          stock: Math.floor(Math.random() * 20) + 1,
        }));

        setTerlaris(books);
      });
  }, []);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        const res = await axios.get(
          `http://localhost:3000/api/cart/${user.id}`
        );

        setCart(res.data);
      } catch (err) {
        console.log("Gagal fetch cart", err);
      }
    };

    fetchCart();
  }, []);

  /* ================= SLIDER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ================= SCROLL NAVBAR ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {
    const handleClickOutside = () => {
      setIsNotifOpen(false);
    };

    if (isNotifOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [isNotifOpen]);

  /* ================= SEARCH ================= */
  const handleSearch = () => {

    if (!search.trim()) return;

    navigate(`/search?source=belanja&q=${search}`);

  };

  const categories = [
      {
        name: "Art",
        icon: <MdOutlinePalette />,
      },
    
      {
        name: "Science Fiction",
        icon: <FiGlobe />,
      },
    
      {
        name: "Fantasy",
        icon: <GiSpellBook />,
      },
    
      {
        name: "Biographies",
        icon: <FiUser />,
      },
    
      {
        name: "Recipe",
        icon: <LuChefHat />,
      },
    
      {
        name: "Romance",
        icon: <FaRegHeart />,
      },
    
      {
        name: "Textbox",
        icon: <FiBook />,
      },
    
      {
        name: "Children",
        icon: <FiSmile />,
      },
    
     {
      name: "Medicine",
      icon: <FaUserDoctor />,
    },
    
      {
        name: "Religion",
        icon: <FiFileText />,
      },
  ];

  return (
    <div className="font-sans">
      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex justify-between items-center px-6 md:px-10 py-4 ${scrolled
          ? "bg-white shadow-md border-b border-gray-100"
          : "bg-transparent"
          }`}
      >
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-12 h-12" />

          <span
            className={`font-bold ${scrolled ? "text-blue-700" : "text-white"
              }`}
          >
          </span>
        </div>

        {/* MENU */}
        <nav className="hidden md:flex space-x-4 text-sm">
          {["Beranda", "Semua Produk", "Belanja"].map((menu) => (
            <a
              key={menu}
              href="#"
              onClick={() => setActiveMenu(menu)}
              className={`px-3 py-2 rounded-md transition duration-200 ${scrolled
                ? "text-gray-700 hover:text-blue-600 hover:bg-white/30"
                : "text-white hover:bg-white/10"
                }`}
            >
              {menu}
            </a>
          ))}
        </nav>

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

 {/* PROFILE */}
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

      <div className="flex flex-col items-center py-6 bg-gray-50">

        <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>

        <h3 className="font-semibold text-gray-700 text-sm">
          {user.name || "-"}
        </h3>

        <p className="text-xs text-gray-500">
          {user.email || "-"}
        </p>

      </div>

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

          {/* CART */}
          <div className="relative">
            <Link
              to="/keranjang"
              className={`text-xl relative ${scrolled
                ? "text-gray-700 hover:text-blue-600"
                : "text-white"
                }`}
            >
              🛒

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* HAMBURGER */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FiX className={scrolled ? "text-black" : "text-white"} />
            ) : (
              <FiMenu className={scrolled ? "text-black" : "text-white"} />
            )}
          </button>
        </div>
      </header>

     {/* ================= BANNER ================= */}
<section className="relative w-full overflow-hidden bg-[#0B5DFF]">
  <div className="relative w-full aspect-[16/9] md:h-[90vh]">
    {banners.map((img, index) => (
      <img
        key={index}
        src={img}
        alt=""
        className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-700 ${
          currentSlide === index ? "opacity-100" : "opacity-0"
        }`}
      />
    ))}
  </div>
</section>

      {/* ================= SEARCH ================= */}
<section className="relative z-20 -mt-10 md:-mt-20 px-4 md:px-20">
  <div className="max-w-6xl mx-auto">
    <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 flex items-center gap-3">
      <input
        type="text"
        placeholder="Search book titles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 md:px-5 py-3 text-sm rounded-lg focus:outline-none"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 md:px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap"
      >
        Search
      </button>
    </div>
  </div>
</section>

      {/* ================= KATEGORI ================= */}
      <section className="bg-blue-50 py-12 px-6 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {categories.map((item, i) => (
            <div
              key={i}
              onClick={() => fetchGenreBooks(item.name)}
              className={`bg-white p-5 rounded-xl shadow cursor-pointer hover:scale-105 transition ${activeCategory === item.name ? "ring-2 ring-blue-600" : ""
                }`}
            >
              <div className="text-3xl mb-3 text-blue-600 flex justify-center">
                {item.icon}
              </div>

              <p className="text-sm">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= GENRE RESULT ================= */}
      {activeCategory && (
        <section className="px-6 md:px-20 pb-14 mt-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
            Genre: {activeCategory}
          </h2>

          <div className="flex gap-5 overflow-x-auto">
            {genreBooks.map((book, index) => (
              <div key={index} className="min-w-[250px]">
                <BookCard
                  workKey={book.workKey}
                  title={book.title}
                  author={book.author}
                  cover={book.cover}
                  price={book.price}
                  stock={book.stock}
                  cart={cart}
                  setCart={setCart}
                  setIsBuyOpen={setIsBuyOpen}
                  setSelectedBook={setSelectedBook}
                />
              </div>
            ))}
          </div>

          {/* RESET BUTTON */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setActiveCategory(null);
                setGenreBooks([]);
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Reset Genre
            </button>
          </div>
        </section>
      )}

      {/* ================= BUKU TERLARIS ================= */}
      {!activeCategory && (
        <BukuTerlaris
          data={terlaris}
          cart={cart}
          setCart={setCart}
          setIsBuyOpen={setIsBuyOpen}
          setSelectedBook={setSelectedBook}
        />
      )}

      {/* ================= LANDSCAPE ================= */}
<section className="px-4 md:px-20 pb-14">
  <div className="max-w-6xl mx-auto relative overflow-hidden rounded-xl shadow-2xl bg-black">
    <img
      src={banner5}
      className="w-full h-auto object-contain"
      alt="Banner"
    />
  </div>
</section>

      {/* ================= BUKU TERBARU ================= */}
      {!activeCategory && (
        <BukuTerbaru
          data={terbaru}
          cart={cart}
          setCart={setCart}
          setIsBuyOpen={setIsBuyOpen}
          setSelectedBook={setSelectedBook}
        />
      )}

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
    </div>
  );
}

/* ================= BOOK CARD ================= */

function BookCard({
  title,
  author,
  cover,
  workKey,
  price,
  stock,
  cart,
  setCart,
  setIsBuyOpen,
  setSelectedBook,
}) {

  const [showDetail, setShowDetail] = useState(false);
  const [description, setDescription] = useState("");
  const fetchDescription = async () => {
  try {

    if (!workKey) {
      setDescription("Description not available.");
      return;
    }

    const res = await fetch(
      `https://openlibrary.org${workKey}.json`
    );

    const data = await res.json();

    if (typeof data.description === "string") {
      setDescription(data.description);
    } else if (data.description?.value) {
      setDescription(data.description.value);
    } else {
      setDescription("Description not available.");
    }

  } catch (err) {
    console.log(err);
    setDescription("Failed to load description.");
  }
};

  // ================= NOTIF =================
  const [notif, setNotif] = useState("");

  const showNotif = (message) => {
    setNotif(message);

    setTimeout(() => {
      setNotif("");
    }, 2000);
  };

  // ================= HANDLE BUY =================
  const handleBuy = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        showNotif("Login dulu ya");
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/api/payment/create",
        {
          user_id: user.id,
          items: [
            {
              book_key: title,
              title,
              price,
              qty: 1,
            },
          ],
        }
      );

      const token = res.data.token;

      // 🔥 MIDTRANS POPUP
      window.snap.pay(token, {
        onSuccess: function () {
          showNotif("Pembayaran berhasil 🎉");
        },

        onPending: function () {
          showNotif("Menunggu pembayaran ⏳");
        },

        onError: function () {
          showNotif("Pembayaran gagal ❌");
        },

        onClose: function () {
          console.log("User tutup popup");
        },
      });

    } catch (err) {
      console.log(err);
      showNotif("Gagal connect ke payment");
    }
  };

  // ================= TAMBAH KERANJANG =================
  const tambahKeKeranjang = async () => {

    console.log("TOMBOL DIKLIK");

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      console.log("USER:", user);

      if (!user) {
        showNotif("Silakan login dulu");
        return;
      }

      const payload = {
        user_id: user.id,
        title,
        author,
        cover,
        price,
        stock,
      };

      console.log("PAYLOAD:", payload);

      const res = await axios.post(
        "http://localhost:3000/api/cart",
        payload
      );

      console.log("RESPONSE:", res.data);

      if (res.data.status) {

        setCart((prev) => {
          if (!Array.isArray(prev)) prev = [];
          return [...prev, res.data.data];
        });

        showNotif("Buku masuk keranjang");

      } else {

        showNotif(res.data.message);

      }

    } catch (err) {

      console.log("ERROR:", err);

      showNotif("Terjadi error");

    }
  };

  return (
    <>
      {/* ================= NOTIF ================= */}
      {notif && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="bg-black/80 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium animate-bounce">
            {notif}
          </div>
        </div>
      )}


      {/* ================= DETAIL POPUP ================= */}
{showDetail && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4 overflow-y-auto">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

      {/* COVER */}
      <div className="h-72 bg-blue-100">

        {cover ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            No Cover
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* TITLE */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h2>

        {/* AUTHOR */}
        <p className="text-blue-600 text-sm mb-4">
          by {author}
        </p>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">
            Description
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
  {description || "Loading description..."}
</p>
        </div>

        {/* PRICE & STOCK */}
        <div className="flex justify-between items-center mb-5">

          <div>
            <p className="text-xs text-gray-500">
              Price
            </p>

            <p className="font-bold text-blue-700">
              Rp {(price || 0).toLocaleString("id-ID")}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">
              Stock
            </p>

            <p className="font-semibold text-gray-700">
              {stock}
            </p>
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={() => setShowDetail(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}

      {/* ================= CARD ================= */}
      <div className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden w-[250px] flex flex-col">

        <div className="h-48 bg-blue-100 flex items-center justify-center">
          {cover ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            "No Cover"
          )}
        </div>

        <div className="p-4 flex flex-col h-full">

          <h3 className="text-sm font-bold text-gray-800 line-clamp-2">
            {title}
          </h3>

          <p className="text-blue-600 text-xs mb-2">
            {author}
          </p>

          <div className="mt-auto">

            <div className="flex justify-between items-center mb-3">

              <p className="text-blue-700 font-bold text-sm">
                Rp {(price || 0).toLocaleString("id-ID")}
              </p>

              <p className="text-xs text-gray-500">
                Stok: {stock}
              </p>

            </div>

           <div className="flex flex-col gap-2">

          {/* SHOW DETAIL */}
         <button
            onClick={async () => {
  setShowDetail(true);
  await fetchDescription();
}}
            className="w-full bg-gray-100 text-gray-700 text-xs py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Show Detail
          </button>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => tambahKeKeranjang()}
              className="flex-1 border border-blue-600 text-blue-600 text-xs py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Cart
            </button>

            <button
              onClick={handleBuy}
              className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Buy
            </button>

          </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

/* ================= BUKU TERLARIS ================= */
function BukuTerlaris({
  data,
  cart,
  setCart,
  setIsBuyOpen,
  setSelectedBook,
}) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-6 md:px-20 pb-14">
      <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
        Best Selling Books
      </h2>

      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={() => scroll("left")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          ←
        </button>

        <button
          onClick={() => scroll("right")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          →
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {data.map((book, index) => (
          <div key={index} className="min-w-[250px] snap-start">
            <BookCard
            workKey={book.workKey}
              title={book.title}
              author={book.author}
              cover={book.cover}
              price={book.price}
              stock={book.stock}
              cart={cart}
              setCart={setCart}
              setIsBuyOpen={setIsBuyOpen}
              setSelectedBook={setSelectedBook}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= BUKU TERBARU ================= */
function BukuTerbaru({
  data,
  cart,
  setCart,
  setIsBuyOpen,
  setSelectedBook,
}) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
  <>
    <section className="px-6 md:px-20 pb-14">
      <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
        Newest Books
      </h2>

      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={() => scroll("left")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          ←
        </button>

        <button
          onClick={() => scroll("right")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          →
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {data.map((book, index) => (
          <div key={index} className="min-w-[250px] snap-start">
            <BookCard
            workKey={book.workKey}
              title={book.title}
              author={book.author}
              cover={book.cover}
              price={book.price}
              stock={book.stock}
              cart={cart}
              setCart={setCart}
              setIsBuyOpen={setIsBuyOpen}
              setSelectedBook={setSelectedBook}
            />
          </div>
        ))}
      </div>
    </section>

    {/* MASCOT */}
    <Floating />
  </>
);
}