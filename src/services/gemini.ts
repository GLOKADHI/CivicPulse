import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

/**
 * Communicates with the Gemini AI model to generate non-partisan election guidance.
 * @param message - The user's query or message.
 * @param history - Optional chat history for context-aware responses.
 * @returns The AI's text response.
 * @throws Error if the API key is missing or the request fails.
 */
export async function chatWithAssistant(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  if (!ai) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
