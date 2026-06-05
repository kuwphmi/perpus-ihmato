import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowRight,
  FiCheck,
  FiBookOpen,
  FiClock,
  FiSearch,
  FiUser,
  FiFileText,
  FiGlobe,
} from "react-icons/fi";
import { GiSpellBook } from "react-icons/gi";
import { MdOutlinePalette } from "react-icons/md";
import { LuChefHat } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

export default function ChooseGenre() {
  const navigate = useNavigate();

  const [selectedGenres, setSelectedGenres] = useState([]);

  const genres = [
    {
      name: "Art",
      icon: <MdOutlinePalette />,
      color: "from-pink-500 to-rose-500",
      glow: "shadow-pink-500/30",
    },

    {
      name: "Fantasy",
      icon: <GiSpellBook />,
      color: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/30",
    },

    {
      name: "Romance",
      icon: <FaRegHeart />,
      color: "from-red-500 to-pink-500",
      glow: "shadow-red-500/30",
    },

    {
      name: "Recipe",
      icon: <LuChefHat />,
      color: "from-orange-500 to-amber-500",
      glow: "shadow-orange-500/30",
    },

    {
      name: "Medicine",
      icon: <FaUserDoctor />,
      color: "from-cyan-500 to-sky-500",
      glow: "shadow-cyan-500/30",
    },

    {
      name: "History",
      icon: <FiClock />,
      color: "from-yellow-500 to-orange-500",
      glow: "shadow-yellow-500/30",
    },

    {
      name: "Children",
      icon: <FiBookOpen />,
      color: "from-green-500 to-emerald-500",
      glow: "shadow-green-500/30",
    },

    {
      name: "Religion",
      icon: <FiSearch />,
      color: "from-blue-500 to-indigo-500",
      glow: "shadow-blue-500/30",
    },

    {
      name: "Biograpies",
      icon: < FiUser />,
      color: "from-slate-600 to-slate-800",
      glow: "shadow-slate-500/30",
    },

    {
      name: "Science Fiction",
      icon: <FiGlobe />,
      color: "from-indigo-500 to-blue-600",
      glow: "shadow-indigo-500/30",
    },
  ];

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(
        selectedGenres.filter((g) => g !== genre)
      );
    } else {
      setSelectedGenres([
        ...selectedGenres,
        genre,
      ]);
    }
  };

  const handleContinue = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      alert("User not found");
      return;
    }

    if (!Array.isArray(selectedGenres)) {
      alert("Genres invalid");
      return;
    }

    await axios.post("http://localhost:3000/api/fav-genres", {
      user_id: user.id,
      genres: selectedGenres, // ✅ FIX DI SINI
    });

    navigate("/koleksi");

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Failed save favorite genres");
  }
};

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#eef4ff]
      via-[#f8fbff]
      to-[#edf7ff]
      relative
      overflow-hidden
    "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
        absolute
        top-[-100px]
        right-[-100px]
        w-[350px]
        h-[350px]
        bg-blue-300/30
        rounded-full
        blur-3xl
      "
      />

      <div
        className="
        absolute
        bottom-[-120px]
        left-[-100px]
        w-[320px]
        h-[320px]
        bg-cyan-300/20
        rounded-full
        blur-3xl
      "
      />

      {/* CONTENT */}
      <div
        className="
        relative
        z-10
        max-w-7xl
        mx-auto
        px-6
        py-10
      "
      >
        {/* TOP */}
        <div
          className="
          flex
          items-center
          justify-between
          mb-10
        "
        >
          <div>
            <p
              className="
              text-blue-600
              font-semibold
              text-sm
              tracking-wide
              uppercase
            "
            >
              Personalize Experience
            </p>

            <h1
              className="
              text-4xl
              md:text-5xl
              font-black
              text-gray-900
              leading-tight
              mt-2
            "
            >
              Choose Your
              <br />
              Favorite Genres
            </h1>
          </div>

          {/* PROGRESS */}
          <div
            className="
            hidden
            md:flex
            flex-col
            items-end
          "
          >
            <p className="text-sm text-gray-500 mb-2">
              Setup Progress
            </p>

            <div
              className="
              w-52
              h-3
              bg-white/80
              rounded-full
              overflow-hidden
              shadow-inner
            "
            >
              <div
                className="
                h-full
                bg-gradient-to-r
                from-blue-500
                to-cyan-400
                rounded-full
                transition-all
                duration-500
              "
                style={{
                  width: `${(selectedGenres.length / 3) *
                    100
                    }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* HERO */}
        <div
          className="
          relative
          overflow-hidden
          rounded-[40px]
          bg-gradient-to-br
          from-blue-600
          via-blue-500
          to-cyan-400
          p-10
          md:p-14
          text-white
          mb-10
          shadow-[0_20px_80px_rgba(59,130,246,0.25)]
        "
        >
          {/* FLOATING SHAPES */}
          <div
            className="
            absolute
            top-[-50px]
            right-[-50px]
            w-52
            h-52
            bg-white/10
            rounded-full
          "
          />

          <div
            className="
            absolute
            bottom-[-40px]
            left-[30%]
            w-40
            h-40
            bg-white/10
            rounded-full
          "
          />

          <div className="relative z-10">
            <div
              className="
              inline-flex
              items-center
              px-4
              py-2
              rounded-full
              bg-white/15
              backdrop-blur-md
              text-sm
              font-medium
              mb-6
            "
            >
               Smart Recommendation System
            </div>

            <h2
              className="
              text-4xl
              md:text-6xl
              font-black
              leading-tight
              max-w-3xl
            "
            >
              Tell us what
              books you love.
            </h2>

            <p
              className="
              mt-6
              text-blue-50
              max-w-2xl
              text-[15px]
              leading-relaxed
            "
            >
              Select genres you enjoy and
              we’ll personalize your reading
              experience with recommendations
              tailored specifically to your
              interests.
            </p>
          </div>
        </div>

        {/* SELECTED CHIP */}
        {selectedGenres.length > 0 && (
          <div
            className="
            flex
            flex-wrap
            gap-3
            mb-8
          "
          >
            {selectedGenres.map((genre, i) => (
              <div
                key={i}
                className="
                px-4
                py-2
                rounded-2xl
                bg-white
                shadow-md
                border
                border-blue-100
                text-sm
                font-semibold
                text-gray-700
                flex
                items-center
                gap-2
              "
              >
                <FiCheck className="text-blue-500" />
                {genre}
              </div>
            ))}
          </div>
        )}

        {/* GRID */}
        <div
          className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          gap-6
        "
        >
          {genres.map((genre, i) => {
            const isSelected =
              selectedGenres.includes(
                genre.name
              );

            return (
              <button
                key={i}
                onClick={() =>
                  toggleGenre(
                    genre.name
                  )
                }
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[32px]
                  transition-all
                  duration-300

                  ${isSelected
                    ? `
                        scale-[1.03]
                        shadow-2xl
                        ${genre.glow}
                      `
                    : `
                        hover:-translate-y-2
                      `
                  }
                `}
              >
                {/* CARD */}
                <div
                  className={`
                  relative
                  h-48
                  rounded-[32px]
                  p-6
                  flex
                  flex-col
                  justify-between
                  transition-all
                  duration-300
                  border

                  ${isSelected
                      ? `
                        bg-gradient-to-br
                        ${genre.color}
                        border-transparent
                        text-white
                      `
                      : `
                        bg-white/80
                        backdrop-blur-xl
                        border-white
                       text-blue-600
                        hover:bg-white
                      `
                    }
                `}
                >
                  {/* BG LIGHT */}
                  <div
                    className="
                    absolute
                    top-0
                    right-0
                    w-28
                    h-28
                    bg-white/10
                    rounded-full
                    blur-2xl
                  "
                  />

                  {/* CHECK */}
                  {isSelected && (
                    <div
                      className="
                      absolute
                      top-4
                      right-4
                      w-8
                      h-8
                      rounded-full
                      bg-white
                      text-black
                      flex
                      items-center
                      justify-center
                      shadow-lg
                    "
                    >
                      <FiCheck />
                    </div>
                  )}

                  {/* ICON */}
                  <div
                    className={`
                    text-5xl
                    transition-all
                    duration-300

                    ${isSelected
                        ? "scale-110"
                        : "group-hover:scale-110"
                      }
                  `}
                  >
                    {genre.icon}
                  </div>

                  {/* TEXT */}
                  <div>
                    <p
                      className="
                      font-bold
                      text-lg
                    "
                    >
                      {genre.name}
                    </p>

                    <p
                      className={`
                      text-sm
                      mt-1

                      ${isSelected
                          ? "text-white/80"
                          : "text-gray-500"
                        }
                    `}
                    >
                      Explore collection
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          className="
          mt-12
          rounded-[32px]
          bg-white/80
          backdrop-blur-xl
          border
          border-white
          shadow-xl
          p-7
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-6
        "
        >
          {/* LEFT */}
          <div>
            <h3
              className="
              text-2xl
              font-bold
              text-gray-900
            "
            >
              {selectedGenres.length} Genres
              Selected
            </h3>

            <p
              className="
              text-gray-500
              mt-1
            "
            >
              Select at least 3 genres to
              continue your personalized
              journey.
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleContinue}
            className={`
              px-8
              py-4
              rounded-2xl
              font-semibold
              flex
              items-center
              gap-3
              text-white
              transition-all
              duration-300
              shadow-xl

              ${selectedGenres.length >= 3
                ? `
                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500
                    hover:scale-105
                    hover:shadow-blue-400/40
                  `
                : `
                    bg-gray-300
                    cursor-not-allowed
                    shadow-none
                  `
              }
            `}
          >
            Continue

            <FiArrowRight
              className="
              text-lg
            "
            />
          </button>
        </div>
      </div>
    </div>
  );
}