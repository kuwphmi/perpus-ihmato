import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Keranjang() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notif, setNotif] = useState("");
  const [notifType, setNotifType] = useState("info"); // info, success, error, warning

  /* =========================
     AMBIL DATA CART
  ========================= */
  useEffect(() => {
    fetchCart();

    // Listen untuk perubahan visibility (ketika user kembali ke tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refresh cart data ketika user kembali ke halaman
        fetchCart();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Toast Notification
  const showNotif = (message, type = "info") => {
    setNotif(message);
    setNotifType(type);
    setTimeout(() => setNotif(""), 3000);
  };

  const getNotifColor = () => {
    switch (notifType) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/${user.id}`);
      if (res.data.status) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = () => {
    const selectedCart = cart.filter((item) => selectedItems.includes(item.id));

    if (selectedCart.length === 0) {
      showNotif("Pilih barang dulu", "warning");
      return;
    }

    navigate("/checkout", {
      state: {
        items: selectedCart,
      },
    });
  };

  /* =========================
     CHECKBOX
  ========================= */
  const handleCheck = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
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
  const total = cart.filter((item) => selectedItems.includes(item.id)).reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);

  const updateQty = async (id, qty, stock) => {
    if (qty < 1) return;
    if (qty > stock) {
      showNotif(`Stock is limited ${stock}`, "error");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/cart/${id}`, { qty });
      fetchCart();
    } catch (err) {
      console.log(err);
      showNotif("Failed to update quantity", "error");
    }
  };

  /* =========================
     HAPUS ITEM
  ========================= */
  const handleRemove = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart/${id}`);
      setCart(cart.filter((item) => item.id !== id));
      setSelectedItems(selectedItems.filter((item) => item !== id));
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
      {/* NOTIFICATION TOAST */}
      {notif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4">
          <div className={`${getNotifColor()} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {notifType === "success" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notifType === "error" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {notifType === "warning" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{notif}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="
      w-10
      h-10
      rounded-full
      bg-blue-50
      hover:bg-blue-100
      flex
      items-center
      justify-center
      transition
    "
          >
            <FiArrowLeft className="text-blue-600 text-lg" />
          </button>

          <div>
            <h1 className="text-[20px] font-semibold text-blue-600">Cart</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{cart.length} item</p>

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
          <div ref={popupRef} className="absolute right-4 top-16 z-50">
            <div className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleIn">
              <div className="flex flex-col items-center py-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3">{user.name ? user.name.charAt(0) : "U"}</div>

                <h2 className="font-semibold text-gray-800">{user.name || "-"}</h2>

                <p className="text-sm text-gray-500 mb-5">{user.email || "-"}</p>

                <Link to="/profil">
                  <button className="w-56 bg-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">My Profile</button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SELECT ALL */}
      <div className="flex items-center gap-2 p-4 bg-white mt-2">
        <input type="checkbox" checked={cart.length > 0 && selectedItems.length === cart.length} onChange={handleSelectAll} />

        <span className="text-gray-600 text-sm">Select Items</span>
      </div>

      {/* LIST */}
      <div className="mt-2 space-y-2 px-2">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 bg-white p-3 rounded-lg shadow-sm">
            {/* CHECKBOX */}
            <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleCheck(item.id)} />

            {/* IMAGE */}
            <img src={item.cover?.startsWith("http") ? item.cover : `https://covers.openlibrary.org/b/id/${item.cover}-M.jpg`} alt={item.title} className="w-20 h-24 object-cover rounded-md" />

            {/* INFO */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">{item.title}</h2>

                <p className="text-xs text-gray-500">{item.author}</p>
              </div>

              <div className="text-xs text-gray-400">
                <p>Qty</p>

                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQty(item.id, item.qty - 1, item.stock)} className="w-7 h-7 rounded bg-gray-200">
                    -
                  </button>

                  <input
                    type="text"
                    min="1"
                    max={item.stock}
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, Math.max(1, Math.min(item.stock, Number(e.target.value))), item.stock)}
                    className="w-14 h-8 border rounded text-center text-sm outline-none"
                  />

                  <button onClick={() => updateQty(item.id, item.qty + 1, item.stock)} className="w-7 h-7 rounded bg-gray-200">
                    +
                  </button>
                </div>
              </div>

              <p className="text-blue-600 font-bold text-sm">Rp {item.price?.toLocaleString("id-ID")}</p>
            </div>

            {/* DELETE */}
            <button onClick={() => handleRemove(item.id)} className="text-red-500">
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-xs text-gray-500">Total</p>

          <p className="text-lg font-bold text-blue-600">Rp {total.toLocaleString("id-ID")}</p>
        </div>

        <button onClick={handleCheckout} disabled={selectedItems.length === 0} className={`px-6 py-2 rounded-lg text-white text-sm ${selectedItems.length === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
          Checkout ({selectedItems.length})
        </button>
      </div>
    </div>
  );
}
