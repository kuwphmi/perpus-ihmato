import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png";
import {
  FiSend,
  FiArrowLeft,
} from "react-icons/fi";
export default function ChatAI() {
  const navigate = useNavigate();
const [messages, setMessages] = useState([
  { 
    role: "bot", 
    text: "Hi there! I'm Liby ✨ Your digital librarian. Looking for a specific book or need help with your order? I'm here to help!" 
  },
]);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
  chatEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  // =========================
  // KIRIM PESAN
  // =========================
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // tampilkan user
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
      { role: "bot", text: "..." },]);

    setInput("");

    try {
      const res = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await res.json();

      // replace loading jadi jawaban asli
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: data.message,
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
<div className="
bg-blue-600
text-white
px-4
py-3
flex
items-center
justify-between
shadow-md
">

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

      <img
        src={mascot}
        alt="bot"
        className="w-full h-full object-cover scale-110"
      />

      <span className="
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
      "></span>

    </div>

    {/* TEXT */}
    <div>

      <h1 className="font-semibold text-[18px]">
        Liby
      </h1>

      <p className="text-xs text-blue-100">
        Online • Ready to help you
      </p>

    </div>

  </div>

</div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >

            <div
              className={`
                max-w-[75%] px-4 py-3 text-sm shadow-sm
                rounded-2xl
                ${msg.role === "user"
  ? "bg-blue-500 text-white rounded-br-sm"
  : "bg-white text-gray-700 rounded-bl-sm"
}
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