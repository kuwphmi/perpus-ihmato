import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function SearchPage() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const source = searchParams.get("source");
  const initialQuery = searchParams.get("q");

  const [search, setSearch] = useState(initialQuery || "");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [notif, setNotif] = useState("");

  // ================= NOTIF =================
  const showNotif = (message) => {

    setNotif(message);

    setTimeout(() => {
      setNotif("");
    }, 2000);

  };

  // ================= FETCH BOOK =================
  const fetchBooks = async (keyword) => {

    try {

      const res = await fetch(
        `https://openlibrary.org/search.json?q=${keyword}&limit=12`
      );

      const data = await res.json();

      const results = data.docs.map((item) => ({
        title: item.title ?? "-",
        author: item.author_name?.[0] ?? "-",
        cover: item.cover_i ?? null,
        price: ((item.cover_i || 1) * 137) % 100000 + 50000,
        stock: ((item.cover_i || 1) % 15) + 5,
      }));

      setBooks(results);

    } catch (err) {
      console.log(err);
    }

  };

  // ================= SEARCH AWAL =================
  useEffect(() => {

    if (initialQuery) {
      fetchBooks(initialQuery);
    }

  }, [initialQuery]);

  // ================= HANDLE SEARCH =================
  const handleSearch = (e) => {

    if (e.key === "Enter") {

      if (!search.trim()) return;

      navigate(`/search?source=${source}&q=${search}`);

      fetchBooks(search);

    }

  };

  // ================= CART =================
  const tambahKeKeranjang = async (book) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        showNotif("Please login first");
        return;
      }

      await axios.post(
        "http://localhost:3000/api/cart",
        {
          user_id: user.id,
          book_key: `${book.title}_${book.author}`,
          title: book.title,
          author: book.author,
          cover: book.cover,
          price: book.price,
          stock: book.stock,
        }
      );

      showNotif("Book added to cart");

    } catch (err) {

      console.log(err);
      showNotif("Failed to add book");

    }

  };

  // ================= BUY =================
  const handleBuy = async (book) => {

    navigate("/checkout", {
      state: {
        items: [
          {
            ...book,
            qty: 1,
          },
        ],
      },
    });

  };

  // ================= WISHLIST =================
  const handleWishlist = async (book) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        showNotif("Please login first");
        return;
      }

      await fetch(
        "http://localhost:3000/api/favorites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
          }),
        }
      );

      showNotif("Book added to wishlist");

    } catch (err) {

      console.log(err);
      showNotif("Failed to add wishlist");

    }

  };

  // ================= BORROW =================
const handleBorrow = async (book) => {

  try {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      showNotif("Please login first");
      return;
    }

    const res = await fetch(
      "http://localhost:3000/api/loan-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          book_key: `${book.title}_${book.author}`,
        }),
      }
    );

    const data = await res.json();

    // kalau ditolak
    if (!data.status) {

      showNotif(data.message);
      return;

    }

    // sukses
    showNotif("Borrow request submitted");

  } catch (err) {

    console.log(err);
    showNotif("Failed to borrow book");

  }

};

  return (
    <>

      {/* NOTIF */}
      {notif && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">

          <div className="bg-black/80 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium">
            {notif}
          </div>

        </div>
      )}

      {/* PAGE */}
      <div className="min-h-screen bg-gray-100 px-6 py-10">

        {/* SEARCH */}
        <div className="max-w-3xl mx-auto mb-10">

          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full px-6 py-4 rounded-2xl border shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Search Result: "{search}"
        </h2>

        {/* BOOK GRID */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          {books.map((book, index) => (

            <div
              key={index}
              onClick={() => setSelectedBook(book)}
              className="w-full bg-white border rounded-2xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer"
            >

              {/* COVER */}
              <div className="h-52 bg-gray-100">

                {book.cover ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    No Cover
                  </div>
                )}

              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col">

                <h3 className="font-bold text-gray-800 line-clamp-2 text-sm">
                  {book.title}
                </h3>

                <p className="text-blue-600 text-xs mb-3">
                  {book.author}
                </p>

                {source === "belanja" && (
                  <div className="flex justify-between items-center mb-3">

                    <p className="text-blue-700 font-bold text-sm">
                      Rp {book.price.toLocaleString("id-ID")}
                    </p>

                    <p className="text-xs text-gray-500">
                      Stock: {book.stock}
                    </p>

                  </div>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* POPUP DETAIL */}
      {selectedBook && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">

          <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md relative">

            {/* CLOSE */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-3 right-4 text-2xl"
            >
              ×
            </button>

            {/* IMAGE */}
            <img
              src={`https://covers.openlibrary.org/b/id/${selectedBook.cover}-L.jpg`}
              className="w-40 h-56 object-cover rounded-xl mx-auto"
            />

            {/* TITLE */}
            <h2 className="text-xl font-bold mt-5 text-center">
              {selectedBook.title}
            </h2>

            <p className="text-gray-500 text-center mt-1">
              {selectedBook.author}
            </p>

            {/* PRICE */}
            {source === "belanja" && (
              <div className="mt-5 flex justify-between">

                <p className="font-bold text-blue-600">
                  Rp {selectedBook.price?.toLocaleString("id-ID")}
                </p>

                <p className="text-sm text-gray-500">
                  Stock: {selectedBook.stock}
                </p>

              </div>
            )}

            {/* BUTTON */}
            <div className="flex gap-3 mt-6">

              {source === "koleksi" ? (
                <>
                  <button
                    onClick={() => handleWishlist(selectedBook)}
                    className="flex-1 border border-pink-500 text-pink-500 py-3 rounded-xl"
                  >
                    Wishlist
                  </button>

                  <button
                    onClick={() => handleBorrow(selectedBook)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
                  >
                    Borrow
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => tambahKeKeranjang(selectedBook)}
                    className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-xl"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleBuy(selectedBook)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
                  >
                    Buy Now
                  </button>
                </>
              )}

            </div>

          </div>

        </div>

      )}

    </>
  );
}