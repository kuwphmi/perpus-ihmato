import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import supabase from "../config/supabase";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewCover, setPreviewCover] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    stock: "",
    price: "",
    description: "",
    cover: "",
  });

  // ================= FETCH BOOKS =================
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

    setIsEdit(false);
    setSelectedId(null);
  };

  // ================= ADD BOOK =================
  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...bookForm,
          stock: Number(bookForm.stock),
          price: Number(bookForm.price),
        }),
      });

      if (!res.ok) {

      const result = await res.json();

      console.log(result);

      throw new Error(result.message || "Failed to add book");
    }

      alert("Book added successfully");

      await fetchBooks();

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to add book");
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

    setSelectedId(book.id);
    setIsEdit(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= UPDATE BOOK =================
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/books/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...bookForm,
            stock: Number(bookForm.stock),
            price: Number(bookForm.price),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update book");
      }

      alert("Book updated successfully");

      await fetchBooks();

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to update book");
    }
  };

  // ================= DELETE BOOK =================
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus buku ini?")) return;

    try {
      const res = await fetch(
        `${API_BASE}/admin/books/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete book");
      }

      await fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete book");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff]">

      {/* HEADER BIRU */}
      <div className="bg-blue-600 px-8 py-8 shadow-md">
        <h1 className="text-4xl font-bold text-white">
          Manage Books
        </h1>

        <p className="text-blue-100 mt-2">
          Add and manage all library books
        </p>
      </div>

      {/* CONTENT PUTIH */}
      <div className="p-8">

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isEdit ? "Edit Book" : "Add New Book"}
          </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  {/* TITLE */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      Book Title
    </label>

    <input
      name="title"
      value={bookForm.title}
      onChange={handleChange}
      placeholder="Input book title"
      className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
    />
  </div>

  {/* AUTHOR */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      Author
    </label>

    <input
      name="author"
      value={bookForm.author}
      onChange={handleChange}
      placeholder="Input author name"
      className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
    />
  </div>

  {/* CATEGORY */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      Category
    </label>

    <input
      name="category"
      value={bookForm.category}
      onChange={handleChange}
      placeholder="Input category"
      className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
    />
  </div>

  {/* STOCK */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      Stock
    </label>

    <input
      type="number"
      name="stock"
      value={bookForm.stock}
      onChange={handleChange}
      placeholder="Input stock"
      className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
    />
  </div>

  {/* PRICE */}
<div className="flex flex-col gap-2">
  <label className="text-sm font-semibold text-gray-700">
    Price
  </label>

  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">

    <span className="px-4 bg-gray-100 text-gray-600 font-medium">
      Rp
    </span>

    <input
      type="text"
      name="price"
      value={bookForm.price}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");

        setBookForm({
          ...bookForm,
          price: value,
        });
      }}
      placeholder="Input price"
      className="w-full p-3 outline-none text-gray-700"
    />
  </div>
</div>

 {/* COVER */}
<div className="flex flex-col gap-3">

  <label className="text-sm font-semibold text-gray-700">
    Book Cover
  </label>

  {/* UPLOAD FILE */}
  <label className="group relative overflow-hidden border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-blue-50 to-white hover:border-blue-500 hover:shadow-lg transition-all duration-300">

    {/* ICON */}
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

    </div>

    <p className="mt-4 text-base font-semibold text-gray-700">
      Upload Book Cover
    </p>

    <p className="text-sm text-gray-400 mt-1">
      Click to choose image
    </p>

    <p className="text-xs text-gray-400 mt-2">
      PNG, JPG, WEBP
    </p>

    <input
  type="file"
  accept="image/*"
  className="hidden"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. preview lokal (biar UI tetap bagus)
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewCover(reader.result);
    };
    reader.readAsDataURL(file);

    // 2. upload ke supabase storage
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("book-covers")
      .upload(fileName, file);

    if (error) {
      alert("Upload gagal");
      return;
    }

    // 3. ambil URL publik
    const { data } = supabase.storage
      .from("book-covers")
      .getPublicUrl(fileName);

    // 4. SIMPAN KE DATABASE FIELD
    setBookForm({
      ...bookForm,
      cover: data.publicUrl,
    });
  }}
/>

  </label>

  {/* GARIS PEMBATAS */}
  <div className="flex items-center gap-3">
    <div className="h-[1px] bg-gray-300 flex-1"></div>

    <span className="text-xs text-gray-400">
      OR USE IMAGE URL
    </span>

    <div className="h-[1px] bg-gray-300 flex-1"></div>
  </div>

  {/* URL INPUT */}
  <input
    name="cover"
    value={bookForm.cover}
    onChange={handleChange}
    placeholder="Paste image URL here..."
    className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
  />

  {/* PREVIEW */}
  {previewCover && (
  <img
    src={previewCover}
    alt="Preview"
    className="w-28 h-40 object-cover rounded-xl border shadow-sm"
  />
)}

</div>
</div>


          <textarea
            name="description"
            value={bookForm.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 mt-5 h-36"
          />

          <div className="flex gap-3 mt-6">

            <button
              onClick={
                isEdit
                  ? handleUpdate
                  : handleAdd
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {isEdit ? "Update Book" : "Submit"}
            </button>

            {isEdit && (
              <button
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
            )}

          </div>
        </div>

        {/* BOOK LIST */}
        <div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Book List
          </h2>

          {loading ? (
            <p className="text-gray-600">
              Loading...
            </p>
          ) : books.length === 0 ? (
            <p className="text-gray-500">
              No books available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
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

                    <div className="mt-4 space-y-1 text-sm text-gray-700">

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

                      <p>
                        <span className="font-semibold">
                          Price:
                        </span>{" "}
                        Rp {book.price}
                      </p>

                    </div>

                    <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                      {book.description}
                    </p>

                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() => handleEditClick(book)}
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(book.id)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
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