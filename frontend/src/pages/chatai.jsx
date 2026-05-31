import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png";
import { FiSend, FiArrowLeft } from "react-icons/fi";
export default function ChatAI() {
  const navigate = useNavigate();
  const defaultMessages = [
    {
      role: "bot",
      text: "Hi there! I'm Liby ✨ BOOKIN's digital library assistant. Need help finding books, borrowing, checking history, payments, your profile, orders, or recommendations? Ask in English or Indonesian and I'll answer in the same language.",
    },
  ];

  const loadSavedMessages = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!storedUser?.id) return defaultMessages;
      const saved = localStorage.getItem(`chatHistory_${storedUser.id}`);
      return saved ? JSON.parse(saved) : defaultMessages;
    } catch {
      return defaultMessages;
    }
  };

  const [messages, setMessages] = useState(loadSavedMessages);
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const detectLanguage = (text) => {
    const lower = text.toLowerCase();
    const idWords = ["apa", "saya", "tidak", "bagaimana", "terima", "mau", "yang", "kapan", "dimana", "gimana", "kamu", "kita", "ini", "itu", "lagi"];
    const enWords = ["what", "how", "why", "when", "where", "book", "borrow", "return", "profile", "order", "payment", "help", "recommend", "history"];
    const idCount = idWords.filter((w) => lower.includes(w)).length;
    const enCount = enWords.filter((w) => lower.includes(w)).length;
    return idCount >= enCount ? "id" : "en";
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser?.id) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user?.id]);

  // =========================
  // KIRIM PESAN
  // =========================
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // tampilkan user
    setMessages((prev) => [...prev, { role: "user", text: userMessage }, { role: "bot", text: "..." }]);

    setInput("");

    try {
      // truncate client-side to reduce token usage
      const truncated = userMessage.trim().slice(0, 600);
      const lang = detectLanguage(truncated);

      const res = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: truncated, lang }),
      });

      const data = await res.json();
      const botReply = data?.message?.trim() || (lang === "id" ? "Maaf, saya tidak bisa menjawab itu." : "Sorry, I can't answer that.");

      // replace loading jadi jawaban asli
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: botReply,
        };
        return updated;
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: "Server error 😭",
        };
        return updated;
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f5f7fb]">
      {/* HEADER */}
      <div
        className="
bg-blue-600
text-white
px-4
py-3
flex
items-center
justify-between
shadow-md
"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="
        w-10
        h-10
        rounded-full
        bg-white/10
        hover:bg-white/20
        flex
        items-center
        justify-center
        transition
      "
          >
            <FiArrowLeft className="text-lg" />
          </button>

          {/* AVATAR */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 bg-white shadow">
            <img src={mascot} alt="bot" className="w-full h-full object-cover scale-110" />

            <span
              className="
        absolute
        bottom-0
        right-0
        w-3
        h-3
        bg-green-400
        border-2
        border-white
        rounded-full
        animate-pulse
      "
            ></span>
          </div>

          {/* TEXT */}
          <div>
            <h1 className="font-semibold text-[18px]">Liby</h1>

            <p className="text-xs text-blue-100">Online • Ready to help you</p>
            <p className="text-[11px] text-blue-100/80 max-w-sm mt-1">
              Liby only answers library-related questions: find books, borrow, history, payments, profile, orders, and recommendations. Chat history is saved while you are logged in.
            </p>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`
                max-w-[75%] px-4 py-3 text-sm shadow-sm
                rounded-2xl
                ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-sm" : "bg-white text-gray-700 rounded-bl-sm"}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT */}
      <div className="bg-white border-t px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="
            flex-1 px-4 py-2
            border rounded-full
            bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-blue-300
          "
        />

        <button
          onClick={handleSend}
          className="
            bg-blue-600 text-white
            p-3 rounded-full
            hover:scale-105 active:scale-95
            transition shadow-md
          "
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
