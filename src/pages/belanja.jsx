import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// IMPORT ASSETS
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import logo from "../assets/logo.png";

// ICONS
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
  FiBell, // ✅ TAMBAHAN
} from "react-icons/fi";

export default function Belanja() {
  const [cart, setCart] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookSlide, setBookSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Beranda");
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const banners = [banner1, banner2, banner3];

  const dummyProduct = {
    id: 1,
    name: "E-Book Digital",
    price: 50000,
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // SLIDER BANNER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // SLIDER BUKU
  useEffect(() => {
    const interval = setInterval(() => {
      setBookSlide((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // SCROLL NAVBAR
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const handleClickOutside = () => {
    setIsNotifOpen(false);
  };

  if (isNotifOpen) {
    window.addEventListener("click", handleClickOutside);
  }

  return () => window.removeEventListener("click", handleClickOutside);
}, [isNotifOpen]);

  const categories = [
    { name: "Art", icon: <FiFeather /> },
    { name: "Sience fiction", icon: <FiUser /> },
    { name: "Fantasy", icon: <FiBriefcase /> },
    { name: "Biographies", icon: <FiBook /> },
    { name: "Recipe", icon: <FiHeart /> },
    { name: "Romance", icon: <FiTrendingUp /> },
    { name: "Textbox", icon: <FiGlobe /> },
    { name: "Childern", icon: <FiTool /> },
    { name: "Medicine", icon: <FiSmile /> },
    { name: "Religion", icon: <FiFileText /> },
  ];

  return (
    <div className="font-sans">

      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex justify-between items-center px-6 md:px-10 py-4 ${
          scrolled
            ? "bg-white shadow-md border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <span className={`font-bold ${scrolled ? "text-blue-700" : "text-white"}`}>
            BukuIn
          </span>
        </div>

        {/* MENU */}
        <nav className="hidden md:flex space-x-4 text-sm">
          {["Beranda", "Semua Produk", "Belanja"].map((menu) => (
            <a
              key={menu}
              href="#"
              onClick={() => setActiveMenu(menu)}
              className={`px-3 py-2 rounded-md transition duration-200
                ${
                  scrolled
                    ? "text-gray-700 hover:text-blue-600 hover:bg-white/30 backdrop-blur-sm"
                    : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                }
              `}
            >
              {menu}
            </a>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* 🔔 NOTIF */}
          <div className="relative">

  {/* ICON */}
  <FiBell
    className="text-xl text-gray-600 cursor-pointer hover:text-yellow-500 transition"
    onClick={(e) => {
      e.stopPropagation();
      setIsNotifOpen(!isNotifOpen);
    }}
  />

  {/* DROPDOWN */}
  {isNotifOpen && (
    <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border z-50">

      {/* ARROW */}
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t"></div>

      {/* CONTENT */}
      <div className="py-3 text-center">

        {/* TITLE */}
        <h3 className="font-semibold text-gray-700 pb-2 border-b">
          Pemberitahuanmu
        </h3>

        {/* ISI */}
        <div className="py-6 text-sm text-gray-400 border-b">
          Belum ada notifikasi baru
        </div>

        {/* FOOTER */}
        <button className="pt-2 text-sm text-gray-600 hover:text-blue-600">
          Lihat Semua
        </button>

      </div>
    </div>
  )}
</div>

          {/* 👤 PROFILE */}
          <div className="relative">
  {/* ICON PROFILE */}
  <div
    onClick={(e) => {
      e.stopPropagation();
      setIsProfileOpen(!isProfileOpen);
    }}
    className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
  >
    R
  </div>

  {/* DROPDOWN PROFILE */}
  {isProfileOpen && (
    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col items-center py-6 bg-gray-50">
        <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 mb-2">
          R
        </div>
        <h3 className="font-semibold text-gray-700 text-sm">
          REVANDA AVRILLITA RIZKY
        </h3>
        <p className="text-xs text-gray-500">
          rizkyavrillita@gmail.com
        </p>
      </div>

     {/* BUTTON PROFIL */}
<div className="px-4 py-4">
  <Link to="/profil">
  <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
    Profilku
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
    className={`text-xl cursor-pointer transition relative ${
      scrolled
        ? "text-gray-700 hover:text-blue-600"
        : "text-white hover:text-blue-200"
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

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 h-full w-[260px] bg-white shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-bold text-blue-700">Menu</span>
            <button onClick={() => setIsOpen(false)}>
              <FiX size={22} />
            </button>
          </div>

          <div className="flex flex-col p-4 space-y-3">
            {["Beranda", "Semua Produk", "Belanja"].map((menu) => (
              <a
                key={menu}
                href="#"
                onClick={() => {
                  setActiveMenu(menu);
                  setIsOpen(false);
                }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {menu}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BANNER ================= */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {banners.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </section>

      {/* ================= SEARCH ================= */}
      <section className="relative z-20 -mt-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-4 flex items-center">
            <input
              type="text"
              placeholder="Cari judul buku..."
              className="flex-1 px-5 py-3 text-sm focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              Cari
            </button>
          </div>
        </div>
      </section>

      {/* ================= KATEGORI ================= */}
      <section className="bg-blue-50 py-12 px-6 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {categories.map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow">
              <div className="text-3xl mb-3 text-blue-600 flex justify-center">
                {item.icon}
              </div>
              <p className="text-sm">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

       {/* ================= BUKU TERLARIS ================= */}
      <section className="bg-white py-14 px-6 md:px-20 overflow-hidden">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10 w-full">
          Buku Terlaris
        </h2>

        <div className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="min-w-[250px] snap-start">
              <BookCard item={item} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= LANDSCAPE ================= */}
      <section className="px-6 md:px-20 pb-14">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-xl shadow-2xl">
          <img src={banner1} className="w-full h-80 md:h-[28rem] object-cover" />
        </div>
      </section>

      <BukuTerbaru />
    </div>
  );
}

/* ================= BOOK CARD ================= */
function BookCard({ item }) {
  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="h-48 bg-blue-100 flex items-center justify-center">
        Cover Buku {item}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold">Judul Buku {item}</h3>
        <p className="text-blue-600 font-bold">Rp 50.000</p>
      </div>
    </div>
  );
}

/* ================= BUKU TERBARU ================= */
function BukuTerbaru() {
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
          Buku Terbaru
        </h2>

        {/* ✅ YANG KAMU BILANG KEHAPUS → SUDAH BALIK */}
        <div className="flex justify-end gap-2 mb-3">
          <button onClick={() => scroll("left")} className="px-3 py-1 bg-gray-200 rounded">←</button>
          <button onClick={() => scroll("right")} className="px-3 py-1 bg-gray-200 rounded">→</button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="min-w-[250px] snap-start">
              <BookCard item={item} />
            </div>
          ))}
        </div>
      </section>

      {/* ✅ FOOTER BALIK */}
      <footer className="mt-16 bg-gray-900 text-white text-center py-6">
        <p className="text-sm">© 2026 BukuIn. All rights reserved.</p>
      </footer>
    </>
  );
}