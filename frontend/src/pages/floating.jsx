import mascot from "../assets/mascot.png";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import { useRef, useState, useEffect } from "react";

export default function Floating() {

  const navigate = useNavigate();
  const nodeRef = useRef(null);

  const [dragging, setDragging] = useState(false);

  // posisi default
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  // ambil posisi tersimpan
  useEffect(() => {

    const saved = localStorage.getItem("floating-position");

    if (saved) {

      setPosition(JSON.parse(saved));

    } else {

      // posisi awal mobile biar gak ketiban navbar
      setPosition({
        x: 0,
        y: -80,
      });

    }

  }, []);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="body"
      position={position}

      onStart={() => setDragging(false)}

      onDrag={(e, data) => {

        setDragging(true);

        setPosition({
          x: data.x,
          y: data.y,
        });

      }}

      onStop={(e, data) => {

        const newPos = {
          x: data.x,
          y: data.y,
        };

        setPosition(newPos);

        // simpan posisi
        localStorage.setItem(
          "floating-position",
          JSON.stringify(newPos)
        );

      }}
    >

      <div
        ref={nodeRef}
        className="
          fixed
          bottom-24
          md:bottom-6
          right-4
          md:right-6
          z-40
          cursor-grab
          active:cursor-grabbing
        "
      >

        {/* Glow */}
        <div className="absolute w-32 h-32 rounded-full bg-blue-500 blur-2xl opacity-30 animate-pulse"></div>

        {/* Wrapper */}
        <div className="group relative select-none">

          {/* Mascot */}
          <img
            src={mascot}
            alt="Mascot"
            draggable={false}
            onClick={() => {

              // kalau bukan drag baru buka AI
              if (!dragging) {

                navigate("/chatai");

              }

            }}
            className="
              w-20 h-20
              md:w-28 md:h-28
              object-contain
              drop-shadow-2xl
              transition-all
              duration-300
              group-hover:scale-110
              active:scale-95
            "
          />

          {/* Tooltip */}
          <div className="
            absolute
            right-20
            md:right-28
            bottom-8
            md:bottom-10
            bg-blue-600
            text-white
            text-xs
            px-3
            py-2
            rounded-xl
            opacity-0
            group-hover:opacity-100
            transition
            whitespace-nowrap
            shadow-lg
          ">
            Hi! Liby can help you ?
          </div>

        </div>

      </div>

    </Draggable>
  );
}