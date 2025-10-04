"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  email: string;
  password?: string; // keep password for signin validation
  mainBalance: number;
  investmentBalance: number;
  totalEarn: number;
  totalDeposit: number;
  roi: number;
  redeemedRoi: number;
  speedInvest: number;
  completed: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (newUser: User) => void;
  logout: () => void;
  updateBalances: (balances: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ✅ Rehydrate from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = (newUser: User) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existing = users.find((u: User) => u.email === email);

    if (!existing || existing.password !== password) {
      return false; // invalid login
    }

    setUser(existing);
    localStorage.setItem("currentUser", JSON.stringify(existing));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateBalances = (balances: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...balances };
      localStorage.setItem("currentUser", JSON.stringify(updated));

      // also update in users list
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const idx = users.findIndex((u: User) => u.email === updated.email);
      if (idx >= 0) {
        users[idx] = updated;
        localStorage.setItem("users", JSON.stringify(users));
      }

      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, updateBalances }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
