// ================= MANAGEORDER.JSX =================

import { useEffect, useState } from "react";
import { Trash2, Pencil, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabase";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

export default function ManageOrder() {

  const navigate = useNavigate();

  const [books, setBooks] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [previewCover, setPreviewCover] =
    useState("");

  const [isEdit, setIsEdit] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  const [bookForm, setBookForm] =
    useState({
      title: "",
      author: "",
      category: "",
      stock: "",
      price: "",
      description: "",
      cover: "",
    });
  
  const categories = [
    "art",
    "science fiction",
    "fantasy",
    "biographies",
    "recipe",
    "romance",
    "textbook",
    "children",
    "medicine",
    "religion",
  ];

  // ================= FETCH SHOP BOOKS =================
  const fetchBooks = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        `${API_BASE}/admin/books`
      );

      if (!res.ok) {

        throw new Error(
          "Failed to fetch books"
        );

      }

      const data =
        await res.json();

      setBooks(
        Array.isArray(data)
          ? data
          : []
      );

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
      [e.target.name]:
        e.target.value,
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

      const res = await fetch(
        `${API_BASE}/admin/books`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              bookForm.title,

            author:
              bookForm.author,

            category:
              bookForm.category,

            stock:
              Number(
                bookForm.stock
              ),

            price:
              Number(
                bookForm.price
              ),

            description:
              bookForm.description,

            cover:
              bookForm.cover,
          }),
        }
      );

      const result =
        await res.json();

      if (!res.ok) {

        throw new Error(
          result.message ||
          "Failed to add book"
        );

      }

      alert(
        "Shop book added successfully"
      );

      await fetchBooks();

      resetForm();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  // ================= EDIT BUTTON =================
  const handleEditClick = (book) => {

    setBookForm({
      title:
        book.title || "",

      author:
        book.author || "",

      category:
        book.category || "",

      stock:
        book.stock || "",

      price:
        book.price || "",

      description:
        book.description || "",

      cover:
        book.cover || "",
    });

    setPreviewCover(
      book.cover || ""
    );

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

      const res = await fetch(
        `${API_BASE}/admin/books/${selectedId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              bookForm.title,

            author:
              bookForm.author,

            category:
              bookForm.category,

            stock:
              Number(
                bookForm.stock
              ),

            price:
              Number(
                bookForm.price
              ),

            description:
              bookForm.description,

            cover:
              bookForm.cover,
          }),
        }
      );

      if (!res.ok) {

        throw new Error(
          "Failed to update book"
        );

      }

      alert(
        "Book updated successfully"
      );

      await fetchBooks();

      resetForm();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update book"
      );

    }

  };

  // ================= DELETE SHOP BOOK =================
  const handleDelete = async (id) => {

    if (
      !confirm(
        "Yakin hapus buku ini?"
      )
    ) return;

    try {

      const res = await fetch(
        `${API_BASE}/admin/books/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {

        throw new Error(
          "Failed to delete book"
        );

      }

      await fetchBooks();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to delete book"
      );

    }

  };

  return (
    <div className="min-h-screen bg-[#f4f7ff]">

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

      <h1 className="text-4xl font-bold text-white">
        Manage Shop Books
      </h1>

      <p className="text-emerald-100 mt-2">
        Add and manage all shop books
      </p>

    </div>

  </div>

</div>

      {/* CONTENT */}
      <div className="p-8">

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            {isEdit
              ? "Edit Shop Book"
              : "Add Shop Book"}

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* TITLE */}
            <input
              name="title"
              value={bookForm.title}
              onChange={handleChange}
              placeholder="Book title"
              className="border p-3 rounded-xl"
            />

            {/* AUTHOR */}
            <input
              name="author"
              value={bookForm.author}
              onChange={handleChange}
              placeholder="Author"
              className="border p-3 rounded-xl"
            />

            {/* CATEGORY */}
          <select
            name="category"
            value={bookForm.category}
            onChange={handleChange}
            className="border p-3 rounded-xl bg-white"
          >
            <option value="">Select Category</option>

            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

            {/* STOCK */}
            <input
              type="number"
              name="stock"
              value={bookForm.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-3 rounded-xl"
            />

            {/* PRICE */}
            <input
              type="number"
              name="price"
              value={bookForm.price}
              onChange={handleChange}
              placeholder="Book price"
              className="border p-3 rounded-xl"
            />

          </div>

          {/* COVER */}
          <div className="mt-5">

            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Book Cover
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {

                const file =
                  e.target.files[0];

                if (!file) return;


                const fileName =
                  `${Date.now()}-${file.name}`;

                const { error } =
                  await supabase.storage
                    .from(
                      "book-covers"
                    )
                    .upload(
                      fileName,
                      file
                    );

                if (error) {

                  alert(
                    "Upload gagal"
                  );

                  return;

                }

                const { data } =
                  supabase.storage
                    .from(
                      "book-covers"
                    )
                    .getPublicUrl(
                      fileName
                    );

               setBookForm((prev) => ({
                ...prev,
                cover: data.publicUrl,
              }));

              setPreviewCover(
              data.publicUrl
            );

              }}
            />

            {/* URL */}
            <input
              name="cover"
              value={bookForm.cover}
              onChange={handleChange}
              placeholder="Paste image URL"
              className="border p-3 rounded-xl w-full mt-4"
            />

            {/* PREVIEW */}
            {previewCover && (

              <img
                src={previewCover}
                alt="Preview"
                className="w-28 h-40 object-cover rounded-xl border mt-4"
              />

            )}

          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={bookForm.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded-xl mt-5 h-36"
          />

          {/* BUTTON */}
          <div className="flex gap-3 mt-6">

            <button
              onClick={
                isEdit
                  ? handleUpdate
                  : handleAdd
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold"
            >

              {isEdit
                ? "Update Book"
                : "Submit"}

            </button>

            {isEdit && (

              <button
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>

            )}

          </div>

        </div>

        {/* BOOK LIST */}
        <div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Shop Books
          </h2>

          {loading ? (

            <p>Loading...</p>

          ) : books.length === 0 ? (

            <p>No books available.</p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {books.map((book) => (

                <div
                  key={book.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md"
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

                      <p>
                        <span className="font-semibold">
                          Price:
                        </span>{" "}
                        Rp{" "}
                        {Number(
                          book.price || 0
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </p>

                    </div>

                    <p className="text-gray-600 text-sm mt-4">
                      {book.description}
                    </p>

                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() =>
                          handleEditClick(book)
                        }
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(book.id)
                        }
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
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