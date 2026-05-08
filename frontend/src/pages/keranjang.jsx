import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function Keranjang() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  /* =========================
     AMBIL DATA CART
  ========================= */
  useEffect(() => {
    fetchCart();
  }, []);


  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:3000/api/cart/${user.id}`
      );

      if (res.data.status) {
        setCart(res.data.data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Login dulu ya");
        return;
      }

      // ambil item yang dicentang
      const selectedCart = cart.filter((item) =>
        selectedItems.includes(item.id)
      );

      if (selectedCart.length === 0) {
        alert("Pilih barang dulu");
        return;
      }

      const items = selectedCart.map((item) => ({
        book_key: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty || 1,
      }));

      const res = await axios.post(
        "http://localhost:3000/api/payment/create",
        {
          user_id: user.id,
          items,
        }
      );

      const token = res.data.token;

      // MIDTRANS POPUP
      window.snap.pay(token, {
        onSuccess: async function () {

          alert("Pembayaran berhasil 🎉");

          // hapus item yang dicheckout
          for (const item of selectedCart) {

            await axios.delete(
              `http://localhost:3000/api/cart/${item.id}`
            );

          }

          // refresh cart
          fetchCart();

          // reset checkbox
          setSelectedItems([]);

        },
      });

    } catch (err) {
      console.log(err);
      alert("Checkout gagal");
    }
  };
  /* =========================
     CHECKBOX
  ========================= */
  const handleCheck = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(
        selectedItems.filter((item) => item !== id)
      );
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  /* =========================
     TOTAL
  ========================= */
  const total = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + (item.price * item.qty), 0);

  /* =========================
     HAPUS ITEM
  ========================= */
  const handleRemove = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/cart/${id}`
      );

      setCart(cart.filter((item) => item.id !== id));

      setSelectedItems(
        selectedItems.filter((item) => item !== id)
      );

    } catch (err) {
      console.log(err);
    }
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 pb-28">

      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm flex justify-between items-center relative">
        <h1 className="text-lg font-bold text-blue-700 flex items-center gap-2">
          <FiShoppingCart /> Cart
        </h1>

        <div className="flex items-center gap-3">

          <p className="text-sm text-gray-500">
            {cart.length} item
          </p>

          {/* PROFILE */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
            }}
            className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm cursor-pointer"
          >
            {user.name ? user.name.charAt(0) : "U"}
          </div>

        </div>

        {/* modal popup */}

        {isProfileOpen && (
          <div
            ref={popupRef}
            className="absolute right-4 top-16 z-50"
          >
            <div className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleIn">

              <div className="flex flex-col items-center py-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>

                <h2 className="font-semibold text-gray-800">
                  {user.name || "-"}
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                  {user.email || "-"}
                </p>

                <Link to="/profil">
                  <button className="w-56 bg-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                    My Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SELECT ALL */}
      <div className="flex items-center gap-2 p-4 bg-white mt-2">
        <input
          type="checkbox"
          checked={
            cart.length > 0 &&
            selectedItems.length === cart.length
          }
          onChange={handleSelectAll}
        />

        <span className="text-gray-600 text-sm">
          Select Items
        </span>
      </div>

      {/* LIST */}
      <div className="mt-2 space-y-2 px-2">

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 bg-white p-3 rounded-lg shadow-sm"
          >

            {/* CHECKBOX */}
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleCheck(item.id)}
            />

            {/* IMAGE */}
            <img
              src={`https://covers.openlibrary.org/b/id/${item.cover}-M.jpg`}
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

              <p className="text-xs text-gray-400">
                Qty: {item.qty}
              </p>

              <p className="text-blue-600 font-bold text-sm">
                Rp {item.price?.toLocaleString("id-ID")}
              </p>

            </div>

            {/* DELETE */}
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500"
            >
              <FiTrash2 size={18} />
            </button>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center shadow-lg">

        <div>
          <p className="text-xs text-gray-500">
            Total
          </p>

          <p className="text-lg font-bold text-blue-600">
            Rp {total.toLocaleString("id-ID")}
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className={`px-6 py-2 rounded-lg text-white text-sm ${selectedItems.length === 0
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