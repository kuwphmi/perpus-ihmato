import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetailBuku() {
  const { state } = useLocation();
  const { id } = useParams();

  const [book, setBook] = useState(state?.book || null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!book) return;

      if (book.isLocal) {
        setDescription(book.description);
        return;
      }

      const res = await fetch(`https://openlibrary.org${book.workKey}.json`);
      const data = await res.json();

      setDescription(
        data.description?.value ||
        data.description ||
        "No description available"
      );
    };

    fetchDetail();
  }, [book]);

  return (
    <div>
      <h1>{book?.title}</h1>
      <p>{description}</p>
    </div>
  );
}