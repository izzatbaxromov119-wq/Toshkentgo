import { useId } from "react";

import { SCENES } from "./art/scenes.jsx";

/*
  PlaceArt — joyning haqiqiy fotosi bo'lmaganda ko'rsatiladigan rasm.
  Kategoriya va NOMga qarab mos sahna tanlanadi (masalan, "Burger Zone" -> burger,
  "Lavash House" -> lavash). Fon rangi narx darajasiga mos (yashil / to'q sariq / binafsha).
  Admin panelda foto yuklansa, shu rasm o'rniga foto chiqadi.
*/

// Fon ranglari: [yuqori-chap, pastki-o'ng]
const PALETTES = {
  budget: ["#064e3b", "#14b8a6"],
  standard: ["#7c2d12", "#f59e0b"],
  premium: ["#2e1065", "#8b5cf6"],
};

// Kategoriya (va nom) -> sahna
export function pickScene(place) {
  const name = (place.name || "").toLowerCase();
  const slug = place.category_slug || "";

  switch (slug) {
    case "fast-food":
      if (name.includes("lavash")) return "wrap";
      if (name.includes("chicken")) return "chicken";
      return "burger";
    case "milliy-taom":
    case "ovqatlanish":
      return "plov";
    case "turk-taom":
      return name.includes("kebab") ? "kebab" : "doner";
    case "kiyim-erkak":
      return name.includes("gentleman") || name.includes("milano") ? "suit" : "casual";
    case "kiyim-ayol":
      return "dress";
    case "kiyim-bola":
    case "kiyim":
      return "kids";
    case "ijara":
      return "hotel";
    case "turistik":
      return name.includes("minora") ? "tower" : "nature";
    case "avtosalon":
      return "car";
    case "bogcha":
      return "blocks";
    case "oquv-markaz":
    case "talim":
      return "books";
    case "gimnastika":
      return "ribbon";
    case "boks":
      return "gloves";
    case "fitness":
    case "sport":
      return "dumbbell";
    default:
      return "pin";
  }
}

// Sahnalarning o'lchami (kartochkada to'ldirib ko'rinishi uchun)
const SCALE = {
  burger: 1.12, wrap: 1.2, chicken: 1.25, plov: 1.1, doner: 1.2, kebab: 1.02,
  suit: 1.2, casual: 1.25, dress: 1.2, kids: 1.25, hotel: 1.15, tower: 1.05, nature: 1.05,
  car: 1.3, blocks: 1.25, books: 1.25, ribbon: 1.2, gloves: 1.25, dumbbell: 1.15, pin: 1.1,
};

// Nomdan doimiy son (har bir joy o'ziga xos fon oladi)
function hash(text) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export default function PlaceArt({ place, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const sceneName = pickScene(place);
  const Scene = SCENES[sceneName];
  const variant = hash(place.name || "") % 3;
  const [from, to] = PALETTES[place.price_level] || PALETTES.budget;
  const angle = [[0, 0, 1, 1], [1, 0, 0, 1], [0, 1, 1, 0]][variant];

  return (
    <svg className={`place-art ${className}`} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={place.name}>
      <defs>
        <linearGradient id={`${uid}-bg`} x1={angle[0]} y1={angle[1]} x2={angle[2]} y2={angle[3]}>
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <radialGradient id={`${uid}-spot`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
        <pattern id={`${uid}-stripes`} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="12" height="30" fill="#fff" opacity="0.07" />
        </pattern>
        <pattern id={`${uid}-dots`} width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="13" cy="13" r="2.2" fill="#fff" opacity="0.16" />
        </pattern>
      </defs>

      <rect width="600" height="300" fill={`url(#${uid}-bg)`} />

      {variant === 0 && (
        <>
          <circle cx="90" cy="50" r="130" fill="#fff" opacity="0.08" />
          <circle cx="540" cy="270" r="160" fill="#000" opacity="0.1" />
        </>
      )}
      {variant === 1 && <rect width="600" height="300" fill={`url(#${uid}-stripes)`} />}
      {variant === 2 && (
        <>
          <rect width="600" height="300" fill={`url(#${uid}-dots)`} />
          <circle cx="520" cy="60" r="90" fill="#fff" opacity="0.08" />
        </>
      )}

      <ellipse cx="300" cy="140" rx="230" ry="130" fill={`url(#${uid}-spot)`} />
      <g transform={`translate(300 146) scale(${SCALE[sceneName] || 1.1})`}>
        <Scene seed={hash(place.name || "") % 7} />
      </g>
      <rect width="600" height="300" fill={`url(#${uid}-fade)`} />
    </svg>
  );
}
