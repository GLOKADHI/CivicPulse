/**
 * Analyzes the sentiment of a given text using Google Cloud Natural Language API.
 * @param text - The input text to analyze.
 * @returns An object containing score and magnitude, or null if analysis fails.
 */
export async function analyzeSentiment(text: string) {
  const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    console.warn("Google Cloud API key missing. Sentiment analysis skipped.");
    return null;
  }

  const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;

  const body = {
    document: {
      type: 'PLAIN_TEXT',
      content: text,
    },
    encodingType: 'UTF8',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
        throw new Error(`NLP API responded with ${response.status}`);
    }

    const data = await response.json();
    return data.documentSentiment;
  } catch (error) {
    console.warn("NLP API Error (Safe handled):", error);
    return null;
  }
}
