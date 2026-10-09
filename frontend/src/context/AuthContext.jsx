import { createContext, useContext, useEffect, useState } from "react";

import { api, clearTokens, saveTokens } from "../api/client.js";
import { storage } from "../api/storage.js";
import AuthModal from "../components/AuthModal.jsx";

const AuthContext = createContext(null);

// Har qanday komponentda:  const { user, openAuth, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sahifa ochilganda token bor bo'lsa, foydalanuvchini tiklaymiz
  useEffect(() => {
    if (storage.get("access") || storage.get("refresh")) {
      api("/auth/me/").then(setUser).catch(() => setUser(null));
    }
  }, []);

  async function login(username, password) {
    try {
      const tokens = await api("/auth/login/", { method: "POST", body: { username, password } });
      saveTokens(tokens);
    } catch {
      throw new Error("Login yoki parol noto'g'ri");
    }
    setUser(await api("/auth/me/"));
    setModalOpen(false);
  }

  async function register(form) {
    await api("/auth/register/", { method: "POST", body: form });
    await login(form.username, form.password); // ro'yxatdan o'tgach, darrov kiritamiz
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  const value = {
    user,
    login,
    register,
    logout,
    openAuth: () => setModalOpen(true),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </AuthContext.Provider>
  );
}
