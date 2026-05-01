import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const isConfigValid = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'dummy_key';

/**
 * Logs a step in the user's civic journey to Firestore.
 * @param userId - The unique ID of the user (or 'anonymous').
 * @param role - The selected participation role (voter, candidate, volunteer).
 * @param stage - The current phase of the journey.
 * @param action - The specific action taken by the user.
 * @param data - Optional metadata associated with the event.
 */
export async function logUserJourney(userId: string | undefined, role: string, stage: string, action: string, data?: any) {
  if (!isConfigValid) return;
  try {
    await addDoc(collection(db, "journeys"), {
      userId: userId || "anonymous",
      role,
      stage,
      action,
      metadata: data || {},
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Firestore Log Error:", error);
  }
}

/**
 * Logs an AI assistant query and its sentiment to Firestore.
 * @param userId - The unique ID of the user.
 * @param query - The text query sent to the AI.
 * @param sentiment - The sentiment analysis result from Google Cloud NLP.
 */
export async function logElectionQuery(userId: string | undefined, query: string, sentiment?: any) {
  if (!isConfigValid) return;
  try {
    await addDoc(collection(db, "queries"), {
      userId: userId || "anonymous",
      query,
      sentiment: sentiment || null,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Firestore Query Log Error:", error);
  }
}
