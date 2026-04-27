import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

export default function Keranjang({ cart = [], setCart }) {
  const [selectedItems, setSelectedItems] = useState([]);

  // =========================
  // DUMMY DATA
  // =========================
  const dummyBooks = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      price: 120000,
      image: "https://covers.openlibrary.org/b/id/10521261-L.jpg",
    },
    {
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      price: 90000,
      image: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
    },
    {
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      price: 150000,
      image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    },
  ];

  // pakai cart asli kalau ada, kalau tidak pakai dummy
  const displayCart = cart.length > 0 ? cart : dummyBooks;

  // =========================
  // CHECKBOX
  // =========================
  const handleCheck = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === displayCart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayCart.map((_, i) => i));
    }
  };

  // =========================
  // TOTAL
  // =========================
  const total = displayCart
    .filter((_, i) => selectedItems.includes(i))
    .reduce((acc, item) => acc + item.price, 0);

  // =========================
  // HAPUS (hanya kalau cart asli)
  // =========================
  const handleRemove = (index) => {
    if (cart.length === 0) return; // biar dummy ga kehapus

    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    setSelectedItems(selectedItems.filter((i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-28">

      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-700 flex items-center gap-2">
          <FiShoppingCart /> Keranjang
        </h1>
        <p className="text-sm text-gray-500">
          {displayCart.length} item
        </p>
      </div>

      {/* SELECT ALL */}
      <div className="flex items-center gap-2 p-4 bg-white mt-2">
        <input
          type="checkbox"
          checked={selectedItems.length === displayCart.length}
          onChange={handleSelectAll}
        />
        <span className="text-gray-600 text-sm">Pilih Semua</span>
      </div>

      {/* LIST PRODUK */}
      <div className="mt-2 space-y-2 px-2">
        {displayCart.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 bg-white p-3 rounded-lg shadow-sm"
          >
            {/* CHECKBOX */}
            <input
              type="checkbox"
              checked={selectedItems.includes(index)}
              onChange={() => handleCheck(index)}
            />

            {/* GAMBAR */}
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-24 object-cover rounded-md"
            />

            {/* INFO */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {item.author}
                </p>
              </div>

              <p className="text-blue-600 font-bold text-sm">
                Rp {item.price}
              </p>
            </div>

            {/* HAPUS */}
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER CHECKOUT */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-blue-600">
            Rp {total}
          </p>
        </div>

        <button
          disabled={selectedItems.length === 0}
          className={`px-6 py-2 rounded-lg text-white text-sm ${
            selectedItems.length === 0
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Checkout ({selectedItems.length})
        </button>
      </div>
    </div>
  );
}