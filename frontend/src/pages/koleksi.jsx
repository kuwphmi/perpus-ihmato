import { useState, useEffect, useRef } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import { FiSearch, FiBell, FiHeart, FiHome, FiBook, FiUser, FiShoppingCart, FiClock, FiGlobe, FiTool, FiSmile, FiFileText } from "react-icons/fi";

import { MdOutlinePalette } from "react-icons/md";
import { GiSpellBook } from "react-icons/gi";
import { LuChefHat } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/logo.png";

export default function HalamanUtama() {
  const [user, setUser] = useState({});
  const [search, setSearch] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [genreBooks, setGenreBooks] = useState([]);
  const [rekomendasi, setRekomendasi] = useState([]);
  const [localBooks, setLocalBooks] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [showBorrowPopup, setShowBorrowPopup] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const bookSectionRef = useRef(null);

  const [bookDescription, setBookDescription] = useState("");
  const [notif, setNotif] = useState("");
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  const showNotif = (message) => {
    setNotif(message);

    setTimeout(() => {
      setNotif("");
    }, 2000);
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

  const navigate = useNavigate();
  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(`http://localhost:3000/api/notifications/${user.id}`);

      const data = await res.json();

      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchGenreBooks = async (category) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setGenreBooks([]);

      return;
    }
    try {
      const query = genreMap[category] || category.toLowerCase();

      const res = await fetch(`https://openlibrary.org/search.json?subject=${query}&limit=12`);

      const data = await res.json();

      const books = data.docs.map((item) => ({
        workKey: item.key,
        title: item.title ?? "-",
        author: item.author_name?.[0] ?? "-",
        cover: item.cover_i ?? null,

        firstSentence: item.first_sentence?.[0] || item.first_sentence || "",

        subjects: item.subject?.slice(0, 5) || [],
      }));

      setGenreBooks(books);
      if (books.length === 0) {
        setActiveCategory(`No books found for "${search}"`);
      } else {
        setActiveCategory(`Search Results: ${search}`);
      }
      setActiveCategory(category);

      setTimeout(() => {
        bookSectionRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
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
      title: "Borrow Books Instantly",
      subtitle: "Request your favorite books online with a fast and simple process.",
    },
    {
      img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
      title: "Shop & Borrow Books",
      subtitle: "All your reading needs in one platform.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      if (!search.trim()) return;

      try {
        // SAVE SEARCH HISTORY //

        const user = JSON.parse(localStorage.getItem("user"));

        await axios.post("http://localhost:3000/api/search-history", {
          user_id: user.id,
          keyword: search,
          source: "koleksi",
        });

        // FETCH BOOKS //

        const res = await fetch(`https://openlibrary.org/search.json?q=${search}&limit=12`);

        const data = await res.json();

        const books = data.docs.map((item) => ({
          workKey: item.key,

          title: item.title ?? "-",

          author: item.author_name?.[0] ?? "-",

          cover: item.cover_i ?? null,

          firstSentence: item.first_sentence?.[0] || item.first_sentence || "",

          subjects: item.subject?.slice(0, 5) || [],
        }));

        setGenreBooks(books);

        setActiveCategory(`Search Results: ${search}`);

        setTimeout(() => {
          bookSectionRef.current?.scrollIntoView({
            behavior: "smooth",
          });
        }, 100);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const fetchRekomendasi = async () => {
      try {
        const res = await fetch("https://openlibrary.org/search.json?q=popular&limit=12");

        const data = await res.json();

        const books = data.docs.map((item) => ({
          workKey: item.key,
          title: item.title ?? "-",
          author: item.author_name?.[0] ?? "-",
          cover: item.cover_i ?? null,

          firstSentence: item.first_sentence?.[0] || item.first_sentence || "",

          subjects: item.subject?.slice(0, 5) || [],
        }));

        setRekomendasi(books);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRekomendasi();
  }, []);

  useEffect(() => {
    const fetchLocalBooks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/books");

        const data = await res.json();

        const books = data.map((item) => ({
          id: item.id,

          workKey: "local_" + item.id,

          title: item.title,
          author: item.author,

          cover_url: item.cover,

          description: item.description,

          stock: item.stock,
          price: item.price,

          isLocal: true,
        }));

        setLocalBooks(books);
      } catch (err) {
        console.log("local books error:", err);
      }
    };

    fetchLocalBooks();
  }, []);

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
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    fetchNotifications();
  }, []);

  const submitLoanRequest = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch("http://localhost:3000/api/loan-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          book_key: selectedBook.cover + "_" + selectedBook.title,
          title: selectedBook.title,
          author: selectedBook.author,
          cover: selectedBook.cover,
        }),
      });

      const data = await res.json();

      // kalau limit tercapai
      if (!data.status) {
        showNotif(data.message);
        return;
      }

      // sukses
      showNotif("Borrow request submitted");
      setShowBorrowPopup(false);
      setSelectedBook(null);
    } catch (err) {
      console.log(err);
      showNotif("Failed to borrow book");
    }
  };
  const fetchDescription = async (workKey) => {
    try {
      if (selectedBook?.isLocal) {
        setBookDescription(selectedBook.description || "No description available.");
        return;
      }

      const res = await fetch(`https://openlibrary.org${workKey}.json`);

      const data = await res.json();

      if (typeof data.description === "string") {
        setBookDescription(data.description);
      } else if (data.description?.value) {
        setBookDescription(data.description.value);
      } else {
        // fallback otomatis
        setBookDescription(`${selectedBook?.title} is a book written by ${selectedBook?.author}. This book is available in the BukuIn digital library collection and can be explored through the detail and borrowing features.`);
      }
    } catch (err) {
      console.log(err);
      if (selectedBook?.firstSentence) {
        setBookDescription(selectedBook.firstSentence);
      } else if (selectedBook?.subjects?.length > 0) {
        setBookDescription(`This book discusses ${selectedBook.subjects.join(", ")}.`);
      } else {
        setBookDescription(`No detailed description is available for this book yet.`);
      }
    }
  };

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

  return (
    <div className="bg-white min-h-screen">
      {notif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 animate-bounce">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium">{notif}</div>
        </div>
      )}

      {/* BORROW POPUP */}
      {showBorrowPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowBorrowPopup(false)}>
          <div className="bg-white p-5 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-blue-700">Borrow Request</h2>

            <p className="mt-4 text-gray-700">Your borrowing request will be sent to the admin for approval. Please wait for a notification regarding the status of your request.</p>

            <div className="mt-4 text-sm text-gray-500 space-y-2">
              <p>
                <b>📌 Process:</b> The admin will review your request.
              </p>

              <p>
                <b>⏳ After approval:</b> You will receive a notification.
              </p>

              <p>
                <b>📚 Book Pickup Requirements:</b>
              </p>
              <ul className="list-disc ml-5">
                <li>Bring your library membership card</li>
                <li>Show your borrowing confirmation</li>
                <li>Collect the book within 1×24 hours after approval</li>
              </ul>

              <p>
                <b>⚠️ Penalties:</b>
              </p>
              <ul className="list-disc ml-5">
                <li>Late return: daily fine will be applied</li>
                <li>Damaged or lost book: replacement fee required</li>
              </ul>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowBorrowPopup(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                  Cancel
                </button>

                <button onClick={submitLoanRequest} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Borrow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL POPUP */}
      {showDetailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDetailPopup(false)}>
          <div
            className="
  bg-white
  p-4 md:p-6
  rounded-2xl
  w-[88%] md:w-full
  max-w-sm md:max-w-lg
  max-h-[75vh] md:max-h-[90vh]
  overflow-y-auto
