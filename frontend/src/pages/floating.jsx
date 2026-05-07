import mascot from "../assets/mascot.png";
import { useNavigate } from "react-router-dom";

export default function Floating() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Glow effect */}
      <div className="absolute w-32 h-32 rounded-full bg-blue-500 blur-2xl opacity-30 animate-pulse"></div>

      <button
        onClick={() => navigate("/chatai")}
        className="group relative"
      >

        {/* Mascot */}
        <img
          src={mascot}
          alt="Mascot"
          className="w-28 h-28 object-contain drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-active:scale-95"
        />

        {/* Tooltip */}
        <div className="absolute right-28 bottom-10 bg-blue-600 text-white text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
         Hi! Liby can help you ?
        </div>

      </button>
    </div>
  );
}