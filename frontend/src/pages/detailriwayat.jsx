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
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* BACK */}
        <Link
          to="/riwayat"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to History
        </Link>

        <div className="mt-8 grid md:grid-cols-2 gap-10">

          {/* COVER */}
          <div className="flex justify-center">

            {book.cover ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                alt={book.title}
                className="w-64 rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-64 h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                No Cover
              </div>
            )}

          </div>

          {/* DETAIL */}
          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Title
              </p>

              <h1 className="text-3xl font-bold text-gray-800">
                {book.title}
              </h1>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Activity
              </p>

              <p className="font-semibold text-blue-600">
                Borrowed
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Borrow Date
              </p>

              <p className="text-gray-700">
                {book.loan_date
                  ? new Date(book.loan_date).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Return Date
              </p>

              <p className="text-gray-700">
                {book.due_date
                  ? new Date(book.due_date).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  book.status === "returned"
                    ? "bg-green-100 text-green-700"
                    : book.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {book.status}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}