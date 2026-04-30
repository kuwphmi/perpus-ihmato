import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models?key=" +
      process.env.GEMINI_API_KEY
  );

  const data = await res.json();

  console.log("MODELS:");
  data.models.forEach((m) => {
    console.log("-", m.name);
  });
};

run();