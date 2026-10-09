import { Heart, Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";
import NotificationBell from "./NotificationBell.jsx";

const MENU = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/places", label: "Joylar" },
  { to: "/map", label: "Xarita" },
  { to: "/about", label: "Haqida" },
  { to: "/contact", label: "Bog'lanish" },
];

export default function Header() {
  const { user, openAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // telefonda menyu ochiq/yopiq

  return (
    <header className="header glass-dark">
      <div className="container header-inner">
        <Logo />

        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          {MENU.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}

          {/* Faqat telefonda ko'rinadi (header'da joy yetmagani uchun shu yerda) */}
          {user && (
            <>
              <NavLink to="/favorites" className="nav-extra" onClick={() => setMenuOpen(false)}>Sevimlilar</NavLink>
              <button className="nav-extra nav-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                Chiqish ({user.username})
              </button>
            </>
          )}
        </nav>

        <div className="header-actions">
          <button className="icon-btn header-search" aria-label="Qidirish" onClick={() => navigate("/places")}>
            <Search size={18} />
          </button>

          <NotificationBell />

          {user ? (
            <div className="user-actions">
              <button className="icon-btn" aria-label="Sevimlilar" onClick={() => navigate("/favorites")}>
                <Heart size={18} />
              </button>
              <span className="user-chip">
                <User size={16} /> {user.username}
              </span>
              <button className="btn btn-ghost" onClick={logout}>Chiqish</button>
            </div>
          ) : (
            <>
              <button className="icon-btn" aria-label="Profil" onClick={openAuth}>
                <User size={18} />
              </button>
              <button className="btn btn-primary header-cta" onClick={openAuth}>
                <span className="cta-long">Kirish / Ro'yxatdan o'tish</span>
                <span className="cta-short">Kirish</span>
              </button>
            </>
          )}

          <button className="icon-btn burger" aria-label="Menyu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
