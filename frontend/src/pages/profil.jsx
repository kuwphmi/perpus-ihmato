import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import Floating from "./floating";

import { FiHome, FiBook, FiShoppingCart, FiClock, FiCamera } from "react-icons/fi";

export default function Profil() {
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    nik: "",
    birth: "",
    gender: "",
    member_code: "",
    profile_image: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [notif, setNotif] = useState("");
  const [notifType, setNotifType] = useState("info");

  const showNotif = (message, type = "info") => {
    setNotif(message);
    setNotifType(type);
    setTimeout(() => {
      setNotif("");
    }, 3000);
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

  const [addressForm, setAddressForm] = useState({
    label: "",
    receiver_name: "",
    phone: "",
    full_address: "",
    postal_code: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");

    // kalau kosong
    if (!stored || stored === "undefined") {
      navigate("/login");

      return;
    }

    try {
      const data = JSON.parse(stored);

      setUser({
        id: data.id ?? "",
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        nik: data.nik ?? "",
        birth: data.birth ?? "",
        gender: data.gender ?? "",
        member_code: data.member_code ?? "",
        profile_image: data.profile_image ?? "",
      });
    } catch (err) {
      console.log(err);

      localStorage.removeItem("user");

      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const stored = localStorage.getItem("user");

      if (!stored || stored === "undefined") return;

      const userData = JSON.parse(stored);

      if (!userData?.id) return;

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/address/${userData.id}`);

      setAddresses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // upload foto
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("profile_image", file);

      formData.append("id", user.id);

      formData.append("name", user.name);

      formData.append("phone", user.phone);

      formData.append("nik", user.nik);

      formData.append("birth", user.birth);

      formData.append("gender", user.gender);

      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/update-profile`, formData);

      if (res.data.status) {
        setUser(res.data.user);

        localStorage.setItem("user", JSON.stringify(res.data.user));

        showNotif("Photo updated!", "success");
      }
    } catch (err) {
      console.log(err);

      showNotif("Failed upload image", "error");
    }
  };
  // ← SIMPAN KE DATABASE
  const handleSave = async () => {
    try {
      if (user.nik && user.nik.length !== 16) {
        showNotif("NIK must contain 16 digits");
        return;
      }

      if (!user.birth) {
        showNotif("Please enter your date of birth");

        return;
      }

      if (!user.gender) {
        showNotif("Please select gender");

        return;
      }
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/update-profile`, {
        id: user.id,
        name: user.name,
        phone: user.phone,
        nik: user.nik,
        birth: user.birth,
        gender: user.gender,
        profile_image: user?.profile_image,
      });

      if (res.data.status) {
        // ambil user terbaru dari backend
        const updatedUser = res.data.user;
        // update state
        setUser(updatedUser);

        // update localstorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        showNotif("Profile updated successfully!");

        setIsEdit(false);

        navigate("/choosegenre");
      } else {
        showNotif(res.data.message);
      }
    } catch (err) {
      console.log(err);

      showNotif("Failed to save profile");
    }
  };

  const setPrimaryAddress = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/address/primary/${id}`);

      fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  //logout
  const handleLogout = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser?.id) {
      const key = `chatHistory_${storedUser.id}`;
      const archiveKey = `chatArchive_${storedUser.id}`;
      const history = localStorage.getItem(key);
      if (history) {
        localStorage.setItem(archiveKey, history);
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <>
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

      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">
          <div className="flex gap-6">
            {[
              { name: "Home", path: "/koleksi" },
              { name: "History", path: "/riwayat" },
              { name: "Shop", path: "/belanja" },
            ].map((item, i) => (
              <Link key={i} to={item.path} className="px-3 py-1 rounded-md hover:text-blue-200 hover:bg-white/10 transition">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* BANNER */}
        <div className="relative h-56 bg-blue-500">
          <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" className="w-full h-full object-cover opacity-40" alt="banner" />
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10 flex-1 w-full">
          {message && <div className="mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-sm text-center">{message}</div>}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
            {/* FOTO */}
            <label className="cursor-pointer relative">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg bg-blue-600 flex items-center justify-center">
                {user?.profile_image ? <img src={user?.profile_image} className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-white">{user.name?.charAt(0).toUpperCase() ?? "?"}</span>}
              </div>

              <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white">
                <FiCamera size={16} />
              </div>

              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>

            {/* INFO */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-800">{user.name || "-"}</h2>

              <p className="text-gray-500 text-sm">{user.email || "-"}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {/* MOBILE NAV */}
            <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-xl shadow-lg z-50">
              <Link to="/koleksi">
                <FiBook size={24} />
              </Link>
              <Link to="/riwayat">
                <FiClock size={24} />
              </Link>
              <Link to="/belanja">
                <FiShoppingCart size={24} />
              </Link>
            </div>

            {/* BIODATA */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Personal Information</h3>

                <button
                  onClick={isEdit ? handleSave : () => setIsEdit(true)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-lg transition ${isEdit ? "bg-blue-600 text-white hover:bg-blue-700" : "text-blue-600 border border-blue-200 hover:bg-blue-50"}`}
                >
                  {isEdit ? "Save" : "Edit"}
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* Nama */}
                <div>
                  <p className="text-gray-500 mb-1">Full Name</p>

                  {isEdit ? (
                    <input
                      type="text"
                      value={user.name || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          name: e.target.value,
                        })
                      }
                      className="border rounded-lg px-3 py-2 w-full focus:outline-blue-500"
                    />
                  ) : (
                    <p className="font-medium">{user.name || "-"}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <p className="text-gray-500 mb-1">Email</p>

                  <p className="font-medium">{user.email || "-"}</p>
                </div>

                {/* No Telepon */}
                <div>
                  <p className="text-gray-500 mb-1">Phone Number</p>

                  {isEdit ? (
                    <input
                      type="text"
                      value={user.phone || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          phone: e.target.value,
                        })
                      }
                      className="border rounded-lg px-3 py-2 w-full focus:outline-blue-500"
                    />
                  ) : (
                    <p className="font-medium">{user.phone || "-"}</p>
                  )}
                </div>

                {/* NIK */}
                <div>
                  <p className="text-gray-500 mb-1">NIK</p>

                  {isEdit ? (
                    <input
                      type="text"
                      value={user.nik || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          nik: e.target.value,
                        })
                      }
                      className="border rounded-lg px-3 py-2 w-full focus:outline-blue-500"
                    />
                  ) : (
                    <p className="font-medium">{user.nik || "-"}</p>
                  )}
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <p className="text-gray-500 mb-1">Date of Birth</p>

                  {isEdit ? (
                    <input
                      type="date"
                      value={user.birth || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          birth: e.target.value,
                        })
                      }
                      className="border rounded-lg px-3 py-2 w-full focus:outline-blue-500"
                    />
                  ) : (
                    <p className="font-medium">{user.birth || "-"}</p>
                  )}
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <p className="text-gray-500 mb-1">Gender</p>

                  {isEdit ? (
                    <select
                      value={user.gender || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          gender: e.target.value,
                        })
                      }
                      className="border rounded-lg px-3 py-2 w-full focus:outline-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <p className="font-medium">{user.gender || "-"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {/* KARTU ANGGOTA */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Member Card</h3>

                <div className="relative rounded-2xl p-6 text-white overflow-hidden bg-linear-to-br from-blue-500 via-blue-600 to-blue-800 shadow-lg">
                  {/* EFFECT */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                  {/* CONTENT */}
                  <p className="text-xs opacity-70 mb-1">Member Number</p>

                  <h2 className="text-2xl font-bold mb-6 tracking-wider">{user.member_code || user.id?.slice(0, 8).toUpperCase() || "-"}</h2>

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="opacity-70 text-xs">Name</p>

                      <p className="font-semibold">{user.name?.toUpperCase()}</p>
                    </div>

                    <div className="text-right">
                      <p className="opacity-70 text-xs">Status</p>

                      <p className="font-semibold text-green-300">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MY ADDRESS */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                {/* HEADER */}
                {/* HEADER */}
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-semibold text-gray-700">My Addresses</h3>

                  <Link to="/address" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                    Manage Address
                  </Link>
                </div>

                {/* ADDRESS LIST */}
                <div className="space-y-4">
                  {addresses.length === 0 && <div className="border border-dashed rounded-xl p-8 text-center text-gray-400">No address added yet</div>}

                  {Array.isArray(addresses) &&
                    addresses
                      .filter((item) => item.is_primary)
                      .map((item) => (
                        <div key={item.id} className="border rounded-xl p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              {/* LABEL */}
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-800">{item.label}</h4>

                                {item.is_primary && <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">Main</span>}
                              </div>

                              {/* RECEIVER */}
                              <p className="mt-2 font-medium text-gray-700">{item.receiver_name}</p>

                              {/* PHONE */}
                              <p className="text-sm text-gray-500">{item.phone}</p>

                              {/* ADDRESS */}
                              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.full_address}</p>

                              {/* POSTAL */}
                              <p className="text-sm text-gray-400 mt-1">Postal Code: {item.postal_code}</p>
                            </div>

                            {/* BUTTON */}
                            {!item.is_primary && (
                              <button onClick={() => setPrimaryAddress(item.id)} className="text-blue-600 text-sm hover:underline">
                                Set Main
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>

          {/* MASCOT (INI YANG KAMU TAMBAH) */}
          <Floating />

          {/* LOGOUT */}
          <div className="mt-8 mb-16">
            <button onClick={() => setShowLogoutConfirm(true)} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold shadow transition">
              Logout
            </button>
          </div>
          {showLogoutConfirm && (
            <div
              className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black/40
    backdrop-blur-sm
    p-4
  "
            >
              <div
                className="
      bg-white
      rounded-3xl
      shadow-2xl
      w-full
      max-w-sm
      p-6
      text-center
    "
              >
                <div
                  className="
        w-16
        h-16
        rounded-full
        bg-red-50
        flex
        items-center
        justify-center
        mx-auto
        mb-4
      "
                >
                  <span className="text-2xl">↩</span>
                </div>

                <h2
                  className="
        text-xl
        font-bold
        text-gray-800
        mb-2
      "
                >
                  Logout Confirmation
                </h2>

                <p
                  className="
        text-sm
        text-gray-500
        mb-6
      "
                >
                  Are you sure you want to log out?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="
            flex-1
            py-3
            rounded-2xl
            border
            font-medium
            hover:bg-gray-50
            transition
          "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleLogout}
                    className="
            flex-1
            py-3
            rounded-2xl
            bg-red-500
            text-white
            font-medium
            hover:bg-red-600
            transition
          "
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {/* FOOTER */}
        <footer className="relative mt-20 bg-black text-white overflow-hidden">
          {/* BACKGROUND EFFECT */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/10 blur-3xl rounded-full"></div>
        
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16">
            {/* TOP */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* BRAND */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={logo}
                    alt="BookIn"
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
        
                  <div>
                    <h2 className="text-3xl font-bold">
                      Book<span className="text-blue-500">In</span>
                    </h2>
        
                    <p className="text-sm text-gray-500">
                      Modern Digital Library & Bookstore
                    </p>
                  </div>
                </div>
        
                <p className="text-gray-400 leading-relaxed max-w-xl">
                  Discover thousands of books, borrow educational resources,
                  and purchase your favorite titles through a seamless and
                  modern platform built for every reader.
                </p>
              </div>
        
              {/* SERVICES */}
              <div className="grid md:grid-cols-2 gap-5">
                <div
                  className="
                    rounded-[28px]
                    border border-white/10
                    bg-white/5
                    backdrop-blur-xl
                    p-7
                    hover:bg-white/8
                    transition-all
                  "
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-blue-400">
                    Service
                  </span>
        
                  <h3 className="text-2xl font-bold mt-3">
                    Book Borrowing
                  </h3>
        
                  <p className="text-gray-400 mt-4 leading-relaxed text-sm">
                    Borrow books directly from the library collection through
                    a simple and efficient borrowing system.
                  </p>
                </div>
        
                <div
                  className="
                    rounded-[28px]
                    border border-white/10
                    bg-white/5
                    backdrop-blur-xl
                    p-7
                    hover:bg-white/8
                    transition-all
                  "
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-blue-400">
                    Service
                  </span>
        
                  <h3 className="text-2xl font-bold mt-3">
                    Book Purchase
                  </h3>
        
                  <p className="text-gray-400 mt-4 leading-relaxed text-sm">
                    Purchase your favorite books with secure transactions and
                    a convenient checkout experience.
                  </p>
                </div>
              </div>
            </div>
        
            {/* DIVIDER */}
            <div className="mt-14 border-t border-white/10"></div>
        
            {/* BOTTOM */}
            <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2026 BookIn. All rights reserved.
              </p>
        
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>Digital Library</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>Book Store</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>Modern Reading Experience</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
