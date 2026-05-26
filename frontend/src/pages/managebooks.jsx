import { useEffect, useState } from "react";
import { Trash2, Pencil, ArrowLeft } from "lucide-react";
import supabase from "../config/supabase";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

export default function ManageBooks() {

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
      description: "",
      cover: "",
    });

  const navigate = useNavigate();

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

  // ================= FETCH =================
  const fetchBooks = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        `${API_BASE}/admin/borrow-books`
      );

      if (!res.ok) {
        throw new Error(
          "Failed fetch books"
        );
      }

      const data = await res.json();

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

  // ================= CHANGE =================
 const handleChange = (e) => {

  setBookForm({
    ...bookForm,
    [e.target.name]:
      e.target.value,
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

      const res = await fetch(
        `${API_BASE}/admin/borrow-books`,
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
              Number(bookForm.stock),

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
          "Failed add book"
        );

      }

      alert(
        "Borrow book added"
      );

      fetchBooks();

      resetForm();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  // ================= EDIT =================
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

  // ================= UPDATE =================
  const handleUpdate = async () => {

    try {

      const res = await fetch(
        `${API_BASE}/admin/borrow-books/${selectedId}`,
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
              Number(bookForm.stock),

            description:
              bookForm.description,

            cover:
              bookForm.cover,
          }),
        }
      );

      if (!res.ok) {

        throw new Error(
          "Failed update"
        );

      }

      alert(
        "Book updated"
      );

      fetchBooks();

      resetForm();

    } catch (err) {

      console.error(err);

      alert(
        "Failed update"
      );

    }

  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (
      !confirm(
        "Delete this book?"
      )
    ) return;

    try {

      const res = await fetch(
        `${API_BASE}/admin/borrow-books/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {

        throw new Error(
          "Failed delete"
        );

      }

      fetchBooks();

    } catch (err) {

      console.error(err);

      alert(
        "Failed delete"
      );

    }

  };

  return (
    <div className="min-h-screen bg-[#f4f7ff]">

    {/* HEADER */}
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
          <ArrowLeft size={24} />
        </button>

        {/* TITLE */}
        <div>

          <h1 className="text-4xl font-bold text-white">
            Manage Borrow Books
          </h1>

          <p className="text-blue-100 mt-2">
            Add and manage borrow books
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
              ? "Edit Borrow Book"
              : "Add Borrow Book"}

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <input
              name="title"
              value={bookForm.title}
              onChange={handleChange}
              placeholder="Book title"
              className="border p-3 rounded-xl"
            />

            <input
              name="author"
              value={bookForm.author}
              onChange={handleChange}
              placeholder="Author"
              className="border p-3 rounded-xl"
            />

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

            <input
              type="number"
              name="stock"
              value={bookForm.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-3 rounded-xl"
            />

          </div>

          {/* COVER */}
          <div className="mt-5">

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
                  .from("book-covers")
                  .upload(
                    fileName,
                    file
                  );

              if (error) {

                alert(
                  "Upload failed"
                );

                return;

              }

              const { data } =
                supabase.storage
                  .from("book-covers")
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

            {previewCover && (
              <img
                src={previewCover}
                alt="preview"
                className="w-32 h-44 object-cover rounded-xl mt-4"
              />
            )}

          </div>

          <textarea
            name="description"
            value={bookForm.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded-xl mt-5 h-36"
          />

          <div className="flex gap-3 mt-6">

            <button
              onClick={
                isEdit
                  ? handleUpdate
                  : handleAdd
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >

              {isEdit
                ? "Update"
                : "Submit"}

            </button>

            {isEdit && (
              <button
                onClick={resetForm}
                className="bg-gray-200 px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
            )}

          </div>

        </div>

        {/* LIST */}
        <div>

          <h2 className="text-3xl font-bold mb-6">
            Borrow Book List
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {books.map((book) => (

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

                    <h3 className="text-2xl font-bold">
                      {book.title}
                    </h3>

                    <p className="text-gray-500">
                      {book.author}
                    </p>

                    <p className="mt-2">
                      Stock:
                      {" "}
                      {book.stock}
                    </p>

                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() =>
                          handleEditClick(book)
                        }
                        className="bg-yellow-400 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(book.id)
                        }
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