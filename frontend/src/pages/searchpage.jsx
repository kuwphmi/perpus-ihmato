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
        price: Math.floor(Math.random() * 100000) + 50000,
        stock: Math.floor(Math.random() * 20) + 1,
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
      alert("Login dulu");
      return;
    }

    await axios.post(
      "http://localhost:3000/api/cart",
      {
        user_id: user.id,
        book_key: book.cover + "_" + book.title,
        title: book.title,
        author: book.author,
        cover: book.cover,
        price: book.price,
        stock: book.stock,
      }
    );

    alert("Masuk keranjang");

  } catch (err) {

    console.log(err);
    alert("Gagal tambah keranjang");

  }

};


  // ================= BUY =================
  const handleBuy = async (book) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Login dulu");
        return;
      }

      const res = await fetch(
        "http://localhost:3000/api/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            items: [
              {
                book_key: book.title,
                title: book.title,
                price: book.price,
                qty: 1,
              },
            ],
          }),
        }
      );

      const data = await res.json();

      window.snap.pay(data.token);

    } catch (err) {
      console.log(err);
    }

  };

  // ================= WISHLIST =================
  const handleWishlist = async (book) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Login dulu");
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

      alert("Masuk wishlist");

    } catch (err) {
      console.log(err);
    }

  };

  // ================= BORROW =================
  const handleBorrow = async (book) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Login dulu");
        return;
      }

      await fetch(
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
            book_key: book.title,
          }),
        }
      );

      alert("Pengajuan pinjam berhasil");

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

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

      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Search Result: "{search}"
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        {books.map((book, index) => (

          <div
            key={index}
            className="w-full bg-white border rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >

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

              <div className="flex gap-2 mt-auto">

                {source === "koleksi" ? (
                  <>
                    <button
                      onClick={() => handleWishlist(book)}
                      className="flex-1 border border-pink-500 text-pink-500 py-2 rounded-xl text-sm hover:bg-pink-50"
                    >
                      Wishlist
                    </button>

                    <button
                      onClick={() => handleBorrow(book)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700"
                    >
                      Borrow
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => tambahKeKeranjang(book)}
                      className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl text-sm hover:bg-blue-50"
                    >
                      Cart
                    </button>

                    <button
                      onClick={() => handleBuy(book)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700"
                    >
                      Buy
                    </button>
                  </>
                )}

              </div>

              <button
                onClick={() => setSelectedBook(book)}
                className="mt-3 bg-gray-100 py-2 rounded-xl hover:bg-gray-200 text-sm"
              >
                Show Detail
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
