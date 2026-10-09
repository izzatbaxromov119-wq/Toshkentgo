/*
  DEMO REJIM: Django serveri bo'lmasa ham sayt ishlashi uchun.
  Ma'lumotlar demoData.json dan olinadi (haqiqiy API'dan nusxa) va shu faylda
  backenddagi (places/views.py) filtr mantig'i takrorlanadi.
  Faqat `VITE_DEMO=1` bilan yig'ilganda ishlatiladi.
*/
import data from "./demoData.json";
import { storage } from "./storage.js";

const PAGE_SIZE = 12;
const { categories, places } = data;
const reviews = structuredClone(data.reviews);
const favorites = new Set();

// Bildirishnomalar: vaqtlari "hozirdan" boshlab hisoblanadi (demo doim "yangi" ko'rinsin)
const notifications = data.notifications.map((n, i) => ({
  ...n,
  created_at: new Date(Date.now() - (12 + i * 47) * 60_000).toISOString(),
}));

const isLoggedIn = () => Boolean(storage.get("access"));
const wait = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

function parentSlug(place) {
  return categories.find((c) => c.id === place.category.parent)?.slug;
}

// Backenddagi apply_filters() ning nusxasi
function filterPlaces(params) {
  let list = places.filter((p) => {
    const cat = params.get("category");
    if (cat && p.category.slug !== cat && parentSlug(p) !== cat) return false;
    if (params.get("price_level") && p.price_level !== params.get("price_level")) return false;
    if (params.get("has_discount") === "1" && !p.discount_percent) return false;
    if (params.get("region") && p.region !== params.get("region")) return false;

    const q = (params.get("q") || "").toLowerCase();
    if (q && ![p.name, p.address, p.district, p.description].join(" ").toLowerCase().includes(q)) return false;

    const min = params.get("min_price"), max = params.get("max_price");
    if (/^\d+$/.test(min || "") && p.price_from < Number(min)) return false;
    if (/^\d+$/.test(max || "") && p.price_from > Number(max)) return false;
    return true;
  });

  const sorters = {
    // Reyting teng bo'lsa — chegirmalilar birinchi (backenddagi kabi)
    rating: (a, b) => b.rating_avg - a.rating_avg || (b.discount_percent || 0) - (a.discount_percent || 0) || a.id - b.id,
    discount: (a, b) => (b.discount_percent || 0) - (a.discount_percent || 0) || b.rating_avg - a.rating_avg,
    cheap: (a, b) => a.price_from - b.price_from,
    expensive: (a, b) => b.price_from - a.price_from,
    new: (a, b) => b.id - a.id,
  };
  const sort = sorters[params.get("ordering")] || ((a, b) => b.rating_avg - a.rating_avg || b.id - a.id);
  return list.sort(sort);
}

const withFavorite = (p) => ({ ...p, is_favorite: favorites.has(p.id) });

export async function demoApi(path, options = {}) {
  await wait();
  const url = new URL(path, "http://demo.local");
  const parts = url.pathname.split("/").filter(Boolean); // "/places/abc/reviews/" -> ["places","abc","reviews"]
  const method = options.method || "GET";
  const body = options.body || {};

  // ---- Kirish (demo: istalgan login va parol qabul qilinadi) ----
  if (parts[0] === "auth") {
    if (parts[1] === "login") {
      if (!body.username) throw new Error("Login yoki parol noto'g'ri");
      storage.set("demo_user", body.username);
      return { access: "demo-access", refresh: "demo-refresh" };
    }
    if (parts[1] === "register") {
      if (!body.username || !body.password) throw new Error("Login va parolni kiriting");
      return { id: 1, username: body.username };
    }
    if (parts[1] === "me") {
      if (!isLoggedIn()) throw new Error("Kirish talab qilinadi");
      return { id: 1, username: storage.get("demo_user") || "demo", email: "", first_name: "" };
    }
  }

  if (parts[0] === "categories") return categories;
  if (parts[0] === "notifications") return notifications;

  if (parts[0] === "places") {
    // /places/map/
    if (parts[1] === "map") return filterPlaces(url.searchParams);

    // /places/favorites/
    if (parts[1] === "favorites") {
      if (!isLoggedIn()) throw new Error("Kirish talab qilinadi");
      return places.filter((p) => favorites.has(p.id)).map(withFavorite);
    }

    // /places/<slug>/...
    if (parts[1]) {
      const place = places.find((p) => p.slug === parts[1]);
      if (!place) throw new Error("Topilmadi");

      if (parts[2] === "favorite" && method === "POST") {
        if (!isLoggedIn()) throw new Error("Kirish talab qilinadi");
        const added = !favorites.has(place.id);
        added ? favorites.add(place.id) : favorites.delete(place.id);
        return { is_favorite: added };
      }

      if (parts[2] === "reviews") {
        if (method === "GET") return reviews[place.slug] || [];
        if (!isLoggedIn()) throw new Error("Sharh yozish uchun tizimga kiring.");

        const list = (reviews[place.slug] = reviews[place.slug] || []);
        const name = storage.get("demo_user") || "demo";
        const review = { id: Date.now(), user_name: name, rating: body.rating, comment: body.comment || "", created_at: new Date().toISOString() };
        const existing = list.findIndex((r) => r.user_name === name);
        existing >= 0 ? (list[existing] = review) : list.unshift(review);

        // Reytingni qayta hisoblaymiz (backenddagi update_rating kabi)
        place.reviews_count = list.length;
        place.rating_avg = (list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1);
        return review;
      }

      return withFavorite(place); // batafsil
    }

    // /places/ — sahifalangan ro'yxat
    const all = filterPlaces(url.searchParams);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const slice = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return {
      count: all.length,
      next: page * PAGE_SIZE < all.length ? "next" : null,
      previous: page > 1 ? "previous" : null,
      results: slice.map(withFavorite),
    };
  }

  throw new Error("Topilmadi");
}
