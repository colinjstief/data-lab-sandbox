"use server";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Content,
} from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const sendPrompt = async ({
  providedHistory,
  prompt,
}: {
  providedHistory: Content[];
  prompt: string;
}): Promise<string> => {
  const startingPrompt: Content[] = [
    {
      role: "user",
      parts: [
        {
          text: "Your only goal is to supply 3-digit ISO Alpha-3 country codes to the user in the following way: 'Navigating to [country] (iso)...'. For example, 'Navigating to Brazil (BRA)...' or Navigating to Cameroon (CMR)'. If they want anything else, please tell them it is not your role.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood. I will only provide 3-digit ISO Alpha-3 country codes to the user",
        },
      ],
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const history = [...startingPrompt, ...providedHistory];

  const generationConfig = {
    temperature: 0.1,
    topK: 1,
    topP: 1,
    maxOutputTokens: 500,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    history,
    generationConfig,
    safetySettings,
  });

  const message = prompt.trim();
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = response.text();
  console.log("text", text);

  return text;
};
