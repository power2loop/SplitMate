// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2xBRWro79mxB8S09TsQ1o49cyhLOTMU8",
  authDomain: "splitmate-f5991.firebaseapp.com",
  projectId: "splitmate-f5991",
  storageBucket: "splitmate-f5991.firebasestorage.app",
  messagingSenderId: "256206045219",
  appId: "1:256206045219:web:59ab33d86bd9f2a4343196",
  measurementId: "G-G13HPG3Y7P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
