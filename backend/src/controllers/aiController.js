import model from "../config/gemini.js";

export const chatAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        message: "Tanya apa nih? Aku siap bantu cari buku 📚"
      });
    }

    const systemPrompt = `
Kamu adalah BukuBot, asisten perpustakaan digital.

Tugas kamu:
- Membantu user mencari buku
- Memberikan rekomendasi buku
- Menjawab pertanyaan tentang perpustakaan

Gaya bicara:
- Santai dan ramah
- Maksimal 3-4 kalimat
- Gunakan emoji seperlunya 📚

User: ${prompt}
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ message: text });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "AI error" });
  }
};