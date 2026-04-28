import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const run = async () => {
  try {
    const result = await model.generateContent("Halo, kamu siapa?");
    const response = await result.response;
    const text = response.text();

    console.log("🔥 AI RESPONSE:");
    console.log(text);
  } catch (error) {
    console.error("❌ ERROR AI:");
    console.error(error);
  }
};

run();