import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
  FiBell,
} from "react-icons/fi";

export default function Belanja() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [genreBooks, setGenreBooks] = useState([]);
  const [terbaru, setTerbaru] = useState([]);
  const [terlaris, setTerlaris] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Beranda");
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const genreMap = {
  Art: "art",
  "Science Fiction": "science fiction",
  Fantasy: "fantasy",
  Biographies: "biography",
  Recipe: "cooking",
  Romance: "romance",
  Textbook: "textbook",
  Children: "children",
  Medicine: "medicine",
  Religion: "religion",
};

  const banners = [banner1, banner2, banner3];

   /* ================= GENRE MAP ================= */
  const fetchGenreBooks = async (category) => {
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
  const cariBuku = () => {
    fetch(`https://openlibrary.org/search.json?q=${search}&limit=8`)
      .then((res) => res.json())
      .then((data) => {
        const books = data.docs.map((item) => ({
          title: item.title ?? "-",
          author: item.author_name?.[0] ?? "-",
          cover: item.cover_i ?? null,
          price: Math.floor(Math.random() * 100000) + 50000,
          stock: Math.floor(Math.random() * 20) + 1,
        }));

        setTerbaru(books);
      });
  };

  const categories = [
    { name: "Art", icon: <FiFeather /> },
    { name: "Science Fiction", icon: <FiUser /> },
    { name: "Fantasy", icon: <FiBriefcase /> },
    { name: "Biographies", icon: <FiBook /> },
    { name: "Recipe", icon: <FiHeart /> },
    { name: "Romance", icon: <FiTrendingUp /> },
    { name: "Textbook", icon: <FiGlobe /> },
    { name: "Children", icon: <FiTool /> },
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

          <span
            className={`font-bold ${
              scrolled ? "text-blue-700" : "text-white"
            }`}
          >
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
              className={`px-3 py-2 rounded-md transition duration-200 ${
                scrolled
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
              className="text-xl text-gray-600 cursor-pointer hover:text-yellow-500 transition"
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
                    Pemberitahuanmu
                  </h3>

                  <div className="py-6 text-sm text-gray-400 border-b">
                    Belum ada notifikasi baru
                  </div>

                  <button className="pt-2 text-sm text-gray-600 hover:text-blue-600">
                    Lihat Semua
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
              R
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                <div className="flex flex-col items-center py-6 bg-gray-50">
                  <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2">
                    R
                  </div>

                  <h3 className="font-semibold text-gray-700 text-sm">
                    REVANDA AVRILLITA RIZKY
                  </h3>

                  <p className="text-xs text-gray-500">
                    rizkyavrillita@gmail.com
                  </p>
                </div>

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
              className={`text-xl relative ${
                scrolled
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-5 py-3 text-sm focus:outline-none"
            />

            <button
              onClick={cariBuku}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Cari
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
              className={`bg-white p-5 rounded-xl shadow cursor-pointer hover:scale-105 transition ${
                activeCategory === item.name ? "ring-2 ring-blue-600" : ""
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
            title={book.title}
            author={book.author}
            cover={book.cover}
            price={book.price}
            stock={book.stock}
            cart={cart}
            setCart={setCart}
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
  <BukuTerlaris data={terlaris} cart={cart} setCart={setCart} />
)}

      {/* ================= LANDSCAPE ================= */}
      <section className="px-6 md:px-20 pb-14">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-xl shadow-2xl">
          <img
            src={banner1}
            className="w-full h-80 md:h-[28rem] object-cover"
          />
        </div>
      </section>

      {/* ================= BUKU TERBARU ================= */}
    {!activeCategory && (
  <BukuTerbaru data={terbaru} cart={cart} setCart={setCart} />
)}

      {/* FOOTER */}
      <footer className="mt-16 bg-gray-900 text-white text-center py-6">
        <p className="text-sm">© 2026 BukuIn. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* ================= BOOK CARD ================= */
function BookCard({
  title,
  author,
  cover,
  price,
  stock,
  cart,
  setCart,
}) {

  const tambahKeKeranjang = async () => {

    console.log("TOMBOL DIKLIK");

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      console.log("USER:", user);

      if (!user) {
        alert("Silakan login dulu");
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

        alert("Buku masuk keranjang");

      } else {

        alert(res.data.message);

      }

    } catch (err) {

      console.log("ERROR:", err);

      alert("Terjadi error");

    }
  };

  return (
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

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => tambahKeKeranjang()}
              className="flex-1 border border-blue-600 text-blue-600 text-xs py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Keranjang
            </button>

            <button className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition">
              Beli
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= BUKU TERLARIS ================= */
function BukuTerlaris({ data, cart, setCart }) {
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
        Buku Terlaris
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
              title={book.title}
              author={book.author}
              cover={book.cover}
              price={book.price}
              stock={book.stock}
              cart={cart}
              setCart={setCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= BUKU TERBARU ================= */
function BukuTerbaru({ data, cart, setCart }) {
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
        Buku Terbaru
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
              title={book.title}
              author={book.author}
              cover={book.cover}
              price={book.price}
              stock={book.stock}
              cart={cart}
              setCart={setCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
}