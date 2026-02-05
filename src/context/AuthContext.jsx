import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Allowed admin emails
const ADMIN_EMAILS = ["tonybradpit@gmail.com"];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if the user is an allowed admin
    if (!ADMIN_EMAILS.includes(result.user.email)) {
      await signOut(auth);
      throw new Error("Access denied. You are not authorized as an admin.");
    }

    return result;
  }

  async function loginWithEmail(email, password) {
    // Check if the email is an allowed admin before attempting login
    if (!ADMIN_EMAILS.includes(email)) {
      throw new Error("Access denied. You are not authorized as an admin.");
    }

    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  }

  async function signupWithEmail(email, password) {
    // Check if the email is an allowed admin before allowing signup
    if (!ADMIN_EMAILS.includes(email)) {
      throw new Error("Access denied. You are not authorized as an admin.");
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setCurrentUser(user);
        setIsAdmin(true);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
