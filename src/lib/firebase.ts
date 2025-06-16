
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAen6NRMN9JGEd38Du04iB5V7JD2xk1dhs",
  authDomain: "workon-29729.firebaseapp.com",
  projectId: "workon-29729",
  storageBucket: "workon-29729.firebasestorage.app",
  messagingSenderId: "551174974488",
  appId: "1:551174974488:web:ef69b275339164b7eb276d",
  measurementId: "G-BYTYEN39PS"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
