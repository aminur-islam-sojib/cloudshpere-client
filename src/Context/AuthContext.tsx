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
import useGenerateToken from "@/Hooks/useGenerateToken";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  googleLogin: () => Promise<UserCredential>;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Create User
  const createUser = async (email: string, password: string) => {
    setLoading(true);
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Log Out
  const logOut = async () => {
    setLoading(true);
    return await signOut(auth);
  };

  // Google Login
  const googleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);
  useGenerateToken(user);

  return (
    <AuthContext.Provider
      value={{ user, loading, createUser, login, logOut, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
