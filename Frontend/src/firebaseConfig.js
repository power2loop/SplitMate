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
  apiKey: "AIzaSyDilgZFXAkrf-Kloye1OsLiwAShCpm1FE0",
  authDomain: "splitmate-5c755.firebaseapp.com",
  projectId: "splitmate-5c755",
  storageBucket: "splitmate-5c755.firebasestorage.app",
  messagingSenderId: "82951149055",
  appId: "1:82951149055:web:f93dc606a0541a4d0503ca",
  measurementId: "G-YSNWGVCDS2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
