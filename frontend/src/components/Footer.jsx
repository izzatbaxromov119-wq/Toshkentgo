import { Link } from "react-router-dom";

import Logo from "./Logo.jsx";

// Ijtimoiy tarmoq ikonkalari (o'z havolalaringizni qo'ying)
const SOCIALS = [
  { label: "Telegram", short: "TG", href: "https://t.me/" },
  { label: "Instagram", short: "IG", href: "https://instagram.com/" },
  { label: "Facebook", short: "FB", href: "https://facebook.com/" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Logo />

        <nav className="footer-links">
          <Link to="/">Bosh sahifa</Link>
          <Link to="/places">Joylar</Link>
          <Link to="/map">Xarita</Link>
          <Link to="/about">Haqida</Link>
          <Link to="/contact">Bog'lanish</Link>
        </nav>

        <div className="socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              {s.short}
            </a>
          ))}
        </div>
      </div>

      <p className="copyright">© 2025 TashkentGo. Barcha huquqlar himoyalangan.</p>
    </footer>
  );
}
