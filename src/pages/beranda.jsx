import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";
import { FiDollarSign, FiUser, FiBookOpen, FiShield, FiSearch, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import foto from "../assets/foto1beranda.png";

function Beranda() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("beranda");
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    const handleActiveSection = () => {
      const scrollY = window.scrollY;

      const beranda = document.getElementById("beranda");
      const keunggulan = document.getElementById("keunggulan");
      const cta = document.getElementById("cta");

      if (isClicking) return;

      if (cta && scrollY >= cta.offsetTop - 100) {
        setActiveSection("cta");
      } else if (keunggulan && scrollY >= keunggulan.offsetTop - 100) {
        setActiveSection("keunggulan");
      } else {
        setActiveSection("beranda");
      }
    };

    window.addEventListener("scroll", handleActiveSection);
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      img: banner1,
      title: "Sistem Perpustakaan Modern",
      subtitle: "Kelola buku lebih mudah, cepat, dan efisien",
      anim: "fade-right",
    },
    {
      img: banner2,
      title: "Akses Cepat & Praktis",
      subtitle: "Semua data koleksi dalam satu genggaman",
      anim: "fade-up",
    },
    {
      img: banner3,
      title: "Digital Library",
      subtitle: "Solusi perpustakaan masa depan",
      anim: "fade-left",
    },
  ];

  const features = [
    {
      icon: <FiDollarSign className="text-2xl text-blue-600" />,
      title: "Hemat Biaya Operasional",
      desc: "Kelola perpustakaan tanpa perlu infrastruktur rumit seperti server atau ruang khusus.",
    },
    {
      icon: <FiUser className="text-2xl text-blue-600" />,
      title: "Mudah Digunakan",
      desc: "Dirancang agar sederhana dan nyaman digunakan oleh siapa saja di berbagai perangkat.",
    },
    {
      icon: <FiBookOpen className="text-2xl text-blue-600" />,
      title: "Koleksi Lengkap & Variatif",
      desc: "Beragam pilihan konten tersedia untuk memenuhi kebutuhan bacaanmu.",
    },
    {
      icon: <FiShield className="text-2xl text-blue-600" />,
      title: "Dukungan Penuh & Terpercaya",
      desc: "Didukung oleh tim profesional yang siap membantu kelancaran operasional.",
    },
  ];

  const stats = [
    { value: "10.000+", label: "Koleksi Buku" },
    { value: "5.000+", label: "Pengguna Aktif" },
    { value: "200+", label: "Perpustakaan" },
    { value: "99%", label: "Kepuasan Pengguna" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white shadow-md border-b border-gray-100" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            <span className={`font-bold text-base tracking-tight ${scrolled ? "text-blue-700" : "text-white"}`}>BukuIn</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Beranda", "Keunggulan", "Mulai Gratis"].map((item, i) => (
              <a
                key={i}
                href={item === "Keunggulan" ? "#keunggulan" : item === "Mulai Gratis" ? "#cta" : "#"}
                onClick={(e) => {
                  e.preventDefault();
                  setIsClicking(true);

                  if (item === "Beranda") {
                    document.getElementById("beranda")?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection("beranda");
                  }

                  if (item === "Keunggulan") {
                    document.getElementById("keunggulan")?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection("keunggulan");
                  }

                  if (item === "Mulai Gratis") {
                    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection("cta");
                  }

                  setTimeout(() => {
                    setIsClicking(false);
                  }, 500);
                }}
                className={`text-sm font-medium transition-colors ${
                  item === "Beranda"
                    ? activeSection === "beranda"
                      ? "text-blue-600 font-semibold"
                      : scrolled
                        ? "text-gray-600 hover:text-blue-600"
                        : "text-white/80 hover:text-white"
                    : item === "Keunggulan"
                      ? activeSection === "keunggulan"
                        ? "text-blue-600 font-semibold"
                        : scrolled
                          ? "text-gray-600 hover:text-blue-600"
                          : "text-white/80 hover:text-white"
                      : item === "Mulai Gratis"
                        ? activeSection === "cta"
                          ? "text-blue-600 font-semibold"
                          : scrolled
                            ? "text-gray-600 hover:text-blue-600"
                            : "text-white/80 hover:text-white"
                        : scrolled
                          ? "text-gray-600 hover:text-blue-600"
                          : "text-white/80 hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}
            <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-200">
              Login
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-all">
              Login
            </button>
            <button onClick={() => setMenuOpen(true)} className={`text-2xl ${scrolled ? "text-gray-700" : "text-white"}`}>
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="bg-white h-full w-72 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <img src={logo} className="w-8 h-8 object-contain" />
              <span className="font-bold text-blue-700">BukuIn</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-2xl text-gray-500">
              <FiX />
            </button>
          </div>

          <div className="flex flex-col gap-1 px-4 py-6">
            {["Beranda", "Keunggulan", "Mulai Gratis"].map((item, i) => (
              <a
                key={i}
                href={item === "Keunggulan" ? "#keunggulan" : item === "Mulai Gratis" ? "#cta" : "#"}
                onClick={() => {
                  setMenuOpen(false);

                  if (item === "Beranda") setActiveSection("beranda");
                  if (item === "Keunggulan") setActiveSection("keunggulan");
                  if (item === "Mulai Gratis") setActiveSection("cta");
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                  item === "Beranda" && activeSection === "beranda"
                    ? "text-blue-600 bg-blue-50"
                    : item === "Keunggulan" && activeSection === "keunggulan"
                      ? "text-blue-600 bg-blue-50"
                      : item === "Mulai Gratis" && activeSection === "cta"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="px-4 mt-auto pb-8">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-full font-medium text-sm transition"
            >
              Login
            </button>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 bg-black/40" onClick={() => setMenuOpen(false)} />
      </div>

      {/* HERO */}
      <div id="beranda" className="relative w-full h-screen overflow-hidden">
        <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="min-w-full relative h-full">
              <img src={slide.img} className="w-full h-full object-cover" alt={slide.title} />
              <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div data-aos={slide.anim}>
                  <p className="text-blue-300 text-sm font-medium tracking-widest uppercase mb-3">Perpustakaan Digital</p>
                  <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{slide.title}</h1>
                  <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto">{slide.subtitle}</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all">
                      <FiSearch className="text-base" /> Cari Buku
                    </button>
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 border border-white/60 hover:bg-white/10 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all">
                      Daftar Sekarang <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-blue-400" : "w-2 bg-white/40"}`} />
          ))}
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full z-10 hidden md:block">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-white z-10 md:hidden" />
      </div>

      {/* STATS */}
      <div className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FITUR */}
      <div id="keunggulan" className="bg-blue-50 py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-2">Mengapa BukuIn?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Digitalisasi Mudah untuk <br className="hidden md:block" /> Perpustakaanmu
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">Kami hadir untuk mempermudah pengelolaan perpustakaan secara digital, efisien, dan modern.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right" className="flex justify-center">
              <img src={foto} alt="preview" className="w-64 md:w-80 h-80 md:h-96 object-cover rounded-3xl shadow-xl" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div id="cta" className="bg-blue-700 py-16 px-6 text-center" data-aos="fade-up">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Siap Digitalisasi Perpustakaanmu?</h2>
        <p className="text-blue-200 text-sm mb-7 max-w-md mx-auto">Bergabunglah bersama ribuan perpustakaan yang telah mempercayai BukuIn.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate("/")} className="bg-white hover:bg-blue-50 active:scale-95 text-blue-700 font-semibold px-7 py-2.5 rounded-full text-sm transition-all">
            Mulai Gratis
          </button>
          <button className="border border-white/50 hover:bg-white/10 text-white font-medium px-7 py-2.5 rounded-full text-sm transition-all">Pelajari Lebih Lanjut</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-7 h-7 object-contain opacity-80" />
            <span className="font-bold text-blue-400">BukuIn</span>
          </div>
          <p className="text-xs text-gray-500 text-center">© {new Date().getFullYear()} BukuIn. Semua hak dilindungi.</p>
          <div className="flex gap-5 text-xs text-gray-400">
            <a href="#" className="hover:text-white transition">
              Kebijakan Privas1
            </a>
            <a href="#" className="hover:text-white transition">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Beranda;
