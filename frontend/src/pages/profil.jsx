import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

import {
  FiHome,
  FiBook,
  FiShoppingCart,
  FiClock,
  FiCamera,
} from "react-icons/fi";

export default function Profil() {
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
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

      const res = await axios.put(
        "http://localhost:3000/api/update-profile",
        {
          id: user.id,
          name: user.name,
          phone: user.phone,
          nik: user.nik,
          birth: user.birth,
          gender: user.gender,
        }
      );

      if (res.data.status) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user || user)
        );

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

//logout
const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
  <div className="min-h-screen bg-gray-100 pb-28">
    <div className="hidden md:flex bg-blue-600 text-white px-10 py-3 items-center justify-end text-sm font-medium">
      <div className="flex gap-6">
        {[
          { name: "Beranda", path: "/halamanutama" },
          { name: "Koleksi", path: "/koleksi" },
          { name: "Belanja", path: "/belanja" },
          { name: "Riwayat", path: "/riwayat" },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className="px-3 py-1 rounded-md hover:text-blue-200 hover:bg-white/10 transition"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
    
    
    {/* BANNER */}
    <div className="relative h-56 bg-blue-500">
      <img
      src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
      className="w-full h-full object-cover opacity-40"
      alt="banner"
    />
  </div>
  
  <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
    
    {message && (
      <div className="mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-sm text-center">
        {message}
        </div>
      )}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
          


          {/* FOTO */}
    <label className="cursor-pointer relative">
      <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg bg-blue-600 flex items-center justify-center">
        {profileImage ? (
          <img
            src={profileImage}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-white">
            {user.name?.charAt(0).toUpperCase() ?? "?"}
          </span>
        )}
      </div>

      <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white">
        <FiCamera size={16} />
      </div>

      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </label>


          {/* INFO */}
          <div className="text-center md:text-left">
    <h2 className="text-xl font-bold text-gray-800">
      {user.name || "-"}
    </h2>

    <p className="text-gray-500 text-sm">
      {user.email || "-"}
    </p>
  </div>
</div>

<div className="grid md:grid-cols-2 gap-6 mt-10">

        {/* BIODATA */}
<div className="bg-white rounded-xl shadow p-6">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold text-gray-700">
      Biodata Diri
    </h3>

    <button
      onClick={isEdit ? handleSave : () => setIsEdit(true)}
      className={`text-sm font-medium px-4 py-1.5 rounded-lg transition ${
        isEdit
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "text-blue-600 border border-blue-200 hover:bg-blue-50"
      }`}
    >
      {isEdit ? "Simpan" : "Edit"}
    </button>
  </div>

  <div className="space-y-4 text-sm">
    {/* Nama */}
    <div>
      <p className="text-gray-500 mb-1">
        Nama Lengkap
      </p>

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
        <p className="font-medium">
          {user.name || "-"}
        </p>
      )}
    </div>

    {/* Email */}
    <div>
      <p className="text-gray-500 mb-1">
        Email
      </p>

      <p className="font-medium">
        {user.email || "-"}
      </p>
    </div>

    {/* No Telepon */}
    <div>
      <p className="text-gray-500 mb-1">
        No Telepon
      </p>

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
        <p className="font-medium">
          {user.phone || "-"}
        </p>
      )}
    </div>

    {/* NIK */}
    <div>
      <p className="text-gray-500 mb-1">
        NIK
      </p>

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
        <p className="font-medium">
          {user.nik || "-"}
        </p>
      )}
    </div>

    {/* Tanggal Lahir */}
    <div>
      <p className="text-gray-500 mb-1">
        Tanggal Lahir
      </p>

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
        <p className="font-medium">
          {user.birth || "-"}
        </p>
      )}
    </div>

    {/* Jenis Kelamin */}
    <div>
      <p className="text-gray-500 mb-1">
        Jenis Kelamin
      </p>

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
          <option value="">Pilih</option>
          <option value="Laki-laki">
            Laki-laki
          </option>
          <option value="Perempuan">
            Perempuan
          </option>
        </select>
      ) : (
        <p className="font-medium">
          {user.gender || "-"}
        </p>
      )}
    </div>
  </div>
</div>

{/* KARTU ANGGOTA */}
<div className="bg-white rounded-2xl shadow-md p-6">
  <h3 className="font-semibold text-gray-700 mb-4">
    Kartu Anggota
  </h3>

  <div className="relative rounded-2xl p-6 text-white overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 shadow-lg">
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

    <p className="text-xs opacity-70 mb-1">
      Nomor Anggota
    </p>

    <h2 className="text-2xl font-bold mb-6 tracking-wider">
      {user.member_code ||
        user.id?.slice(0, 8).toUpperCase() ||
        "-"}
    </h2>

    <div className="flex justify-between text-sm">
      <div>
        <p className="opacity-70 text-xs">Nama</p>
        <p className="font-semibold">
          {user.name?.toUpperCase()}
        </p>
      </div>

      <div className="text-right">
        <p className="opacity-70 text-xs">Status</p>
        <p className="font-semibold text-green-300">
          Aktif
        </p>
      </div>
    </div>
  </div>
</div>
</div>

{/* LOGOUT */}
<div className="mt-8">
  <button
    onClick={handleLogout}
    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold shadow transition"
  >
    Keluar
  </button>
      </div>

    </div>
  </div>
);
}