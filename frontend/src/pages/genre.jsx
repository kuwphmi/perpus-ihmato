import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BookCard from "../components/BookCard";

const genreMap = {
  art: "art",
  "science-fiction": "science fiction",
  fantasy: "fantasy",
  biographies: "biography",
  recipe: "cooking",
  romance: "romance",
  textbook: "textbook",
  children: "children",
  medicine: "medicine",
  religion: "religion",
};

export default function Genre() {
  const { name } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const query = genreMap[name] || name;

        const res = await fetch(
          `https://openlibrary.org/search.json?subject=${query}&limit=12`
        );

        const data = await res.json();

        const result = data.docs.map((item) => ({
          title: item.title ?? "-",
          author: item.author_name?.[0] ?? "-",
          cover: item.cover_i ?? null,
          price: Math.floor(Math.random() * 100000) + 50000,
          stock: Math.floor(Math.random() * 20) + 1,
        }));

        setBooks(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchGenre();
  }, [name]);

  return (
    <div className="px-6 md:px-20 py-10">

      {/* BACK BUTTON */}
      <Link to="/belanja" className="text-blue-600">
        ← Kembali
      </Link>

      <h1 className="text-3xl font-bold text-blue-700 my-6">
        Genre: {name}
      </h1>

      <div className="flex flex-wrap gap-5">
        {books.map((book, i) => (
          <BookCard key={i} {...book} />
        ))}
      </div>

    </div>
  );
}