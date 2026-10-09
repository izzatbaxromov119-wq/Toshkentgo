// Hero orqa foni: Toshkent shahri silueti (Tashkent City minoralari va Teleminora).
// Bu oddiy SVG — rasm yuklab olish shart emas. Xohlasangiz, o'z rasmingizni
// .hero-bg ichiga qo'yib, shu komponentni olib tashlashingiz mumkin.

// [x, kenglik, balandlik, qiyalik] — har bir bino uchun
const BACK = [[0, 90, 120, 0], [90, 70, 170, 0], [190, 100, 140, 30], [330, 80, 190, 0], [450, 110, 130, 0],
  [590, 70, 180, 40], [700, 90, 150, 0], [830, 100, 120, 0], [1240, 90, 160, 0], [1330, 110, 130, 30]];
const FRONT = [[20, 60, 90, 0], [130, 80, 140, 0], [250, 70, 110, 25], [360, 90, 170, 0], [500, 60, 100, 0],
  [610, 100, 150, 35], [760, 70, 110, 0], [900, 80, 90, 0], [1260, 70, 120, 0], [1360, 80, 100, 0]];
const GROUND = 300;

function tower([x, w, h, slant], key, fill) {
  const top = GROUND - h;
  return <polygon key={key} fill={fill} points={`${x},${GROUND} ${x},${top} ${x + w},${top - slant} ${x + w},${GROUND}`} />;
}

// Derazalar (sariq nuqtalar) — oddiy takrorlanadigan naqsh
function windows([x, w, h], index) {
  const dots = [];
  for (let row = 0; row < Math.floor(h / 18); row++) {
    for (let col = 0; col < Math.floor(w / 16); col++) {
      if ((row * 3 + col * 5 + index) % 4 === 0) {
        dots.push(<rect key={`${index}-${row}-${col}`} x={x + 8 + col * 16} y={GROUND - h + 12 + row * 18} width="5" height="7" rx="1" fill="#F59E0B" opacity="0.55" />);
      }
    }
  }
  return dots;
}

export default function Skyline() {
  return (
    <svg className="skyline" viewBox={`0 0 1440 ${GROUND}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {BACK.map((b, i) => tower(b, `b${i}`, "#14306B"))}

      {/* Toshkent teleminorasi */}
      <g fill="#0B1A3B">
        <path d="M1056 300 L1063 110 L1067 110 L1074 300 Z" />
        <ellipse cx="1065" cy="135" rx="17" ry="8" />
        <rect x="1053" y="150" width="24" height="12" rx="5" />
        <rect x="1064" y="30" width="2" height="82" />
      </g>
      <circle cx="1065" cy="28" r="3" fill="#10B981" />

      {FRONT.map((b, i) => tower(b, `f${i}`, "#0A1733"))}
      {FRONT.map((b, i) => windows(b, i))}
    </svg>
  );
}
