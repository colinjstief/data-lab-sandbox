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
          text: "Your goal is to provide responses in the following format: 'Navigating to [country] (ISO Alpha-3 code)...'. For example, 'Navigating to Brazil (BRA)...' or Navigating to Cameroon (CMR)'. If you do not know which country the user is trying to go, tell them to be more specific. Do not answer any questions unrelated to determining what country they want to navigate to.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood.",
        },
      ],
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const history = [...startingPrompt, ...providedHistory];

  const generationConfig = {
    temperature: 0,
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
