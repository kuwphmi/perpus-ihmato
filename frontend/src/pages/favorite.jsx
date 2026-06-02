import { useEffect, useState, useRef } from "react";
import { Heart, Search, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Floating from "./floating";
import { FiBell } from "react-icons/fi";

export default function Favorit() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBorrowPopup, setShowBorrowPopup] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [notif, setNotif] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bookDescription, setBookDescription] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Mengambil data user
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const popupRef = useRef();
  const navigate = useNavigate();

  // URL fallback avatar jika foto profil kosong/error
  const fallbackAvatar = "https://img.icons8.com/?size=100&id=t5EaH6F2mQ9X&format=png&color=000000";

  // Ambil data foto dari object user
  const userPhoto = user.photo || user.profile_picture || user.foto || user.avatar;

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
    const updated = favorites.filter((item) => item.workKey !== workKey);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    showNotif("Removed from favorites 💔");
  };

  const filtered = favorites.filter((book) => book.title?.toLowerCase().includes(search.toLowerCase()));

  const showNotif = (message) => {
    setNotif(message);
    setTimeout(() => {
      setNotif("");
    }, 2000);
  };

  const handleDetail = async (book) => {
    setSelectedBook(book);
    setShowDetailPopup(true);

    if (book.description && book.description.trim() !== "") {
      setBookDescription(book.description);
    } else if (book.id) {
      setBookDescription("Loading description...");
      try {
        const res = await fetch(`http://localhost:3000/api/buku/${book.id}`);
        const data = await res.json();
        const desc = data.description || data.deskripsi || data.data?.description || "No description available for this book.";
        setBookDescription(desc);
      } catch (err) {
        setBookDescription("Failed to load description from local database.");
      }
    } else {
      setBookDescription("No description available for this book.");
    }
  };

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setShowBorrowPopup(true);
  };

  const submitLoanRequest = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/loan-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          book_id: selectedBook.id,
          book_key: selectedBook.workKey,
          title: selectedBook.title,
          author: selectedBook.author,
          cover: selectedBook.cover_url,
        }),
      });

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
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b px-4 md:px-6 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition">
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>
          <div>
            <h1 className="text-lg md:text-[20px] font-semibold text-blue-600">My Favorites</h1>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* NOTIF */}
          <div className="relative">
            <FiBell
              className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-yellow-500 transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsNotifOpen(!isNotifOpen);
              }}
            />

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-64 md:w-72 bg-white rounded-xl shadow-xl border z-50">
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t"></div>
                <div className="py-3 text-center">
                  <h3 className="font-semibold text-gray-700 pb-2 border-b">Your Notification</h3>
                  <div className="py-6 text-sm text-gray-400 border-b">No new notifications yet.</div>
                  <button onClick={() => navigate("/notip")} className="pt-2 text-sm text-gray-600 hover:text-blue-600">
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 👤 PROFILE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
            }}
            className="relative z-50 w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-100 flex items-center justify-center text-white text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-300 border-2 border-white overflow-hidden"
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackAvatar;
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center overflow-hidden border border-red-600">
                {user.profile_image ? <img src={user.profile_image} alt="profile" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 🔹 SEARCH */}
      <div className="px-4 md:px-5 py-3">
        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input type="text" placeholder="Search favorites..." className="outline-none text-xs md:text-sm w-full bg-transparent" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* 🔹 LIST BUKU */}
      <div className="px-4 md:px-5 pb-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {filtered.map((book) => (
              <div key={book.workKey} className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                {/* COVER */}
                <div className="relative h-44 sm:h-52 md:h-60 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                  {book.cover_url ? <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" /> : <div className="text-gray-400 text-xs">No Cover</div>}

                  {/* LOVE BUTTON */}
                  <button onClick={() => removeFavorite(book.workKey)} className="absolute top-2 right-2 md:top-3 md:right-3 z-10 bg-white/90 p-1.5 md:p-2 rounded-full shadow hover:scale-110 transition">
                    <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-3 md:p-4 flex flex-col grow justify-between">
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold line-clamp-2 min-h-8 md:min-h-10 text-gray-800">{book.title}</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 line-clamp-1 mt-0.5">{book.author}</p>
                    <p className="text-gray-400 text-xs mt-1 mb-3 line-clamp-2 min-h-8">Click detail to see description</p>
                  </div>

                  {/* BUTTON */}
                  <div className="flex gap-1.5 md:gap-2 mt-2">
                    <button onClick={() => handleBorrow(book)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg md:rounded-xl text-[11px] md:text-sm font-semibold transition">
                      Borrow
                    </button>
                    <button onClick={() => handleDetail(book)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg md:rounded-xl text-[11px] md:text-sm font-medium transition">
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center mt-20 md:mt-24 px-4">
            <p className="text-gray-400 text-sm">No favorites yet 💙</p>
            <div className="flex flex-col items-center justify-center mt-6 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Heart className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-gray-400 text-xs md:text-sm max-w-xs mb-4">Save the books you love so they’re easier to find later.</p>
              <button onClick={() => navigate("/koleksi")} className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm">
                Explore Books
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 POPUP PROFILE */}
      {isProfileOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
          <div ref={popupRef} className="absolute right-4 md:right-6 top-16 z-50 w-64 md:w-72 bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-[fadeIn_.2s_ease]">
            <div className="h-24 bg-linear-to-r from-blue-500 to-cyan-400 relative">
              <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">
                <div className="w-20 h-20 rounded-full bg-white p-0.75 shadow-lg overflow-hidden flex items-center justify-center">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackAvatar;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center overflow-hidden border border-red-200">
                      {user.profile_image ? <img src={user.profile_image} alt="profile" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-12 pb-5 px-5 text-center">
              <h3 className="text-base md:text-lg font-bold text-gray-800 tracking-tight">{user.name || "Unknown User"}</h3>
              <p className="text-xs text-gray-500 mt-0.5 break-all">{user.email || "No email available"}</p>

              <Link to="/profil">
                <button className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-200">View Profile</button>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* NOTIFICATION TOAST */}
      {notif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 px-4 w-full max-w-xs text-center">
          <div className="bg-blue-600 text-white px-6 py-2.5 rounded-xl shadow-2xl text-xs md:text-sm font-medium inline-block">{notif}</div>
        </div>
      )}

      {/* BORROW POPUP */}
      {showBorrowPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowBorrowPopup(false)}>
          <div className="bg-white p-5 rounded-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-blue-700">Borrow Request</h2>
            <p className="mt-3 text-sm text-gray-600">
              Your borrowing request for <b>{selectedBook?.title}</b> will be sent to the admin.
            </p>
            <div className="flex justify-end gap-3 mt-6 text-sm">
              <button onClick={() => setShowBorrowPopup(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={submitLoanRequest} className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                Borrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 POPUP DETAIL PERBAIKAN STRUKTUR SCROLL (SESUAI GAMBAR) */}
      {showDetailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowDetailPopup(false)}>
          <div className="bg-white p-5 md:p-6 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* 1. HEADER MODAL (STICKY / SHRINK-0) */}
            <h3 className="text-blue-600 font-bold text-sm md:text-base mb-3 shrink-0">Book Detail</h3>

            {/* 2. COVER BUKU (STICKY / SHRINK-0) */}
            <div className="w-full h-52 sm:h-60 bg-blue-50 rounded-2xl overflow-hidden mb-4 flex items-center justify-center border border-gray-100 shadow-inner shrink-0">
              {selectedBook?.cover_url ? <img src={selectedBook.cover_url} alt={selectedBook?.title} className="w-full h-full object-cover" /> : <p className="text-gray-400 text-sm">No Cover</p>}
            </div>

            {/* 3. JUDUL & IKON HEART (STICKY / SHRINK-0) */}
            <div className="flex justify-between items-start gap-3 mb-2 shrink-0">
              <div>
                <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">{selectedBook?.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedBook?.author}</p>
              </div>
              <button
                onClick={() => {
                  removeFavorite(selectedBook?.workKey);
                  setShowDetailPopup(false);
                }}
                className="bg-red-50 p-2 rounded-full hover:bg-red-100 transition min-w-fit shadow"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </button>
            </div>

            {/* 4. TEKS DESKRIPSI (FLEX-1 & OVERFLOW-Y-AUTO: HANYA AREA INI YANG BISA DI-SCROLL) */}
            <div className="overflow-y-auto flex-1 pr-1 border-t border-gray-100 mt-2 pt-2 text-justify">
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bookDescription}</p>
            </div>

            {/* 5. TOMBOL CLOSE (STICKY / SHRINK-0 DI PALING BAWAH) */}
            <button onClick={() => setShowDetailPopup(false)} className="mt-4 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs md:text-sm rounded-xl transition shrink-0">
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 bg-gray-900 text-white">{/* Isi footer */}</footer>
      <Floating />
    </div>
  );
}
