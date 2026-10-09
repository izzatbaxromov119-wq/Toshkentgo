import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";

// "Kirish" va "Ro'yxatdan o'tish" oynasi
export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" yoki "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Esc bosilsa oyna yopiladi
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(form.username, form.password);
      else await register(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal glass-dark" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Yopish">
          <X size={18} />
        </button>

        <div className="tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Kirish
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Ro'yxatdan o'tish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <input name="username" placeholder="Login" value={form.username} onChange={handleChange} required />
          {mode === "register" && (
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          )}
          <input
            name="password"
            type="password"
            placeholder="Parol (kamida 8 belgi)"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Kuting..." : mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
          </button>
        </form>
      </div>
    </div>
  );
}
