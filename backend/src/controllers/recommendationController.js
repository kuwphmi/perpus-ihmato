import supabase from "../config/supabase.js";

export const getRecommendations = async (
  req,
  res
) => {
  try {

    const { user_id } = req.params;

    // =============================
    // GET FAVORITE GENRES
    // =============================
    const {
      data: favGenres,
    } = await supabase
      .from("fav_genres")
      .select("category")
      .eq("user_id", user_id);

    // =============================
    // GET SEARCH HISTORY
    // =============================
    const {
      data: histories,
    } = await supabase
      .from("search_history")
      .select("keyword")
      .eq("user_id", user_id)
      .order("created_at", {
        ascending: false,
      })
      .limit(10);

    // =============================
    // GET LOCAL BOOKS
    // =============================
    const {
      data: books,
      error,
    } = await supabase
      .from("buku")
      .select("*");

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    // =============================
    // KEYWORDS
    // =============================
    const genreKeywords =
      favGenres.map((g) =>
        g.category.toLowerCase()
      );

    const searchKeywords =
      histories.map((h) =>
        h.keyword.toLowerCase()
      );

    // =============================
    // SCORING AI SIMPLE
    // =============================
    const scoredBooks = books.map(
      (book) => {

        let score = 0;

        const title =
          (book.title || "")
          .toLowerCase();

        const author =
          (book.author || "")
          .toLowerCase();

        const genre =
          (book.genre || "")
          .toLowerCase();

        // ================= GENRE
        genreKeywords.forEach(
          (keyword) => {
            if (
              genre.includes(keyword)
            ) {
              score += 5;
            }
          }
        );

        // ================= SEARCH
        searchKeywords.forEach(
          (keyword) => {

            if (
              title.includes(keyword)
            ) {
              score += 4;
            }

            if (
              author.includes(keyword)
            ) {
              score += 2;
            }

            if (
              genre.includes(keyword)
            ) {
              score += 3;
            }
          }
        );

        return {
          ...book,
          ai_score: score,
        };

      }
    );

    // =============================
    // SORTING
    // =============================
    scoredBooks.sort(
      (a, b) =>
        b.ai_score - a.ai_score
    );

    // =============================
    // TOP BOOKS
    // =============================
    return res.json(
      scoredBooks.slice(0, 10)
    );

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });

  }
};