// firebaseConfig.ts
// Tänne tulee oman Firebase-projektisi konfiguraatio

import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase Console → Project settings → Your apps → SDK setup and configuration → "Config"
const firebaseConfig = {
  apiKey: "xxxx", // VAIHDA TÄHÄN API_AVAIN
  authDomain: "kotityot-30b93.firebaseapp.com",
  projectId: "kotityot-30b93",
  storageBucket: "kotityot-30b93.firebasestorage.app",
  messagingSenderId: "198989444680",
  appId: "1:198989444680:web:c530c8d0e21efd09714a7d",
  measurementId: "G-1C0Y8DWHH7"
};

// ÄLÄ MUUTA NÄITÄ
const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export default app;
