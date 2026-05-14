import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import Beranda from "./pages/beranda";
import Login from "./pages/login";
import Koleksi from "./pages/koleksi";
import Belanja from "./pages/belanja";
import Keranjang from "./pages/keranjang";
import Riwayat from "./pages/riwayat";
import Profil from "./pages/profil";
import AdminPerpustakaan from "./pages/admin";
import Genre from "./pages/Genre";
import ChatAI from "./pages/chatai";
import Floating from "./pages/floating";
import Favorit from "./pages/favorite";
import Notifications from "./pages/notifikasi";


import GoogleSuccess from "./pages/googlesuccess";
import SearchPage from "./pages/searchpage";
import ResetPassword from "./pages/ResetPassword";
import Notip from "./pages/notip";
import Trackingbuku from "./pages/trackingbuku";
import HelpCenter from "./pages/helpcenter";
import Checkout from "./pages/checkout";
import DetailRiwayat from "./pages/detailriwayat";


function AppWrapper() {
  const [cart, setCart] = useState([]);

  const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.nik || !user?.birth || !user?.gender) {
      return <Navigate to="/profil" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <MainApp cart={cart} setCart={setCart} ProtectedRoute={ProtectedRoute} />
    </BrowserRouter>
  );
}

function MainApp({ cart, setCart, ProtectedRoute }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/login" element={<Login />} />

        <Route path="/google-success" element={<GoogleSuccess />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/trackingbuku"
          element={
            <ProtectedRoute>
              <Trackingbuku />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpcenter"
          element={
            <ProtectedRoute>
              <HelpCenter />
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
        <Route path="/checkout" element={<Checkout />} />

        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <Riwayat />
            </ProtectedRoute>
          }
        />


        <Route path="/detail-riwayat/:id" element={<DetailRiwayat />} />
      

        <Route path="/profil" element={<Profil />} />

        <Route
          path="/chatai"
          element={
            <ProtectedRoute>
              <ChatAI />
            </ProtectedRoute>
          }
        />


        <Route

          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/favorite"
          element={
            <ProtectedRoute>
              <Favorit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notip"

          element={
            <ProtectedRoute>
              <Notip />
            </ProtectedRoute>
          }
        />

        <Route path="/search" element={<SearchPage />} />

        <Route path="/admin" element={<AdminPerpustakaan />} />
        <Route path="/genre/:name" element={<Genre />} />
      </Routes>

      {location.pathname === "/koleksi" && (
        <Floating onClick={() => navigate("/chatai")} />

      )}
    </>
  );
}

export default AppWrapper;
