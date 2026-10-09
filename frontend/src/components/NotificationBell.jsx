import { Bell, BellOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotifications } from "../hooks/useNotifications.js";
import { timeAgo } from "../utils.js";

// Header'dagi qo'ng'iroqcha: yangi xabarlar soni va ro'yxati
export default function NotificationBell() {
  const { items, unreadCount, isUnread, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  // Tashqariga bosilsa yoki Esc bosilsa — yopamiz
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !boxRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openNotification(n) {
    markRead(n.id);
    setOpen(false);
    if (n.place_slug) navigate(`/places/${n.place_slug}`);
  }

  return (
    <div className="bell" ref={boxRef}>
      <button
        className={`icon-btn bell-btn ${unreadCount > 0 ? "has-new" : ""}`}
        aria-label={unreadCount ? `Xabarlar: ${unreadCount} ta yangi` : "Xabarlar"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="bell-panel" role="dialog" aria-label="Xabarlar">
          <div className="bell-head">
            <strong>Xabarlar</strong>
            {unreadCount > 0 && (
              <button className="link-btn" onClick={markAllRead}>Hammasini o'qilgan qilish</button>
            )}
          </div>

          {items.length === 0 && (
            <p className="bell-empty"><BellOff size={22} /> Hozircha yangi xabar yo'q</p>
          )}

          <ul>
            {items.map((n) => (
              <li key={n.id}>
                <button className={`bell-item ${isUnread(n.id) ? "unread" : ""}`} onClick={() => openNotification(n)}>
                  {n.discount_percent ? (
                    <span className="bell-percent">-{n.discount_percent}%</span>
                  ) : (
                    <span className="bell-percent bell-info"><Bell size={20} /></span>
                  )}
                  <span className="bell-text">
                    <strong>{n.title}</strong>
                    <small>{n.message}</small>
                    <time dateTime={n.created_at}>{timeAgo(n.created_at)}</time>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
