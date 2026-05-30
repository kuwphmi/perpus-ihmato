import model from "../config/gemini.js";

export const chatAI = async (req, res) => {
  try {
    let { prompt } = req.body;

    // limit incoming prompt length to avoid large token usage
    if (!prompt) prompt = "";
    prompt = String(prompt).trim().slice(0, 800);

    const langHint = req.body?.lang === "id" ? "id" : "en";

    if (!prompt) {
      return res.json({
        message: langHint === "id" ? "Silakan tuliskan pertanyaan seputar sistem atau layanan perpustakaan." : "Please ask a question about the library system or service.",
      });
    }

    // quick keyword-based guard to avoid calling the LLM for unrelated prompts
    const lowerPrompt = prompt.toLowerCase();
    const libraryKeywords = [
      "borrow",
      "pinjam",
      "return",
      "kembali",
      "search",
      "cari",
      "catalog",
      "catalogue",
      "buku",
      "book",
      "wishlist",
      "fav",
      "favorite",
      "favorit",
      "payment",
      "bayar",
      "midtrans",
      "order",
      "orders",
      "member",
      "profil",
      "profile",
      "loan",
      "riwayat",
      "history",
      "genre",
      "recommend",
      "rekomendasi",
      "fine",
      "denda",
      "peminjaman",
      "perpanjang",
      "notifikasi",
      "notification",
      "status",
      "toko",
      "belanja",
      "library",
      "perpustakaan",
    ];
    const notLibraryKeywords = [
      "joke",
      "lagu",
      "song",
      "movie",
      "film",
      "politics",
      "sex",
      "weather",
      "coin",
      "crypto",
      "nft",
      "password",
      "hack",
      "health",
      "covid",
      "programming",
      "coding",
      "software",
      "music",
      "anime",
      "religion",
      "bible",
      "quran",
      "love",
      "life",
      "career",
    ];

    const isLibrary = libraryKeywords.some((k) => lowerPrompt.includes(k));
    const isExplicitOffTopic = notLibraryKeywords.some((k) => lowerPrompt.includes(k));

    if (!isLibrary || isExplicitOffTopic) {
      const refuseId = "Hehe, itu di luar fokusku sebagai asisten AI dari BOOKIN, bestie! Aku Liby di sini buat bantu kamu nemu buku-buku keren atau jelasin fitur-fitur di perpustakaan digital kita.";
      const refuseEn = "Hehe, that's outside my focus as BOOKIN's AI assistant, bestie! I'm Liby here to help you find books or explain features in our digital library.";
      return res.json({ message: langHint === "id" ? refuseId : refuseEn });
    }

    const systemPrompt = `
You are Liby, the library assistant for BOOKIN. Answer ONLY about the BOOKIN library system, services, features, and how to use the app (borrow, return, search, wishlist, payments, member info, orders, notifications, history). Do not invent anything about real inventory, stock, or user account details. If the user's question is NOT about the library, reply exactly (in the user's language):

"Hehe, itu di luar fokusku sebagai asisten AI dari BOOKIN, bestie! Aku Liby di sini buat bantu kamu nemu buku-buku keren atau jelasin fitur-fitur di perpustakaan digital kita."
OR
"Hehe, that's outside my focus as BOOKIN's AI assistant, bestie! I'm Liby here to help you find books or explain features in our digital library."

Language rule:
- If langHint is "id", answer in Indonesian.
- If langHint is "en", answer in English.
- Do not switch languages unless the user's input already mixes both languages.

Preferred response language: ${langHint === "id" ? "Indonesian" : "English"}.

Rules:
- Keep replies very short and token-efficient (1–3 short sentences).
- Mirror the user's language exactly when possible.
- Give no more than 2 examples or titles.
- Do NOT provide long lists, long explanations, or unrelated content.
- Use plain simple sentences and at most 2 emoji.
- If asked about stock, inventory, or real user account info, say that AI cannot access live system data and advise checking the app or contacting admin.

User: "${prompt}"
Liby's Response:
`;

    // Try to request a short answer by passing generation options when possible.
    let text;
    try {
      const result = await model.generateContent({
        prompt: systemPrompt,
        temperature: 0.0,
        maxOutputTokens: 90,
        topP: 0.9,
        candidateCount: 1,
      });

      const response = await result.response;
      text = response.text();
    } catch (err) {
      // If the SDK doesn't accept options, fall back to simple call
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      text = response.text();
    }

    return res.json({ message: text });
  } catch (error) {
    console.log("GEMINI ERROR:", error);
    const langHint = req.body?.lang === "id" ? "id" : "en";
    return res.status(500).json({
      message: langHint === "id" ? "Maaf, layanan AI sedang tidak tersedia. Silakan coba lagi beberapa saat lagi." : "Sorry, the AI service is temporarily unavailable. Please try again shortly.",
    });
  }
};

export const getBookRecommendation = async (req, res) => {
  try {
    const { genres, searches, books } = req.body;

    const prompt = `
User favorite genres:
${genres.join(", ")}

User recent searches:
${searches.join(", ")}

Available books:
${JSON.stringify(books)}

Recommend 8 books most relevant
to the user's interests.

Prioritize books matching:
- category
- favorite genres
- search keywords

Return JSON only:
[
 {
   "title": "...",
   "reason": "..."
 }
]
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return res.json(JSON.parse(cleanText));
  } catch (err) {
    console.log(err);

    // ================= FALLBACK =================

    const fallbackBooks = books
      .filter((book) => {
        const category = (book.category || book.subject || "").toLowerCase();

        return [...genres, ...searches].some((item) => category.includes(item.toLowerCase()));
      })
      .slice(0, 8)
      .map((book) => ({
        title: book.title,
        reason: "Matched your interests",
      }));

    return res.json(fallbackBooks);
  }
};