"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-blue-700">Book Detail</h2>
            </div>

            {/* COVER */}
            <div className="w-full h-64 bg-blue-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
              {selectedBook?.cover ? (
                <img
                  src={selectedBook?.isLocal ? selectedBook.cover_url : `https://covers.openlibrary.org/b/id/${selectedBook.cover}-M.jpg`}
                  alt={selectedBook?.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <p className="text-gray-400">No Cover Available</p>
              )}
            </div>

            {/* TITLE */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-800">{selectedBook?.title}</h2>

              <button
                onClick={() => {
                  const isExist = favorites.find((item) => item.workKey === selectedBook?.workKey);

                  if (isExist) {
                    setFavorites(favorites.filter((item) => item.workKey !== selectedBook?.workKey));

                    showNotif("Removed from favorites");
                  } else {
                    const newFavorite = {
                      workKey: selectedBook?.workKey,
                      title: selectedBook?.title,
                      author: selectedBook?.author,
                      cover: selectedBook?.cover,
                      firstSentence: selectedBook?.firstSentence,
                      subjects: selectedBook?.subjects,
                    };

                    setFavorites([...favorites, newFavorite]);

                    showNotif("Added to favorites");
                  }
                }}
                className="transition flex items-center justify-center shrink-0"
              >
                {favorites.some((item) => item.workKey === selectedBook?.workKey) ? <FiHeart className="text-red-500 text-2xl fill-red-500" /> : <FiHeart className="text-gray-600 text-2xl" />}
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto pr-2 mt-2">
              {/* AUTHOR */}
              <p className="text-gray-500">{selectedBook?.author}</p>

              {/* DESCRIPTION */}
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">{bookDescription}</p>
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
            <Link key={i} to={item.path} className="px-3 py-1 hover:text-blue-200">
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
                onChange={(e) => {
                  const value = e.target.value;

                  setSearch(value);

                  // kalau search dikosongkan
                  if (!value.trim()) {
                    setActiveCategory(null);
                    setGenreBooks([]);
                  }
                }}
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

            {/* ================= PROFILE ================= */}
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="
                relative z-50 w-9 h-9 rounded-full
                bg-linear-to-br from-blue-500 via-blue-600 to-cyan-500
                flex items-center justify-center text-white font-semibold
                shadow-lg hover:scale-105 hover:shadow-blue-400/40
                transition-all duration-300 border-2 border-white
              "
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  {user.profile_image ? <img src={user.profile_image} alt="profile" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {/* DROPDOWN */}
              {isProfileOpen && (
                <>
                  {/* CLICK OUTSIDE */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>

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
                    <div
                      className="
          h-28
          bg-linear-to-r
          from-blue-600
          via-blue-500
          to-cyan-400
          relative
        "
                    >
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>

                      {/* AVATAR */}
                      <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full bg-white p-0.75 shadow-2xl">
                          <div className="w-full h-full rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                            {user.profile_image ? <img src={user.profile_image} alt="profile" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="pt-14 pb-6 px-6 text-center">
                      <h3 className="text-[18px] font-bold text-gray-800 tracking-tight">{user.name || "Unknown User"}</h3>

                      <p className="text-sm text-gray-500 mt-1 break-all">{user.email || "No email available"}</p>

                      <div className="w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-5"></div>

                      <Link to="/profil">
                        <button
                          className="
                w-full
                py-3
                rounded-2xl
                bg-linear-to-r
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
      {/* ✅ OVERLAY FIX (tidak ganggu klik popup/navbar) */}
      {isNotifOpen && <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />}

      {/* BANNER */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full aspect-16/13 md:aspect-16/7">
          <div
            className="flex h-full transition-transform duration-700"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="min-w-full h-full relative">
                <img src={slide.img} className="w-full h-full object-cover" />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
                  <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{slide.title}</h1>

                  <p className="text-white/90 text-sm md:text-lg max-w-2xl">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= KATEGORI ================= */}
      <section className="bg-blue-50 py-12 px-6 md:px-20">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-8">Book Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((item, i) => (
            <div key={i} onClick={() => fetchGenreBooks(item.name)} className={`bg-white p-5 rounded-xl shadow hover:shadow-md transition text-center cursor-pointer ${activeCategory === item.name ? "ring-2 ring-blue-600" : ""}`}>
              <div className="text-3xl text-blue-600 mb-2 flex justify-center">{item.icon}</div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIST BUKU ================= */}
      <section ref={bookSectionRef} className="px-6 md:px-20 py-12">
        <div className="relative flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 text-center">{activeCategory?.includes("Search Results:") ? activeCategory : activeCategory ? `Genre: ${activeCategory}` : "Recommended Books"}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...localBooks, ...(activeCategory ? genreBooks : rekomendasi)].map((book, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-44 md:h-60 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 z-10"></div>
                {book.cover ? (
                  <img src={book.isLocal ? book.cover_url : `https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  "No Cover"
                )}
              </div>

              <div className="p-4 flex flex-col h-42.5 md:h-47.5">
                <div>
                  <h3 className="text-xs md:text-sm font-semibold line-clamp-2 min-h-8.5 md:min-h-10">{book.title}</h3>

                  <p className="text-[11px] md:text-xs text-gray-500 min-h-4.5 md:min-h-5">{book.author}</p>

                  <p className="text-gray-400 text-xs mt-1 mb-3 line-clamp-2 min-h-8">Click detail to see description</p>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => handlePinjam(book)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs md:text-sm font-semibold transition">
                    Borrow
                  </button>

                  <button onClick={() => handleDetail(book)} className="flex-1 bg-gray-200 py-2 rounded-lg text-[11px] md:text-sm hover:bg-gray-300">
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
        <Link to="/koleksi">
          <FiHome size={24} />
        </Link>
        <Link to="/riwayat">
          <FiClock size={24} />
        </Link>
        <Link to="/belanja">
          <FiShoppingCart size={24} />
        </Link>
      </div>

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
            <h3 className="font-semibold text-lg mb-4">About</h3>

            <p className="text-gray-400 text-sm leading-relaxed">Built for book lovers who want a simple, elegant, and interactive reading platform.</p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">© 2026 BukuIn. All rights reserved.</div>
      </footer>
    </div>
  );
}
