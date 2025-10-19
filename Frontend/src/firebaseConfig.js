import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FB_apiKey,
//   authDomain: import.meta.env.VITE_FB_authDomain,
//   projectId: import.meta.env.VITE_FB_projectId,
//   storageBucket: import.meta.env.VITE_FB_storageBucket,
//   messagingSenderId: import.meta.env.VITE_FB_messagingSenderId,
//   appId: import.meta.env.VITE_FB_appId,
//   measurementId: import.meta.env.VITE_FB_measurementId,
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
