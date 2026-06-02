import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";
import { FiTrendingDown, FiUser, FiBookOpen, FiShield, FiSearch, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import foto from "../assets/foto1beranda.png";

function Beranda() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
    const timeout = setTimeout(() => setIsLoading(false), 300);
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleActiveSection = () => {
      const scrollY = window.scrollY;
      const benefits = document.getElementById("benefits");
      const cta = document.getElementById("cta");

      if (isClicking) return;

      if (cta && scrollY >= cta.offsetTop - 120) {
        setActiveSection("cta");
      } else if (benefits && scrollY >= benefits.offsetTop - 120) {
        setActiveSection("benefits");
      } else {
        setActiveSection("dashboard");
      }
    };

    window.addEventListener("scroll", handleActiveSection);
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, [isClicking]);

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
      title: "Modern Library Management",
      subtitle: "Manage books, loans, and users in one polished platform.",
      anim: "fade-right",
    },
    {
      img: banner2,
      title: "Fast & Practical Access",
      subtitle: "Give your library staff and members a smooth digital experience.",
      anim: "fade-up",
    },
    {
      img: banner3,
      title: "Smart Library Workflow",
      subtitle: "Transform your library operations with intuitive tools.",
      anim: "fade-left",
    },
  ];

  const features = [
    {
      icon: <FiTrendingDown className="text-2xl text-white" />,
      title: "Cost-Effective Operations",
      desc: "Manage your library without complicated infrastructure such as servers or dedicated rooms.",
    },
    {
      icon: <FiUser className="text-2xl text-white" />,
      title: "Easy to Use",
      desc: "Designed to be simple and comfortable for everyone across multiple devices.",
    },
    {
      icon: <FiBookOpen className="text-2xl text-white" />,
      title: "Complete & Diverse Collection",
      desc: "A wide variety of content is available to meet your reading needs.",
    },
    {
      icon: <FiShield className="text-2xl text-white" />,
      title: "Reliable Full Support",
      desc: "Supported by a professional team ready to assist your operations smoothly.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Book Collections" },
    { value: "5,000+", label: "Active Users" },
    { value: "200+", label: "Libraries" },
    { value: "99%", label: "User Satisfaction" },
  ];

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-white font-sans">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-center p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Loading BookIn...</p>
          </div>
        </div>
      )}
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition duration-200 ease-out ${scrolled ? "bg-white shadow-md border-b border-gray-100" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="BookIn logo" className="w-12 h-12 object-contain" />
            <div>
              <p className={`font-bold text-base tracking-tight ${scrolled ? "text-blue-700" : "text-white"}`}>BookIn</p>
              <p className={`text-xs ${scrolled ? "text-slate-500" : "text-white/80"}`}>Smart Library</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Home", id: "dashboard" },
              { label: "Benefits", id: "benefits" },
              { label: "Get Started", id: "cta" },
            ].map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIsClicking(true);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveSection(item.id);
                  setTimeout(() => setIsClicking(false), 500);
                }}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id ? (scrolled ? "text-blue-700 font-semibold" : "text-white font-semibold") : scrolled ? "text-gray-600 hover:text-blue-700" : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/login")}
              className={`${scrolled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-blue-700 hover:bg-slate-100"} active:scale-95 text-sm font-medium px-5 py-2 rounded-full transition-all duration-200`}
            >
              Login
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => navigate("/login")} className={`${scrolled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-blue-700 hover:bg-slate-100"} text-xs font-medium px-4 py-1.5 rounded-full transition-all`}>
              Login
            </button>
            <button onClick={() => setMenuOpen(true)} className={`text-2xl ${scrolled ? "text-blue-700" : "text-white"}`}>
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
              <span className="font-bold text-blue-700"></span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-2xl text-gray-500">
              <FiX />
            </button>
          </div>

          <div className="flex flex-col gap-1 px-4 py-6">
            {[
              { label: "Home", id: "dashboard" },
              { label: "Benefits", id: "benefits" },
              { label: "Get Started", id: "cta" },
            ].map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveSection(item.id);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition ${activeSection === item.id ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {item.label}
              </button>
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
      <section id="dashboard" className="relative overflow-hidden min-h-screen flex items-center justify-center pt-20 md:pt-0">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={slides[currentSlide].img} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-10 text-center py-12">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <img src={logo} alt="BookIn" className="w-6 h-6 md:w-8 md:h-8" />
            <span className="uppercase tracking-[0.35em] text-xs text-white font-semibold inline-block">Modern Library Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 md:mb-6">Build a smarter, faster library experience.</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed mb-6 md:mb-10 max-w-2xl mx-auto">BookIn brings your collection, members, and loan workflow into one polished interface designed for modern libraries.</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-slate-100 active:scale-95 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all"
            >
              Get Started
            </button>
            <button
              onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 border border-white/40 hover:border-white hover:bg-white/10 active:scale-95 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full z-20 hidden md:block">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-6 sm:h-8 bg-white z-20 md:hidden" />
      </section>

      {/* STATS */}
      <div className="bg-linear-to-b from-white to-blue-50 py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Libraries Worldwide</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">BookIn is powering modern library management across institutions of all sizes</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((s, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="group text-center">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-blue-100">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">{s.value}</p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="benefits" className="bg-white py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <p className="text-blue-600 text-xs sm:text-sm font-bold tracking-widest uppercase mb-3">Why BookIn?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Easy Digitization for <br className="hidden md:block" /> Your Library
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">We are here to simplify digital library management in a modern and efficient way.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right" className="flex justify-center">
              <img src={foto} alt="preview" className="w-64 md:w-80 h-80 md:h-96 object-cover rounded-3xl shadow-xl" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="bg-linear-to-br from-blue-50 to-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 text-white">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section id="cta" className="bg-blue-600 py-20 md:py-28 px-6 text-center" data-aos="fade-up">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Ready to simplify your library operations?</h2>
          <p className="text-blue-100 text-base md:text-lg mb-10 leading-relaxed">Start using BookIn today for faster loans, better inventory control, and happier readers.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate("/login")} className="bg-white hover:bg-slate-100 active:scale-95 text-blue-700 font-semibold px-7 py-3 rounded-full text-sm transition-all">
              Start for Free
            </button>
            <button onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })} className="border border-white/30 hover:border-blue-200 text-white px-7 py-3 rounded-full text-sm font-medium transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <img src={logo} alt="BookIn logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">BookIn</p>
              <p className="text-xs text-slate-400">Modern Library Platform</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">© {new Date().getFullYear()} BookIn. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-400">
            <button type="button" onClick={() => navigate("/privacy")} className="hover:text-white transition">
              Privacy Policy
            </button>
            <button type="button" onClick={() => navigate("/terms")} className="hover:text-white transition">
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Beranda;
