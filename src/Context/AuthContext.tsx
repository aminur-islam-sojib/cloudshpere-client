import { useContext, useEffect, useState, type ReactNode } from "react";
import { createContext } from "react";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
  type UserCredential,
} from "firebase/auth";

import { auth } from "@/lib/firebase.init";
import axiosPublic from "@/Hooks/axiosPublic";

interface AuthProviderProps {
  children: ReactNode;
}

interface ExtendedUser extends FirebaseUser {
  role?: string;
  name?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean; // 🔥 auth state loading
  actionLoading: boolean; // 🔥 login/register button loading
  googleLogin: () => Promise<UserCredential>;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true); // auth observer
  const [actionLoading, setActionLoading] = useState(false); // form buttons

  // -------------------------
  // Create User
  // -------------------------
  const createUser = async (email: string, password: string) => {
    setActionLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------
  // Login
  // -------------------------
  const login = async (email: string, password: string) => {
    setActionLoading(true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------
  // Google Login
  // -------------------------
  const googleLogin = async () => {
    setActionLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(auth, provider);
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------
  // Log Out
  // -------------------------
  const logOut = async () => {
    setActionLoading(true);
    try {
      await signOut(auth);
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------
  // Auth State Observer
  // -------------------------
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = localStorage.getItem("jwt_token");

          if (token) {
            const res = await axiosPublic.get("/api/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            });

            setUser({
              ...currentUser,
              role: res.data.role,
              name: res.data.name,
            });
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false); // 🔥 VERY IMPORTANT
    });

    return () => unSubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        actionLoading,
        createUser,
        login,
        logOut,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
