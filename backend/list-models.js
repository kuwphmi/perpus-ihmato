import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const run = async () => {
  const models = await genAI.listModels();

  console.log("MODELS YANG TERSEDIA:");
  models.forEach((m) => {
    console.log("-", m.name);
  });
};

run();