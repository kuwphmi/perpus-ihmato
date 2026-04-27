import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FiHome,
  FiBook,
  FiShoppingCart,
  FiClock,
  FiCamera,
} from "react-icons/fi";

export default function Profil() {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [user, setUser] = useState({
    name: "REVANDA AVRILLITA RIZKY",
    username: "112045240200829693377",
    email: "rizkyavrillita@gmail.com",
    birth: "",
    gender: "",
  });

  // upload foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-28 scroll-smooth">

      {/* HEADER */}
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
        className="px-3 py-1 rounded-md transition-all duration-200 
        hover:text-blue-200 hover:bg-white/10"
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

      {/* PROFILE */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">

          {/* FOTO */}
          <div className="relative">
            <label className="cursor-pointer">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg bg-blue-200 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">R</span>
                )}
              </div>

              {/* ICON CAMERA */}
              <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white">
                <FiCamera size={16} />
              </div>

              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* INFO */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm">
              {user.email}
            </p>
          </div>

        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* BIODATA */}
          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">
                Biodata Diri
              </h3>
              <button
                onClick={() => setIsEdit(!isEdit)}
                className="text-blue-600 text-sm"
              >
                {isEdit ? "Simpan" : "Edit"}
              </button>
            </div>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-gray-500">Nama Lengkap</p>
                {isEdit ? (
                  <input
                    value={user.name}
                    onChange={(e) =>
                      setUser({ ...user, name: e.target.value })
                    }
                    className="border rounded px-3 py-1 w-full"
                  />
                ) : (
                  <p>{user.name}</p>
                )}
              </div>

              <div>
                <p className="text-gray-500">Username</p>
                <p>{user.username}</p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>

              <div>
                <p className="text-gray-500">Tanggal Lahir</p>
                {isEdit ? (
                  <input
                    type="date"
                    value={user.birth}
                    onChange={(e) =>
                      setUser({ ...user, birth: e.target.value })
                    }
                    className="border rounded px-3 py-1 w-full"
                  />
                ) : (
                  <p>{user.birth || "-"}</p>
                )}
              </div>

              <div>
                <p className="text-gray-500">Jenis Kelamin</p>
                {isEdit ? (
                  <select
                    value={user.gender}
                    onChange={(e) =>
                      setUser({ ...user, gender: e.target.value })
                    }
                    className="border rounded px-3 py-1 w-full"
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                ) : (
                  <p>{user.gender || "-"}</p>
                )}
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">

{/* Kartu */}
  <h3 className="font-semibold text-gray-700 mb-4">
    Kartu Anggota
  </h3>

  <div className="relative rounded-2xl p-6 text-white overflow-hidden
                  bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800
                  shadow-[0_10px_30px_rgba(0,0,0,0.25)]">

    {/* Glow effect */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

    {/* Content */}
    <p className="text-sm opacity-80">Nomor Anggota</p>
    <h2 className="text-2xl font-bold mb-4 tracking-wider">
      235487456
    </h2>

    <div className="flex justify-between text-sm">
      <div>
        <p className="opacity-80">Nama</p>
        <p className="font-semibold">
          {user.name}
        </p>
      </div>

      <div>
        <p className="opacity-80">Status</p>
        <p className="font-semibold text-green-300">
          Aktif
        </p>
      </div>
    </div>

  </div>

</div>

        </div>

        {/* LOGOUT */}
        <div className="mt-10">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold shadow hover:bg-red-600 transition"
          >
            Keluar
          </button>
        </div>

      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-blue-600 text-white flex justify-around py-3 rounded-xl shadow-lg z-50">
        <Link to="/halamanutama"><FiHome size={24} /></Link>
        <Link to="/koleksi"><FiBook size={24} /></Link>
        <Link to="/belanja"><FiShoppingCart size={24} /></Link>
        <Link to="/riwayat"><FiClock size={24} /></Link>
      </div>

    </div>
  );
}