import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchPage() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const source = searchParams.get("source");
  const initialQuery = searchParams.get("q");

  const [search, setSearch] = useState(initialQuery || "");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // FETCH BOOKS
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

  // SEARCH AWAL
  useEffect(() => {

    if (initialQuery) {
      fetchBooks(initialQuery);
    }

  }, [initialQuery]);

  // HANDLE SEARCH
  const handleSearch = (e) => {

    if (e.key === "Enter") {

      if (!search.trim()) return;

      navigate(`/search?source=${source}&q=${search}`);

      fetchBooks(search);

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      {/* SEARCH BAR */}
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
      className="w-full bg-white border rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
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

        {/* PRICE */}
        {source === "belanja" && (
          <div className="flex justify-between items-center mb-3">

            <p className="text-blue-700 font-bold text-sm">
              Rp {book.price.toLocaleString("id-ID")}
            </p>

            <p className="text-xs text-gray-500">
              Sto: {book.stock}
            </p>

          </div>
        )}

        {/* BUTTON */}
        <div className="flex gap-2 mt-auto">

          {source === "koleksi" ? (
            <>
              <button className="flex-1 border border-pink-500 text-pink-500 py-2 rounded-xl text-sm hover:bg-pink-50">
                Wishlist
              </button>

              <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700">
                Borrow
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl text-sm hover:bg-blue-50">
                Cart
              </button>

              <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700">
                Buy
              </button>
            </>
          )}

        </div>

        {/* SHOW DETAIL */}
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

{/* POPUP DETAIL */}
{selectedBook && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

    <div className="bg-white rounded-3xl w-full max-w-3xl p-6 relative">

      {/* CLOSE */}
      <button
        onClick={() => setSelectedBook(null)}
        className="absolute top-4 right-4 text-2xl hover:text-red-500"
      >
        ✕
      </button>

      <div className="grid md:grid-cols-2 gap-6">

        {/* COVER */}
        <div>

          <img
            src={
              selectedBook.cover
                ? `https://covers.openlibrary.org/b/id/${selectedBook.cover}-L.jpg`
                : "https://via.placeholder.com/300x400"
            }
            alt={selectedBook.title}
            className="w-full h-[420px] object-cover rounded-2xl shadow"
          />

        </div>

        {/* DETAIL */}
        <div className="flex flex-col">

          <h2 className="text-3xl font-bold text-gray-800">
            {selectedBook.title}
          </h2>

          <p className="text-blue-600 mt-2 text-lg">
            {selectedBook.author}
          </p>

          {/* PRICE */}
          {source === "belanja" && (
            <div className="mt-5">

              <p className="text-3xl font-bold text-blue-700">
                Rp {selectedBook.price.toLocaleString("id-ID")}
              </p>

              <p className="text-gray-500 mt-1">
                Stock: {selectedBook.stock}
              </p>

            </div>
          )}

          {/* DESC */}
          <div className="mt-6 text-sm text-gray-600 leading-relaxed">

            Buku ini tersedia di platform BukuIn.
            Kamu bisa membaca detail buku,
            melakukan pembelian,
            menyimpan ke favorit,
            atau mengajukan peminjaman buku.

          </div>

          {/* ACTION */}
          <div className="flex gap-3 mt-auto pt-8">

            {source === "koleksi" ? (
              <>
                <button className="flex-1 border border-pink-500 text-pink-500 py-3 rounded-xl hover:bg-pink-50">
                  Wishlist
                </button>

                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
                  Borrow
                </button>
              </>
            ) : (
              <>
                <button className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50">
                  Cart
                </button>

                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
                  Buy
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>

  </div>

)}

    </div>
  );
}