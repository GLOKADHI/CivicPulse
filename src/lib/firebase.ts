import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const isConfigValid = firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== 'dummy_key' && 
                     firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
                     !firebaseConfig.apiKey.includes('YOUR_');

// Initialize Firebase only if config is valid
let app;
if (isConfigValid) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} else {
  console.warn("Firebase initialized with mock mode due to invalid/missing API key.");
  app = null;
}

export const db = app ? getFirestore(app) : ({} as any);
export const auth = app ? getAuth(app) : ({
  onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
  currentUser: null,
} as any);
export const googleProvider = new GoogleAuthProvider();

let analytics = null;
if (typeof window !== 'undefined' && app && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Analytics failed to initialize:", e);
  }
}

export const logAnalyticsEvent = (name: string, params?: any) => {
  if (analytics) {
    logEvent(analytics, name, params);
  } else {
    console.log(`[Mock Analytics] Event: ${name}`, params);
  }
};

export { analytics };
export { isConfigValid };
