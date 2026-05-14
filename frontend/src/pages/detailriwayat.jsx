import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function DetailRiwayat() {

  const { id } = useParams();

  const [book, setBook] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {

      const res = await fetch(
        `${API_BASE}/history/detail/${id}`
      );

      const data = await res.json();

      setBook(data);

    } catch (err) {
      console.error(err);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100">

    {/* HEADER */}
    {/* HEADER */}
<div className="bg-blue-600 text-white px-5 py-2.5 shadow-md">

  <div className="w-full flex items-center gap-3 relative">

    {/* BACK BUTTON */}
    <Link
      to="/riwayat"
      className="
        w-9
        h-9
        rounded-full
        bg-white/10
        hover:bg-white/20
        flex
        items-center
        justify-center
        transition
      "
    >
      ←
    </Link>

    {/* TITLE */}
    <div>

      <h1 className="text-[20px] font-semibold leading-tight">
        Book Details
      </h1>
      

    </div>

  </div>

</div>

    {/* CONTENT */}
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

      <div
        className="
          bg-white
          rounded-[32px]
          shadow-xl
          border
          border-gray-100
          overflow-hidden
        "
      >

        <div className="grid md:grid-cols-2 gap-0">

          {/* LEFT */}
          <div
            className="
              bg-gradient-to-br
              from-blue-50
              to-blue-100
              flex
              items-center
              justify-center
              p-8
            "
          >

            {book.cover ? (

              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                alt={book.title}
                className="
                  w-56
                  md:w-72
                  rounded-3xl
                  shadow-2xl
                  hover:scale-105
                  transition
                  duration-300
                "
              />

            ) : (

              <div
                className="
                  w-56
                  h-80
                  bg-white
                  rounded-3xl
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  shadow-lg
                "
              >
                No Cover
              </div>

            )}

          </div>

          {/* RIGHT */}
          <div className="p-6 md:p-10 space-y-6">

            {/* TITLE */}
            <div>

              <p className="text-sm text-gray-400 uppercase tracking-wide">
                Book Title
              </p>

              <h1
                className="
                  text-2xl
                  md:text-4xl
                  font-bold
                  text-gray-800
                  leading-tight
                  mt-2
                "
              >
                {book.title}
              </h1>

            </div>

            {/* STATUS */}
            <div>

              <p className="text-sm text-gray-400 mb-2">
                Status
              </p>

              <span
                className={`
                  inline-flex
                  items-center
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold

                  ${
                    book.status === "returned"
                      ? "bg-green-100 text-green-700"
                      : book.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {book.status}
              </span>

            </div>

            {/* INFO CARD */}
            <div className="grid gap-4">

              <div className="bg-gray-50 rounded-2xl p-4">

                <p className="text-sm text-gray-400">
                  Borrow Date
                </p>

                <p className="font-semibold text-gray-700 mt-1">
                  {book.loan_date
                    ? new Date(book.loan_date).toLocaleDateString("id-ID")
                    : "-"}
                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-4">

                <p className="text-sm text-gray-400">
                  Return Date
                </p>

                <p className="font-semibold text-gray-700 mt-1">
                  {book.due_date
                    ? new Date(book.due_date).toLocaleDateString("id-ID")
                    : "-"}
                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-4">

                <p className="text-sm text-gray-400">
                  Activity
                </p>

                <p className="font-semibold text-blue-600 mt-1">
                  Borrowed Book
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
); }