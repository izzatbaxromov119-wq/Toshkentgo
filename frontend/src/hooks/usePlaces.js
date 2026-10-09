import { useEffect, useState } from "react";

import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

// Bo'sh qiymatlarni olib tashlab, so'rov satriga aylantiradi: { q: "boks", region: "" } -> "q=boks"
export function toQuery(params) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, value]) => value));
  return new URLSearchParams(clean).toString();
}

// Umumiy "ma'lumot yuklash" hook'i: { data, loading, error }
export function useApi(path) {
  const { user } = useAuth(); // foydalanuvchi o'zgarsa (kirdi/chiqdi) — qayta yuklaydi
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false; // sahifa almashsa, eski javobni e'tiborsiz qoldiramiz
    setLoading(true);
    setError("");

    api(path)
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [path, user?.id]);

  return { data, loading, error };
}
