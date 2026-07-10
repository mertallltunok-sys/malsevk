"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  setCurrentUser,
  getUserByEmail,
  addUser,
  updateUser,
  logout as logoutStorage,
  type User,
  type UserType,
} from "@/lib/storage";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: {
    email: string;
    password: string;
    name: string;
    userType: UserType;
    company?: string;
    phone?: string;
    city?: string;
    district?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => { success: boolean; error?: string };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde oturum kontrolü
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (usernameOrEmail: string, password: string) => {
    if (!usernameOrEmail || !password) {
      return { success: false, error: "Kullanıcı adı ve şifre gereklidir." };
    }

    const user = getUserByEmail(usernameOrEmail);
    if (!user) {
      return { success: false, error: "Kullanıcı adı veya şifre hatalı." };
    }

    if (user.password !== password) {
      return { success: false, error: "Kullanıcı adı veya şifre hatalı." };
    }

    setCurrentUser(user);
    setUser(user);
    return { success: true };
  };

  const register = (data: {
    email: string;
    password: string;
    name: string;
    userType: UserType;
    company?: string;
    phone?: string;
    city?: string;
    district?: string;
    services?: string[];
    description?: string;
  }) => {
    if (!data.email || !data.password || !data.name || !data.userType) {
      return { success: false, error: "Tüm zorunlu alanları doldurun." };
    }

    const existingUser = getUserByEmail(data.email);
    if (existingUser) {
      return { success: false, error: "Bu e-posta adresi zaten kayıtlı." };
    }

    const newUser = addUser(data);
    setCurrentUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    logoutStorage();
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) {
      return { success: false, error: "Oturum açılmamış." };
    }

    const updatedUser = updateUser(user.id, data);
    if (!updatedUser) {
      return { success: false, error: "Güncelleme başarısız." };
    }

    setCurrentUser(updatedUser);
    setUser(updatedUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
