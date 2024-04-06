"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const sendPrompt = async ({
  history,
  prompt,
}: {
  history: [];
  prompt: string;
}): Promise<any> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  console.log("model", model);
  console.log("prompt", prompt);
  console.log("history", history);

  return "response";
};
