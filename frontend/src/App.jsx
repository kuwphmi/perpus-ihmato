import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react"; // ✅ TAMBAHIN

import Beranda from "./pages/beranda";
import Login from "./pages/login";
import HalamanUtama from "./pages/halamanutama";
import Koleksi from "./pages/koleksi";
import Belanja from "./pages/belanja";
import Keranjang from "./pages/keranjang";
import Riwayat from "./pages/riwayat";
import Profil from "./pages/profil";
import AdminPerpustakaan from "./pages/admin";

function App() {
  const [cart, setCart] = useState([]); // ✅ STATE GLOBAL

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/halamanutama" element={<HalamanUtama />} />
        <Route path="/koleksi" element={<Koleksi />} />

        {/* ✅ kirim cart ke belanja */}
        <Route path="/belanja" element={<Belanja cart={cart} setCart={setCart} />} />

        {/* ✅ kirim cart ke keranjang */}
        <Route path="/keranjang" element={<Keranjang cart={cart} />} />

        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/admin" element={<AdminPerpustakaan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;