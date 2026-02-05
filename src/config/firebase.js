import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvtSXBTIal62_n4DIEm3U94wmoGQ987hg",
  authDomain: "atlast-tech-orbital.firebaseapp.com",
  databaseURL: "https://atlast-tech-orbital-default-rtdb.firebaseio.com",
  projectId: "atlast-tech-orbital",
  storageBucket: "atlast-tech-orbital.firebasestorage.app",
  messagingSenderId: "41856522500",
  appId: "1:41856522500:web:567d028b13d043c8e8d851",
  measurementId: "G-2XFJV9HC9X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
