import { useEffect, useState } from "react";

import { api } from "../api/client.js";
import { storage } from "../api/storage.js";

const KEY = "read_notifications";

// Qaysi xabarlar o'qilganini brauzer eslab qoladi (ID'lar ro'yxati)
function loadReadIds() {
  try {
    return JSON.parse(storage.get(KEY) || "[]");
  } catch {
    return [];
  }
}

// Qo'ng'iroqcha uchun: xabarlar, o'qilmaganlar soni, "o'qildi" belgilash
export function useNotifications() {
  const [items, setItems] = useState([]);
  const [readIds, setReadIds] = useState(loadReadIds);

  // Xabarlarni yuklaymiz va har minutda yangilab turamiz
  useEffect(() => {
    let stopped = false;
    const load = () => api("/notifications/").then((data) => !stopped && setItems(data)).catch(() => {});
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);

  function save(ids) {
    setReadIds(ids);
    storage.set(KEY, JSON.stringify(ids));
  }

  const isUnread = (id) => !readIds.includes(id);

  return {
    items,
    unreadCount: items.filter((n) => isUnread(n.id)).length,
    isUnread,
    markRead: (id) => isUnread(id) && save([...readIds, id]),
    markAllRead: () => save([...new Set([...readIds, ...items.map((n) => n.id)])]),
  };
}
