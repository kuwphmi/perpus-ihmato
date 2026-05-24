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
  FiBell,
  FiShoppingCart,
  FiShoppingBag,
  FiHelpCircle,
  FiBookOpen,
  FiTruck,
  FiShield,
  FiChevronRight,
  FiHome,
  FiPackage,
  FiCompass,
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
  FiSearch,
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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [terbaru, setTerbaru] = useState([]);
  const [terlaris, setTerlaris] = useState([]);
  const [search, setSearch] = useState("");
  // ================= SEARCH FILTER =================
  const normalize = (text) =>
    (text || "").toLowerCase();

  const filterBooks = (books) => {
    if (!search.trim()) return books;

    return books.filter((b) =>
      normalize(b.title).includes(normalize(search)) ||
      normalize(b.author).includes(normalize(search))
    );
  };

  // gabungan semua buku
  const allBooks = [...terbaru, ...terlaris];

  // hasil search
  const filteredBooks = filterBooks(allBooks);
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
  const [notif, setNotif] = useState("");
  const [notifications, setNotifications] =
    useState([]);

  const unreadCount =
    notifications.filter(
      (n) => !n.is_read
    ).length;

  const [isSearchActive, setIsSearchActive] = useState(false);
  const genreSectionRef = useRef(null);

  useEffect(() => {

    const stored =
      localStorage.getItem("user");

    if (stored) {

      setUser(
        JSON.parse(stored)
      );

    }

    fetchNotifications();

  }, []);

  const navigate = useNavigate();

  const fetchNotifications =
    async () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem("user")
          );

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

  const showNotif = (message) => {

    setNotif(message);

    setTimeout(() => {
      setNotif("");
    }, 3000);

  };
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

  const banners = [banner5, banner4, banner6, banner9, banner5];

  /* ================= GENRE MAP ================= */
  const fetchGenreBooks = async (category) => {
    if (activeCategory === category) {

      setActiveCategory(null);
      setGenreBooks([]);

      return;
    }
    try {
      const query = genreMap[category] || category.toLowerCase();

      const res = await fetch(
        `https://openlibrary.org/search.json?subject=${query}&limit=12`
      );

      const data = await res.json();

      const books = data.docs.map((item) => ({
        title: item.title ?? "-",
        author: item.author_name?.[0] ?? "-",
        cover: item.cover_i ?? null,
        price: ((item.cover_i || 1) * 137) % 100000 + 50000,
        stock: ((item.cover_i || 1) % 15) + 5,
      }));

      setGenreBooks(books);
      setActiveCategory(category);

      setTimeout(() => {
        genreSectionRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);

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
          price: ((item.cover_i || 1) * 137) % 100000 + 50000,
          stock: ((item.cover_i || 1) % 15) + 5,
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
          price: ((item.cover_i || 1) * 137) % 100000 + 50000,
          stock: ((item.cover_i || 1) % 15) + 5,
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

        setCart(res.data.data);
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
const handleSearch = async () => {

  if (!search.trim()) return;

  try {

    setIsSearching(true);
    setIsSearchActive(true);

    // SAVE SEARCH HISTORY // 

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    await axios.post(
      "http://localhost:3000/api/search-history",
      {
        user_id: user.id,
        keyword: search,
        source: "belanja",
      }
    );

    // FETCH BOOKS // 

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${search}&limit=12`
    );

    const data = await res.json();

    const books = data.docs.map((item) => ({

      workKey: item.key,

      title: item.title ?? "-",

      author:
        item.author_name?.[0] ?? "-",

      cover:
        item.cover_i ?? null,

      price:
        ((item.cover_i || 1) * 137)
        % 100000 + 50000,

      stock:
        ((item.cover_i || 1) % 15) + 5,

    }));

    setSearchResults(books);

    setActiveCategory(
      `Search Results: ${search}`
    );

    setIsSearchActive(true);

    setTimeout(() => {

      genreSectionRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

    }, 100);

  } catch (err) {

    console.log(err);

  } finally {

    setIsSearching(false);

  }

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
      {notif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999]">

          <div
            className="
        bg-blue-600
        text-white
        px-6
        py-3
        rounded-full
        shadow-2xl
        text-sm
        font-medium
        animate-[fadeIn_0.3s_ease]
      "
          >
            {notif}
          </div>

        </div>
      )}
      {/* ================= NAVBAR ================= */}

      <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">

        <div className="flex gap-6">

          {[
            { name: "Home", path: "/koleksi" },
            { name: "Shop", path: "/belanja" },
            { name: "Orders", path: "/trackingbuku" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="px-3 py-1 rounded-md hover:text-blue-200 transition"
            >
              {item.name}
            </Link>
          ))}

        </div>

      </div>

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white shadow">

        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-2">

          {/* LOGO */}
          <div className="flex items-center gap-2 mr-5">

            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 mr-4"
            />

          </div>

          {/* RIGHT */}
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
      transition-all duration-300
      border-2 border-white
    "
  >
    {user.name ? user.name.charAt(0).toUpperCase() : "U"}

    
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

      </header>

      {/* ================= BANNER ================= */}
      <section className="relative w-full overflow-hidden bg-[#0B5DFF]">
        <div className="relative w-full aspect-[16/9] md:h-[90vh]">
          {banners.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-700 ${currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="relative z-20 mt-2 md:-mt-6 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 flex items-center gap-3">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(); // optional (boleh dihapus kalau mau realtime)
                }
              }}
              type="text"
              placeholder="Search book titles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                if (e.target.value === "") {
                  setSearchResults([]);
                  setActiveCategory(null);
                  setIsSearchActive(false);
                }
              }}
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
        <section
          ref={genreSectionRef}
          className="px-6 md:px-20 pb-14 mt-10"
        >
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
  showNotif={showNotif}
/>
              </div>
            ))}
          </div>


        </section>
      )}

      {isSearchActive ? (

  <section className="px-6 md:px-20 pb-14 mt-10">

    <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
      Search Results: {search}
    </h2>

          <div className="flex gap-5 overflow-x-auto">

            {searchResults.map((book, index) => (

              <div
                key={index}
                className="min-w-[250px]"
              >

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
                  showNotif={showNotif}
                />

              </div>

            ))}

          </div>

        </section>

      ) : !activeCategory && (

        <>

          {/* ================= BUKU TERLARIS ================= */}
          <BukuTerlaris
            data={filterBooks(terlaris)}
            cart={cart}
            setCart={setCart}
            setIsBuyOpen={setIsBuyOpen}
            setSelectedBook={setSelectedBook}
            showNotif={showNotif}
          />

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
          <BukuTerbaru
            data={filterBooks(terbaru)}
            cart={cart}
            setCart={setCart}
            setIsBuyOpen={setIsBuyOpen}
            setSelectedBook={setSelectedBook}
            showNotif={showNotif}
          />

        </>

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
              <Link to="/trackingbuku" className="hover:text-white">
                Orders
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
  showNotif = () => {},
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

  const navigate = useNavigate();
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

  // ================= HANDLE BUY =================
  const handleBuy = () => {

  window.scrollTo({
    top: 0,
    behavior: "instant",
  });

  navigate("/checkout", {
    state: {
      items: [
        {
          title,
          price,
          qty: 1,
          cover,
        },
      ],
    },
  });

  };

  // ================= TAMBAH KERANJANG =================
  const tambahKeKeranjang = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {

        showNotif?.("Please login first");

        return;

      }

      const payload = {

        user_id: user.id,
        book_key:
          workKey || `${title}_${author}`, title,
        author,
        cover,
        price,
        stock,

      };

      const res = await axios.post(
        "http://localhost:3000/api/cart",
        payload
      );

      // REFRESH CART DARI DB
      const cartRes = await axios.get(
        `http://localhost:3000/api/cart/${user.id}`
      );

      setCart(cartRes.data.data || []);

      showNotif?.(res.data.message);

    } catch (err) {

      console.log(err);

      showNotif?.("Failed add cart");

    }

  };

  return (
    <>



      {/* ================= DETAIL POPUP ================= */}
      {showDetail && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-4"
          onClick={() => setShowDetail(false)}
        >

          <div
            className="bg-white w-[88%] max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >

            {/* COVER */}
            <div className="h-52 md:h-64 bg-blue-100">

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

                <div className="max-h-32 overflow-y-auto pr-2">

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description || "Loading description..."}
                  </p>

                </div>
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

            </div>

          </div>

        </div>
      )}

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

      {/* ================= CARD ================= */}
      <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-[250px] flex flex-col">

        <div className="relative h-52 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-semibold text-blue-700 shadow">
            Bestseller
          </div>
          {cover ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
              alt={title}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            "No Cover"
          )}
        </div>

        <div className="p-4 flex flex-col h-[210px]">

          <h3 className="text-sm font-bold text-gray-800 line-clamp-2">
            {title}
          </h3>

          <p className="text-blue-600 text-xs mb-2">
            {author}
          </p>

          <div className="mt-auto">

            <div className="flex justify-between items-center mb-3">

              <p className="text-blue-700 font-bold text-lg">
                Rp {(price || 0).toLocaleString("id-ID")}
              </p>

              <p className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2.5 rounded-xl font-medium transition"
              >
                Show Detail
              </button>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() => tambahKeKeranjang()}

                  className="flex-1 border border-blue-600 text-blue-600 text-xs py-2.5 rounded-xl hover:bg-blue-50 font-medium transition"
                >
                  Cart
                </button>

                <button
                  onClick={handleBuy}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2.5 rounded-xl font-semibold transition"
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
  showNotif,
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
          <div key={book.workKey} className="min-w-[250px] snap-start">
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
              showNotif={showNotif}
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
  showNotif,
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
                showNotif={showNotif}
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