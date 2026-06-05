import { useEffect, useState } from "react";
import { Trash2, Pencil, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function ManageOrder() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [previewCover, setPreviewCover] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const [notif, setNotif] = useState("");
  const [notifType, setNotifType] = useState("info");

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    stock: "",
    price: "",
    description: "",
    cover: "",
  });

  const categories = ["art", "science fiction", "fantasy", "biographies", "recipe", "romance", "textbook", "children", "medicine", "religion"];

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

  // ================= FETCH SHOP BOOKS =================
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/admin/books`);

      if (!res.ok) {
        throw new Error("Failed to fetch books");
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

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setBookForm({
      ...bookForm,
      [e.target.name]: e.target.value,
    });
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setBookForm({
      title: "",
      author: "",
      category: "",
      stock: "",
      price: "",
      description: "",
      cover: "",
    });

    setPreviewCover("");

    setIsEdit(false);

    setSelectedId(null);
  };

  // ================= ADD SHOP BOOK =================
  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/books`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: bookForm.title,

          author: bookForm.author,

          category: bookForm.category,

          stock: Number(bookForm.stock),

          price: Number(bookForm.price),

          description: bookForm.description,

          cover: bookForm.cover,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add book");
      }

      showNotif("Shop book added successfully", "success");

      await fetchBooks();

      resetForm();
    } catch (err) {
      console.error(err);

      showNotif(err.message, "error");
    }
  };

  // ================= EDIT BUTTON =================
  const handleEditClick = (book) => {
    setBookForm({
      title: book.title || "",

      author: book.author || "",

      category: book.category || "",

      stock: book.stock || "",

      price: book.price || "",

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

  // ================= UPDATE SHOP BOOK =================
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/books/${selectedId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: bookForm.title,

          author: bookForm.author,

          category: bookForm.category,

          stock: Number(bookForm.stock),

          price: Number(bookForm.price),

          description: bookForm.description,

          cover: bookForm.cover,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update book");
      }

      showNotif("Book updated successfully", "success");

      await fetchBooks();

      resetForm();
    } catch (err) {
      console.error(err);

      showNotif("Failed to update book", "error");
    }
  };

  // ================= DELETE SHOP BOOK =================
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus buku ini?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/books/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete book");
      }

      await fetchBooks();
    } catch (err) {
      console.error(err);

      showNotif("Failed to delete book", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff]">
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

      {/* HEADER */}
      <div className="bg-emerald-600 px-8 py-8 shadow-md">
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
            <ArrowLeft size={24} />
          </button>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-bold text-white">Manage Shop Books</h1>

            <p className="text-emerald-100 mt-2">Add and manage all shop books</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8">
        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Shop Book" : "Add Shop Book"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* TITLE */}
            <input name="title" value={bookForm.title} onChange={handleChange} placeholder="Book title" className="border p-3 rounded-xl" />

            {/* AUTHOR */}
            <input name="author" value={bookForm.author} onChange={handleChange} placeholder="Author" className="border p-3 rounded-xl" />

            {/* CATEGORY */}
            <select name="category" value={bookForm.category} onChange={handleChange} className="border p-3 rounded-xl bg-white">
              <option value="">Select Category</option>

              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* STOCK */}
            <input type="number" name="stock" value={bookForm.stock} onChange={handleChange} placeholder="Stock" className="border p-3 rounded-xl" />

            {/* PRICE */}
            <input type="number" name="price" value={bookForm.price} onChange={handleChange} placeholder="Book price" className="border p-3 rounded-xl" />
          </div>

          {/* COVER */}
          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Book Cover</label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];

                if (!file) return;

                const fileName = `${Date.now()}-${file.name}`;

                const { error } = await supabase.storage.from("book-covers").upload(fileName, file);

                if (error) {
                  showNotif("Upload gagal", "error");

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

            {/* URL */}
            <input name="cover" value={bookForm.cover} onChange={handleChange} placeholder="Paste image URL" className="border p-3 rounded-xl w-full mt-4" />

            {/* PREVIEW */}
            {previewCover && <img src={previewCover} alt="Preview" className="w-28 h-40 object-cover rounded-xl border mt-4" />}
          </div>

          {/* DESCRIPTION */}
          <textarea name="description" value={bookForm.description} onChange={handleChange} placeholder="Description" className="w-full border p-3 rounded-xl mt-5 h-36" />

          {/* BUTTON */}
          <div className="flex gap-3 mt-6">
            <button onClick={isEdit ? handleUpdate : handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold">
              {isEdit ? "Update Book" : "Submit"}
            </button>

            {isEdit && (
              <button onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* BOOK LIST */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop Books</h2>

          {loading ? (
            <p>Loading...</p>
          ) : books.length === 0 ? (
            <p>No books available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl overflow-hidden shadow-md">
                  <img src={book.cover} alt={book.title} className="h-60 w-full object-cover" />

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-gray-800">{book.title}</h3>

                    <p className="text-gray-500 mt-1">{book.author}</p>

                    <div className="mt-4 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Category:</span> {book.category}
                      </p>

                      <p>
                        <span className="font-semibold">Stock:</span> {book.stock}
                      </p>

                      <p>
                        <span className="font-semibold">Price:</span> Rp {Number(book.price || 0).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm mt-4">{book.description}</p>

                    <div className="flex gap-3 mt-5">
                      <button onClick={() => handleEditClick(book)} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl">
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button onClick={() => handleDelete(book.id)} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl">
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
