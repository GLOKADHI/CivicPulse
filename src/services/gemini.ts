import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export async function chatWithAssistant(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  if (!ai) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: "You are an expert Election Assistant. Your goal is to help users understand the election process clearly. Provide simple, factual, and non-partisan explanations about voting, registration, candidate requirements, and volunteer roles. If the user asks about specific local laws, remind them to check their local official election board website as laws vary by region." }]
        },
        ...history,
        {
          role: "user",
          parts: [{ text: message }]
        }
      ],
      config: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
}
