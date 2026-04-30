import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Genre from "./pages/Genre";


function App() {
  const [cart, setCart] = useState([]); // ✅ STATE GLOBAL

  const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.nik || !user?.birth || !user?.gender) {
    return <Navigate to="/lengkapi-profil" />;
  }

  return children;
};

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<Profil />} />
        <Route
          path="/halamanutama"
          element={
            <ProtectedRoute>
              <HalamanUtama />
            </ProtectedRoute>
          }
        />

        <Route
          path="/koleksi"
          element={
            <ProtectedRoute>
              <Koleksi />
            </ProtectedRoute>
          }
        />

        <Route
          path="/belanja"
          element={
            <ProtectedRoute>
              <Belanja cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/keranjang"
          element={
            <ProtectedRoute>
              <Keranjang cart={cart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <Riwayat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminPerpustakaan />} />
        <Route path="/genre/:name" element={<Genre />} />
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;