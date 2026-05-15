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
  const [isEdit, setIsEdit] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    nik: "",
    birth: "",
    gender: "",
    member_code: "",
  });

  const [addresses, setAddresses] = useState([]);

  const [addressForm, setAddressForm] = useState({
    label: "",
    receiver_name: "",
    phone: "",
    full_address: "",
    postal_code: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
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
      });
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {

    fetchAddresses();

  }, []);

  const fetchAddresses = async () => {

    try {

      const userData = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:3000/api/address/${userData.id}`
      );

      console.log(res.data)
      setAddresses(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // upload foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // ← SIMPAN KE DATABASE
  const handleSave = async () => {
    try {
      if (user.nik && user.nik.length !== 16) {
        alert("NIK harus 16 digit");
        return;
      }

      const res = await axios.put("http://localhost:3000/api/update-profile", {
        id: user.id,
        name: user.name,
        phone: user.phone,
        nik: user.nik,
        birth: user.birth,
        gender: user.gender,
      });

      if (res.data.status) {
        localStorage.setItem("user", JSON.stringify(res.data.user || user));

        setUser(res.data.user || user);

        alert("Profil berhasil disimpan!");
        setIsEdit(false);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Gagal menyimpan profil");
    }
  };

  const setPrimaryAddress = async (id) => {

    try {

      await axios.put(
        `http://localhost:3000/api/address/primary/${id}`
      );

      fetchAddresses();

    } catch (err) {

      console.log(err);

    }

  };

  //logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
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
              {profileImage ? <img src={profileImage} className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-white">{user.name?.charAt(0).toUpperCase() ?? "?"}</span>}
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

              <h3 className="font-semibold text-gray-700 mb-4">
                Member Card
              </h3>

              <div className="relative rounded-2xl p-6 text-white overflow-hidden bg-linear-to-br from-blue-500 via-blue-600 to-blue-800 shadow-lg">

                {/* EFFECT */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                {/* CONTENT */}
                <p className="text-xs opacity-70 mb-1">
                  Member Number
                </p>

                <h2 className="text-2xl font-bold mb-6 tracking-wider">
                  {user.member_code || user.id?.slice(0, 8).toUpperCase() || "-"}
                </h2>

                <div className="flex justify-between text-sm">

                  <div>

                    <p className="opacity-70 text-xs">
                      Name
                    </p>

                    <p className="font-semibold">
                      {user.name?.toUpperCase()}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="opacity-70 text-xs">
                      Status
                    </p>

                    <p className="font-semibold text-green-300">
                      Active
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* MY ADDRESS */}
            <div className="bg-white rounded-2xl shadow-md p-6">

              {/* HEADER */}
              {/* HEADER */}
              <div className="flex justify-between items-center mb-5">

                <h3 className="font-semibold text-gray-700">
                  My Addresses
                </h3>

                <Link
                  to="/address"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Manage Address
                </Link>
              </div>

              {/* ADDRESS LIST */}
              <div className="space-y-4">

                {addresses.length === 0 && (
                  <div className="border border-dashed rounded-xl p-8 text-center text-gray-400">
                    No address added yet
                  </div>
                )}

                {Array.isArray(addresses) &&
  addresses
    .filter((item) => item.is_primary)
    .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-xl p-4"
                    >

                      <div className="flex justify-between items-start gap-4">

                        <div>

                          {/* LABEL */}
                          <div className="flex items-center gap-2">

                            <h4 className="font-semibold text-gray-800">
                              {item.label}
                            </h4>

                            {item.is_primary && (
                              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                Main
                              </span>
                            )}

                          </div>

                          {/* RECEIVER */}
                          <p className="mt-2 font-medium text-gray-700">
                            {item.receiver_name}
                          </p>

                          {/* PHONE */}
                          <p className="text-sm text-gray-500">
                            {item.phone}
                          </p>

                          {/* ADDRESS */}
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            {item.full_address}
                          </p>

                          {/* POSTAL */}
                          <p className="text-sm text-gray-400 mt-1">
                            Postal Code: {item.postal_code}
                          </p>

                        </div>

                        {/* BUTTON */}
                        {!item.is_primary && (
                          <button
                            onClick={() => setPrimaryAddress(item.id)}
                            className="text-blue-600 text-sm hover:underline"
                          >
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
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold shadow transition">
            Logout
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white">

        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">
              BukuIn
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Discover thousands of books, explore new worlds,
              and enjoy a modern digital library experience.
            </p>
          </div>

          {/* MENU */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Navigation
            </h3>

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

          {/* ABOUT */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              About
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              Built for book lovers who want a simple,
              elegant, and interactive reading platform.
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
          © 2026 BukuIn. All rights reserved.
        </div>

      </footer>

    </div>
  );
}
