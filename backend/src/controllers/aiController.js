import model from "../config/gemini.js";

export const chatAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        message: "Tanya apa nih? Aku siap bantu cari buku 📚",
      });
    }

    const systemPrompt = `
### PERSONA
Kamu adalah Liby, asisten AI dari perpustakaan digital BukuIn.
Gaya bicara: Friendly, santai (Gen Z style), informatif, dan "mirroring" (ikutin bahasa user: Indo/English/Campuran).

### DAFTAR GENRE (SUBJECTS)
Gunakan kategori ini untuk klasifikasi:
- Art, Science Fiction, Fantasy, Biographies, Recipe (Cooking), Romance, Textbooks, Children, Medicine, Religion.

### TUGAS REKOMENDASI
Jika user minta rekomendasi, berikan 2-3 judul buku populer yang relevan dengan genre di atas. 
Contoh: 
- Science Fiction: "Dune" atau "Project Hail Mary".
- Fantasy: "Harry Potter" atau "The Hobbit".
- Romance: "The Spanish Love Deception" atau "It Ends with Us".

### FITUR BUKUIN (FULL DIGITAL)
1. BORROW: Klik "Borrow" > Tunggu acc admin > Perpanjang di menu History (Max 5x).
2. SHOPPING: Di menu Belanja. Bisa "Buy Now" atau "Add to Cart".
3. WISHLIST: Simpan buku favorit ke wishlist.
4. PAYMENT: Via Midtrans (QRIS, E-wallet, Bank). Cek kode bayar di menu "Orders" kalau mau bayar nanti.
5. MEMBER ID: Cek nomor anggota di halaman "Profil".

### ATURAN RESPON
- Singkat & padat (3-5 kalimat).
- Jika user pakai bahasa gaul/typo, tetap pahami maksudnya.
- Sebutkan nama genrenya sesuai daftar di atas saat memberi saran.
- Gunakan emoji ✨📚.

User: "${prompt}"
Liby's Response:
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ message: text });
  } catch (error) {
    console.log("GEMINI ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookRecommendation =
async (req, res) => {

  try {

    const {
      genres,
      searches,
      books,
    } = req.body;

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

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response;

    const text =
      response.text();

    const cleanText =
      text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return res.json(
      JSON.parse(cleanText)
    );

  } catch (err) {

    console.log(err);

  // ================= FALLBACK =================

const fallbackBooks =
  books
    .filter((book) => {

      const category =
        (
          book.category ||
          book.subject ||
          ""
        ).toLowerCase();

      return [

        ...genres,
        ...searches,

      ].some((item) =>
        category.includes(
          item.toLowerCase()
        )
      );

    })
    .slice(0, 8)
    .map((book) => ({
      title: book.title,
      reason:
        "Matched your interests",
    }));

return res.json(
  fallbackBooks
);

  }
};