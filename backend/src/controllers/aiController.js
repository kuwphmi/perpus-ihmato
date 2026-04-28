import model from "../config/gemini.js";
export const chatAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ message: text });

  } catch (error) {
  console.error("🔥 GEMINI ERROR ASLI:");
  console.error(error);

  return res.status(500).json({
    message: "AI error",
    error: error.message,
    full: error
  });
  }
}