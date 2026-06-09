import { useEffect, useState } from "react";
import { Trash2, Pencil, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewCover, setPreviewCover] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notif, setNotif] = useState("");
  const [notifType, setNotifType] = useState("info");
  const [search, setSearch] = useState("");

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    stock: "",
    description: "",
    cover: "",
  });

  const navigate = useNavigate();

  const categories = ["art", "science fiction", "fantasy", "biographies", "recipe", "romance", "textbook", "children", "medicine", "religion"];
  const filteredBooks = books.filter((book) =>
  [book.title, book.author, book.category]
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  const booksToDisplay =
    search.trim() === ""
      ? books.slice(0, 6)
      : filteredBooks;

  // Toast Notification
  const showNotif = (message, type = "info") => {
    setNotif(message);
    setNotifType(type);
    setTimeout(() => setNotif(""), 3000);
  };

  const getNotifColor = () => {
    switch (notifType) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  // ================= FETCH =================
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/admin/borrow-books`);

      if (!res.ok) {
        throw new Error("Failed fetch books");
      }

      const data = await res.json();

      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setBookForm({
      ...bookForm,
      [e.target.name]: e.target.value,
    });
  };

  // ================= RESET =================
  const resetForm = () => {
    setBookForm({
      title: "",
      author: "",
      category: "",
      stock: "",
      description: "",
      cover: "",
    });

    setIsEdit(false);

    setSelectedId(null);

    setPreviewCover("");
  };

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/borrow-books`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: bookForm.title,

          author: bookForm.author,

          category: bookForm.category,

          stock: Number(bookForm.stock),

          description: bookForm.description,

          cover: bookForm.cover,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed add book");
      }

      showNotif("Loan book added successfully", "success");

      await fetchBooks();

      resetForm();
    } catch (err) {
      console.error(err);

      showNotif(err.message, "error");
    }
  };

  // ================= EDIT =================
  const handleEditClick = (book) => {
    setBookForm({
      title: book.title || "",

      author: book.author || "",

      category: book.category || "",

      stock: book.stock || "",

      description: book.description || "",

      cover: book.cover || "",
    });

    setPreviewCover(book.cover || "");

    setSelectedId(book.id);

    setIsEdit(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/borrow-books/${selectedId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: bookForm.title,

          author: bookForm.author,

          category: bookForm.category,

          stock: Number(bookForm.stock),

          description: bookForm.description,

          cover: bookForm.cover,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed update");
      }

      showNotif("Book updated successfully", "success");

      await fetchBooks();

      resetForm();
    } catch (err) {
      console.error(err);

      showNotif("Failed to update book", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/borrow-books/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed delete");
      }

      fetchBooks();
    } catch (err) {
      console.error(err);

      showNotif("Failed to delete book", "error");
    }
  };

  const handleImportExcel = async () => {
  if (!excelFile) {
    showNotif("Please select excel file", "warning");
    return;
  }

  try {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, {
        type: "array",
      });

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const jsonData =
        XLSX.utils.sheet_to_json(sheet);

      const res = await fetch(
        `${API_BASE}/admin/import-borrow-books`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            books: jsonData,
          }),
        }
      );

      const result =
        await res.json();

      if (!res.ok) {
        throw new Error(
          result.message
        );
      }

      showNotif(
        result.message,
        "success"
      );

      fetchBooks();
    };

    reader.readAsArrayBuffer(
      excelFile
    );

  } catch (err) {
    console.error(err);

    showNotif(
      "Import failed",
      "error"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#f4f7ff]">
      {/* HEADER */}
      {/* NOTIFICATION TOAST */}
      {notif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4">
          <div className={`${getNotifColor()} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {notifType === "success" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notifType === "error" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {notifType === "warning" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{notif}</span>
          </div>
        </div>
      )}
      <div className="bg-blue-600 px-8 py-8 shadow-md">
        <div className="flex items-center gap-4">
          {/* BUTTON KEMBALI */}
          <button
            onClick={() => navigate("/admin")}
            className="
            bg-white/20
            hover:bg-white/30
            transition
            p-3
            rounded-xl
            text-white
          "
          >
            <ArrowLeft size={18} />
          </button>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-bold text-white">Manage Borrow Books</h1>
            <p className="text-blue-100 mt-2">Add and manage borrow books</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8">

      <div className="flex flex-wrap justify-end items-center gap-3 mb-6">
  {/* FILE PREVIEW */}
  {excelFile && (
    <div
      className="
        flex items-center gap-2
        bg-white
        px-4 py-2
        rounded-xl
        shadow
        border
      "
    >
      <span className="text-sm truncate max-w-[220px]">
        📁 {excelFile.name}
      </span>

      <button
        onClick={() => setExcelFile(null)}
        className="
          text-red-500
          hover:text-red-700
          font-bold
          text-lg
        "
      >
        ×
      </button>
    </div>
  )}

  {/* IMPORT BUTTON */}
  <label
    className="
      bg-white
      border
      text-blue-600
      px-4 py-2
      rounded-xl
      font-semibold
      cursor-pointer
      hover:bg-blue-50
      transition
    "
  >
    📥 Import Excel

    <input
      type="file"
      accept=".xlsx,.xls,.csv"
      className="hidden"
      onChange={(e) =>
        setExcelFile(e.target.files[0])
      }
    />
  </label>

  {/* UPLOAD BUTTON */}
  {excelFile && (
    <button
      onClick={handleImportExcel}
      className="
        bg-emerald-600
        text-white
        px-4 py-2
        rounded-xl
        font-semibold
        hover:bg-emerald-700
        transition
      "
    >
      ⬆ Upload
    </button>
  )}

  {/* TEMPLATE */}
  <a
    href="/templates/template_books.xlsx"
    download
    className="
      bg-blue-600
      text-white
      px-4 py-2
      rounded-xl
      font-semibold
      hover:bg-blue-700
      transition
    "
  >
    📄 Download Template
  </a>
</div>
    
        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Borrow Book" : "Add Borrow Book"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input name="title" value={bookForm.title} onChange={handleChange} placeholder="Book title" className="border p-3 rounded-xl" />

            <input name="author" value={bookForm.author} onChange={handleChange} placeholder="Author" className="border p-3 rounded-xl" />

            <select name="category" value={bookForm.category} onChange={handleChange} className="border p-3 rounded-xl bg-white">
              <option value="">Select Category</option>

              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <input type="number" name="stock" value={bookForm.stock} onChange={handleChange} placeholder="Stock" className="border p-3 rounded-xl" />
          </div>

          {/* COVER */}
          <div className="mt-5">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];

                if (!file) return;

                const fileName = `${Date.now()}-${file.name}`;

                const { error } = await supabase.storage.from("book-covers").upload(fileName, file);

                if (error) {
                  showNotif("Upload failed", "error");

                  return;
                }

                const { data } = supabase.storage.from("book-covers").getPublicUrl(fileName);

                setBookForm((prev) => ({
                  ...prev,
                  cover: data.publicUrl,
                }));

                setPreviewCover(data.publicUrl);
              }}
            />

            {previewCover && <img src={previewCover} alt="preview" className="w-32 h-44 object-cover rounded-xl mt-4" />}
          </div>

          <textarea name="description" value={bookForm.description} onChange={handleChange} placeholder="Description" className="w-full border p-3 rounded-xl mt-5 h-36" />

          <div className="flex gap-3 mt-6">
            <button onClick={isEdit ? handleUpdate : handleAdd} className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              {isEdit ? "Update" : "Submit"}
            </button>

            {isEdit && (
              <button onClick={resetForm} className="bg-gray-200 px-6 py-3 rounded-xl">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Borrow Book List</h2>
          <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full md:w-96
              border
              rounded-xl
              px-4 py-3
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          />
        </div>

          {loading ? (
        <p>Loading...</p>
      ) : booksToDisplay.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center text-gray-500">
          No books found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {booksToDisplay.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="h-60 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-800">
                  {book.title}
                </h3>

                <p className="text-gray-500 mt-1">
                  {book.author}
                </p>

                <div className="mt-4 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">
                      Category:
                    </span>{" "}
                    {book.category}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Stock:
                    </span>{" "}
                    {book.stock}
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div
                  className="
                    text-gray-600 text-sm mt-4
                    h-20 overflow-y-auto
                    border rounded-lg p-2 bg-gray-50
                    scrollbar-hide
                  "
                >
                  {book.description}
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleEditClick(book)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
    </div>
  );
}