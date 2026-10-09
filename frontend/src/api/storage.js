// localStorage'ni xavfsiz o'qish/yozish. Ba'zi muhitlarda (masalan, iframe) u bloklangan bo'ladi —
// shunda ma'lumot vaqtincha xotirada saqlanadi va sayt baribir ishlaydi.
const memory = {};

export const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return memory[key] ?? null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { memory[key] = value; }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { delete memory[key]; }
  },
};
