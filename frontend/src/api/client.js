// Django API bilan gaplashadigan yagona joy.
// JWT tokenlar brauzerning localStorage'ida saqlanadi.
import { storage } from "./storage.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export function saveTokens({ access, refresh }) {
  if (access) storage.set("access", access);
  if (refresh) storage.set("refresh", refresh);
}

export function clearTokens() {
  storage.remove("access");
  storage.remove("refresh");
}

// Bitta so'rov yuboradi. useToken=true bo'lsa, Authorization sarlavhasi qo'shiladi.
function send(path, options, useToken) {
  const headers = { "Content-Type": "application/json" };
  const access = storage.get("access");
  if (useToken && access) headers.Authorization = `Bearer ${access}`;

  return fetch(API_URL + path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

// Access token eskirganda, refresh token bilan yangisini oladi.
async function refreshAccessToken() {
  const refresh = storage.get("refresh");
  if (!refresh) {
    clearTokens();
    return false;
  }
  const res = await fetch(API_URL + "/auth/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens(); // refresh ham eskirgan — qaytadan kirish kerak
    return false;
  }
  saveTokens(await res.json());
  return true;
}

// Serverdan kelgan xatoni oddiy matnga aylantiradi
function errorMessage(data) {
  if (!data) return "Server bilan aloqa xatosi";
  if (data.detail) return data.detail;
  const first = Object.values(data)[0];
  return Array.isArray(first) ? first[0] : String(first);
}

// Asosiy funksiya: api("/places/") yoki api("/auth/login/", { method: "POST", body: {...} })
export async function api(path, options = {}) {
  if (import.meta.env.VITE_DEMO) {
    const { demoApi } = await import("./demo.js"); // faqat demo yig'ilganda
    return demoApi(path, options);
  }

  let res = await send(path, options, true);

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    res = await send(path, options, refreshed); // token bo'lmasa, tokensiz urinib ko'radi
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(errorMessage(data));
  return data;
}
