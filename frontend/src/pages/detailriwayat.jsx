import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function DetailRiwayat() {

  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [showReceipt, setShowReceipt] =
    useState(false);

  const storedUser =
    localStorage.getItem("user");

  const user =
    storedUser
      ? JSON.parse(storedUser)
      : null;


  const API_BASE =
    import.meta.env
      .VITE_API_BASE_URL ||
    "http://localhost:3000/api";

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
      console.log(data);

    } catch (err) {

      console.error(err);

    }

  };

  const handlePrint = () => {

    const printWindow =
      window.open("", "_blank");

    printWindow.document.write(`
      <html>

        <head>
          <title>BukuIn Receipt</title>
        </head>

        <body style="
          font-family:sans-serif;
          padding:30px;
        ">

          <h1>
            BukuIn Receipt
          </h1>

          <hr/>

          <p>
            <strong>Book:</strong>
            ${book.title}
          </p>

          <p>
            <strong>Receipt:</strong>
            ${book.receipt_code || "-"}
          </p>

          <p>
            <strong>Status:</strong>
            ${book.status}
          </p>

          <p>
            <strong>Borrow Date:</strong>
            ${book.loan_date
        ? new Date(
          book.loan_date
        ).toLocaleDateString(
          "id-ID"
        )
        : "-"
      }
          </p>

          <p>
            <strong>Due Date:</strong>
            ${book.due_date
        ? new Date(
          book.due_date
        ).toLocaleDateString(
          "id-ID"
        )
        : "-"
      }
          </p>

        </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.print();

  };

  // INI PENTING
  if (!book) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-gray-500
      ">
        Loading...
      </div>
    );

  }

  return (

    <div className="
      min-h-screen
      bg-gray-100
    ">

      {/* HEADER */}
      <div className="
        bg-blue-600
        text-white
        px-5
        py-2.5
        shadow-md
      ">

        <div className="
          w-full
          flex
          items-center
          gap-3
        ">

          {/* BACK */}
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

          <h1 className="
            text-[20px]
            font-semibold
          ">
            Book Details
          </h1>

        </div>

      </div>

      {/* CONTENT */}
      <div className="
        max-w-6xl
        mx-auto
        px-4
        md:px-6
        py-8
      ">

        <div className="
          bg-white
          rounded-[32px]
          shadow-xl
          border
          border-gray-100
          overflow-hidden
        ">

          <div className="
            grid
            md:grid-cols-2
          ">

            {/* LEFT */}
            <div className="
                bg-gradient-to-br
                from-blue-50
                to-blue-100
                flex
                items-center
                justify-center
                p-8
              ">

              {book.cover ? (

              <img
                src={book.cover}
                alt={book.title}
                className="
                  w-56
                  md:w-72
                  rounded-3xl
                  shadow-2xl
                "
              />

              ) : (

                <div className="
                  w-56
                  h-80
                  bg-white
                  rounded-3xl
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  shadow-lg
                ">
                  No Cover
                </div>

              )}

            </div>

            {/* RIGHT */}
            <div className="
              p-6
              md:p-10
              space-y-6
            ">

              {/* TITLE */}
              <div>

                <p className="
                  text-sm
                  text-gray-400
                  uppercase
                ">
                  Book Title
                </p>

                <h1 className="
                  text-2xl
                  md:text-4xl
                  font-bold
                  text-gray-800
                  mt-2
                ">
                  {book.title}
                </h1>

              </div>

              {/* STATUS */}
              <div>

                <p className="text-sm text-gray-400 mb-2">
                  Status
                </p>

                <div className="
                  flex
                  items-center
                  gap-3
                  flex-wrap
                ">

                  {/* STATUS BADGE */}
                  <span
                    className={`
                    inline-flex
                    items-center
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold

        ${book.status === "returned"
                        ? "bg-green-100 text-green-700"
                        : book.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }
      `}
                  >
                    {book.status}
                  </span>

                  {/* RECEIPT BUTTON */}
                  <button
                    onClick={() =>
                      setShowReceipt(true)
                    }
                    className="
        px-4
        py-2
        rounded-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        text-sm
        font-medium
        transition
        shadow-md
      "
                  >

                    Receipt

                  </button>

                </div>

              </div>

              {/* INFO CARD */}
              <div className="grid gap-4">

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-sm text-gray-400">
                    Borrow Date</p>

                  {/* STATUS */}
                  <div>

                    <p className="
                  text-sm
                  text-gray-400
                  mb-2
                ">
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

                    ${book.status ===
                          "returned"
                          ? "bg-green-100 text-green-700"
                          : book.status ===
                            "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }
                  `}
                    >
                      {book.status}
                    </span>

                  </div>

                  {/* INFO */}
                  <div className="
                grid
                gap-4
              ">

                    <div className="
                  bg-gray-50
                  rounded-2xl
                  p-4
                ">
                      <p className="
                    text-sm
                    text-gray-400
                  ">
                        Borrow Date
                      </p>

                      <p className="
                    font-semibold
                    text-gray-700
                    mt-1
                  ">
                        {book.loan_date
                          ? new Date(
                            book.loan_date
                          ).toLocaleDateString(
                            "id-ID"
                          )
                          : "-"}
                      </p>
                    </div>

                    <div className="
                  bg-gray-50
                  rounded-2xl
                  p-4
                ">
                      <p className="
                    text-sm
                    text-gray-400
                  ">
                        Due Date
                      </p>

                      <p className="
                    font-semibold
                    text-gray-700
                    mt-1
                  ">
                        {book.due_date
                          ? new Date(
                            book.due_date
                          ).toLocaleDateString(
                            "id-ID"
                          )
                          : "-"}
                      </p>
                    </div>

                    <div className="
                  bg-gray-50
                  rounded-2xl
                  p-4
                ">
                      <p className="
                    text-sm
                    text-gray-400
                  ">
                        Returned At
                      </p>

                      <p className="
                    font-semibold
                    text-gray-700
                    mt-1
                  ">
                        {book.return_date
                          ? new Date(
                            book.return_date
                          ).toLocaleDateString(
                            "id-ID"
                          )
                          : "Not Returned Yet"}
                      </p>
                    </div>

                    <div className="
                  bg-gray-50
                  rounded-2xl
                  p-4
                ">
                      <p className="
                    text-sm
                    text-gray-400
                  ">
                        Receipt Code
                      </p>

                      <p className="
                    font-semibold
                    text-blue-700
                    mt-1
                    tracking-wide
                  ">
                        {book.receipt_code || "-"}
                      </p>
                    </div>

                    <div className="
                  bg-gray-50
                  rounded-2xl
                  p-4
                ">
                      <p className="
                    text-sm
                    text-gray-400
                  ">
                        Activity
                      </p>

                      <p className="
                    font-semibold
                    text-blue-600
                    mt-1
                  ">
                        Borrowed Book
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
        {/* RECEIPT MODAL */}
        {showReceipt && (

          <div
            onClick={() =>
              setShowReceipt(false)
            }
            className="
    fixed
    inset-0
    z-[999]
    bg-black/50
    backdrop-blur-sm
    flex
    items-center
    justify-center
    p-4
  "
          >

            <div className="
      bg-white
      w-[340px]
      max-w-full
      shadow-2xl
      rounded-2xl
      overflow-hidden
      animate-[fadeIn_.2s_ease]
      font-mono
    ">

              {/* TOP */}
              <div className="
        px-6
        pt-6
        text-center
      ">

                <h1 className="
          text-2xl
          font-bold
          tracking-widest
          text-black
        ">

                  BOOKIN

                </h1>

                <p className="
          text-[11px]
          text-gray-500
          mt-1
        ">

                  DIGITAL LIBRARY RECEIPT

                </p>

              </div>

              {/* DASH */}
              <div className="
        border-t
        border-dashed
        my-5
      " />

              {/* CONTENT */}
              <div className="
        px-6
        space-y-4
        text-[13px]
      ">

                {/* NAME */}
                <div className="
          flex
          justify-between
          gap-4
        ">

                  <span className="text-gray-500">
                    NAME
                  </span>

                  <span className="
            text-right
            font-semibold
            text-black
          ">

                    {user?.name || "-"}

                  </span>

                </div>

                {/* BOOK */}
                <div className="
          flex
          justify-between
          gap-4
        ">

                  <span className="text-gray-500">
                    BOOK
                  </span>

                  <span className="
            text-right
            font-semibold
            text-black
          ">

                    {book.title}

                  </span>

                </div>

                {/* STATUS */}
                <div className="
          flex
          justify-between
        ">

                  <span className="text-gray-500">
                    STATUS
                  </span>

                  <span className="
            font-bold
            uppercase
            text-black
          ">

                    {book.status}

                  </span>

                </div>

                {/* BORROW */}
                <div className="
          flex
          justify-between
        ">

                  <span className="text-gray-500">
                    BORROW
                  </span>

                  <span className="font-semibold">

                    {book.loan_date
                      ? new Date(
                        book.loan_date
                      ).toLocaleDateString("id-ID")
                      : "-"}

                  </span>

                </div>

                {/* RETURN */}
                <div className="
          flex
          justify-between
        ">

                  <span className="text-gray-500">
                    RETURN
                  </span>

                  <span className="font-semibold">

                    {book.due_date
                      ? new Date(
                        book.due_date
                      ).toLocaleDateString("id-ID")
                      : "-"}

                  </span>

                </div>

              </div>

              {/* DASH */}
              <div className="
        border-t
        border-dashed
        my-5
      " />

              {/* THANKYOU */}
              <div className="
        px-6
        text-center
      ">

                <p className="
          text-[12px]
          text-gray-500
        ">

                  Thank you for borrowing books

                </p>

                <p className="
          text-[11px]
          text-gray-400
          mt-1
        ">

                  www.bookin-library.com

                </p>

              </div>


              {/* FOOTER */}
              <div className="
        border-t
        px-5
        py-4
        flex
        gap-3
      ">

                <button
                  onClick={() =>
                    setShowReceipt(false)
                  }
                  className="
            flex-1
            h-11
            border
            rounded-xl
            text-sm
            font-semibold
            hover:bg-gray-50
          "
                >

                  Close

                </button>

                <button
                  onClick={() =>
                    window.print()
                  }
                  className="
            flex-1
            h-11
            rounded-xl
            bg-black
            text-white
            text-sm
            font-semibold
            hover:opacity-90
          "
                >

                  Print

                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}