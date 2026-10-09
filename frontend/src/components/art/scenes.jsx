/*
  Joy kartochkalari uchun vektor rasmlar (SVG).
  Har bir "sahna" (0,0) markazga chizilgan: taxminan x: -170..170, y: -105..105.
  Yer chizig'i y = 90. Ranglar "tekis" (flat) uslubda: yorug'lik uchun yarim shaffof oq shakllar ishlatiladi.
*/

const Shadow = ({ rx = 120 }) => <ellipse cx="0" cy="94" rx={rx} ry="11" fill="#000" opacity="0.2" />;
const Shine = ({ d, o = 0.25 }) => <path d={d} fill="#fff" opacity={o} />;

/* ---------------- OVQATLANISH ---------------- */

export const Burger = () => (
  <g>
    <Shadow rx={140} />
    {/* kartoshka fri */}
    <g transform="translate(112 0)">
      {[[-24, -20, -9], [-14, -34, 3], [-4, -26, -4], [6, -38, 6], [16, -28, -6], [26, -22, 10]].map(([x, y, r], i) => (
        <rect key={i} x={x - 4} y={y} width="8" height="66" rx="3" fill={i % 2 ? "#fbbf24" : "#fcd34d"} transform={`rotate(${r} ${x} 40)`} />
      ))}
      <path d="M-34 26 L34 26 L26 92 L-26 92 Z" fill="#ef4444" />
      <path d="M-34 26 L34 26 L32 38 L-32 38 Z" fill="#dc2626" />
      <path d="M-13 50 L13 50 L11 76 L-11 76 Z" fill="#fef3c7" opacity="0.9" />
    </g>
    {/* stakan */}
    <g transform="translate(-114 0)">
      <path d="M-2 4 L24 -46" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
      <path d="M-28 10 L28 10 L22 92 L-22 92 Z" fill="#f8fafc" />
      <path d="M-27 34 L27 34 L25 58 L-25 58 Z" fill="#ef4444" />
      <rect x="-32" y="2" width="64" height="12" rx="6" fill="#e2e8f0" />
      <Shine d="M-22 16 L-16 16 L-14 88 L-19 88 Z" o={0.5} />
    </g>
    {/* burger */}
    <g transform="translate(0 6)">
      <rect x="-62" y="60" width="124" height="22" rx="11" fill="#d97706" />
      <rect x="-68" y="43" width="136" height="19" rx="9.5" fill="#7c2d12" />
      <path d="M-64 44 L64 44 L56 57 L44 47 L30 61 L16 47 L2 59 L-12 47 L-26 61 L-40 47 L-54 59 Z" fill="#fbbf24" />
      <rect x="-64" y="32" width="128" height="13" rx="6" fill="#ef4444" />
      <path d="M-70 36 q9 -12 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 v10 h-144 z" fill="#4ade80" />
      <path d="M-66 34 C-70 -62 70 -62 66 34 Z" fill="#f59e0b" />
      <Shine d="M-52 20 C-52 -16 -30 -34 -6 -36 C-30 -24 -40 -6 -40 20 Z" o={0.3} />
      {[[-30, -6, -30], [-8, -20, 20], [16, -10, -10], [34, 2, 40], [-46, 10, 10], [4, 4, -50], [26, -26, 30], [-20, 14, 0]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="2.6" fill="#fef3c7" transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </g>
  </g>
);

export const Wrap = () => (
  <g>
    <Shadow rx={130} />
    {/* pomidor */}
    <g transform="translate(-112 62)">
      <circle r="27" fill="#ef4444" />
      <Shine d="M-16 -14 C-10 -22 0 -24 8 -22 C-2 -18 -10 -10 -14 0 Z" o={0.35} />
      <path d="M0 -26 l-8 -6 l6 -2 l2 -8 l4 6 l8 -2 l-6 6 l4 6 z" fill="#16a34a" />
    </g>
    {/* qalampir */}
    <g transform="translate(116 56) rotate(20)">
      <path d="M-14 -22 C-24 0 -18 30 0 34 C18 30 24 0 14 -22 C6 -30 -6 -30 -14 -22 Z" fill="#22c55e" />
      <Shine d="M-10 -16 C-16 2 -12 20 -6 28 C-10 10 -8 -6 -4 -20 Z" o={0.35} />
      <rect x="-3" y="-38" width="6" height="14" rx="3" fill="#15803d" />
    </g>
    {/* lavash */}
    <g transform="rotate(-12) translate(0 2)">
      <path d="M-42 -62 C-42 -84 42 -84 42 -62 L48 60 C48 80 -48 80 -48 60 Z" fill="#fde68a" />
      <path d="M-46 0 L46 0 L48 60 C48 80 -48 80 -48 60 Z" fill="#f8fafc" />
      <path d="M-46 0 l9 -8 l9 8 l9 -8 l9 8 l9 -8 l9 8 l9 -8 l9 8 l9 -8 l9 8 l2 0 v6 h-96 z" fill="#e2e8f0" />
      {[-30, -8, 14, 34].map((x, i) => <path key={i} d={`M${x} 18 L${x + 4} 66`} stroke="#ef4444" strokeWidth="5" opacity="0.85" strokeLinecap="round" />)}
      <ellipse cx="0" cy="-64" rx="42" ry="15" fill="#fef3c7" />
      <path d="M-36 -68 q8 -24 18 -8 q10 -22 20 -4 q10 -20 18 4 q6 8 -2 14 h-54 z" fill="#4ade80" />
      <circle cx="-12" cy="-72" r="9" fill="#ef4444" /><circle cx="14" cy="-68" r="8" fill="#dc2626" />
      <rect x="-26" y="-64" width="20" height="10" rx="5" fill="#92400e" /><rect x="6" y="-62" width="22" height="10" rx="5" fill="#7c2d12" />
      <path d="M-4 -80 q8 -10 14 0 q-4 8 -14 0z" fill="#fff" opacity="0.9" />
      <Shine d="M-34 -50 C-38 -20 -36 10 -34 40 C-40 10 -40 -30 -30 -56 Z" o={0.25} />
    </g>
  </g>
);

export const Chicken = () => {
  const piece = (x, y, r, big = 1) => (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${big})`}>
      <ellipse rx="30" ry="22" fill="#b45309" />
      <ellipse rx="27" ry="19" cy="-2" fill="#f59e0b" />
      <ellipse rx="14" ry="7" cx="-8" cy="-10" fill="#fcd34d" opacity="0.5" />
      <rect x="-5" y="14" width="10" height="34" rx="4" fill="#fef3c7" />
      <circle cx="-5" cy="50" r="7" fill="#fef3c7" /><circle cx="5" cy="50" r="7" fill="#fef3c7" />
    </g>
  );
  return (
    <g>
      <Shadow rx={110} />
      {piece(-58, -22, 28, 0.95)}
      {piece(60, -18, -30, 0.95)}
      <g transform="translate(0 -40)">
        <path d="M-34 10 C-44 -14 -22 -34 0 -32 C24 -34 44 -14 34 10 C20 22 -20 22 -34 10 Z" fill="#b45309" />
        <path d="M-30 6 C-38 -12 -18 -28 0 -26 C20 -28 38 -12 30 6 C18 16 -18 16 -30 6 Z" fill="#f59e0b" />
        <ellipse cx="-8" cy="-14" rx="14" ry="6" fill="#fcd34d" opacity="0.5" />
      </g>
      {/* paqir */}
      <path d="M-68 4 L68 4 L54 94 L-54 94 Z" fill="#f8fafc" />
      {[-52, -14, 24].map((x, i) => <path key={i} d={`M${x} 4 L${x + 22} 4 L${x + 17} 94 L${x + 1} 94 Z`} fill="#ef4444" />)}
      <rect x="-74" y="-4" width="148" height="14" rx="7" fill="#dc2626" />
      <circle cx="0" cy="46" r="17" fill="#fff" />
      <path d="M0 58 C-14 48 -12 36 -5 36 C-2 36 0 39 0 39 C0 39 2 36 5 36 C12 36 14 48 0 58 Z" fill="#ef4444" />
    </g>
  );
};

export const Plov = () => (
  <g>
    <Shadow rx={140} />
    {/* non */}
    <g transform="translate(132 70)">
      <circle r="32" fill="#b45309" /><circle r="28" fill="#f59e0b" /><circle r="11" fill="#fbbf24" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 19} cy={Math.sin(a) * 19} r="1.8" fill="#92400e" />;
      })}
    </g>
    {/* qozon-lagan */}
    <path d="M-118 18 C-118 84 -60 96 0 96 C60 96 118 84 118 18 Z" fill="#f1f5f9" />
    <path d="M-114 44 C-100 72 -60 86 0 86 C60 86 100 72 114 44 L111 36 C96 62 58 74 0 74 C-58 74 -96 62 -111 36 Z" fill="#2563eb" />
    {[[-90, 66], [-60, 74], [-30, 79], [0, 80], [30, 79], [60, 74], [90, 66]].map(([x, y], i) => (
      <path key={i} d={`M${x} ${y - 5} l5 5 l-5 5 l-5 -5 z`} fill="#fff" />
    ))}
    <Shine d="M-104 30 C-98 62 -80 78 -56 84 C-84 72 -96 54 -100 30 Z" o={0.5} />
    <ellipse cx="0" cy="18" rx="118" ry="20" fill="#e2e8f0" />
    <ellipse cx="0" cy="19" rx="108" ry="14" fill="#cbd5e1" />
    {/* guruch tepasi */}
    <path d="M-100 20 C-92 -30 -40 -54 0 -54 C40 -54 92 -30 100 20 C60 36 -60 36 -100 20 Z" fill="#f59e0b" />
    <path d="M-60 -20 C-40 -44 -10 -52 10 -52 C-14 -40 -34 -24 -46 4 Z" fill="#fcd34d" opacity="0.5" />
    {Array.from({ length: 26 }).map((_, i) => (
      <circle key={i} cx={-84 + ((i * 37) % 168)} cy={-26 + ((i * 23) % 50)} r="2.4" fill={i % 3 ? "#fcd34d" : "#d97706"} />
    ))}
    {[[-44, -22, 20], [-10, -36, -30], [26, -32, 50], [56, -6, 15], [-68, -2, -55], [8, -6, 70]].map(([x, y, r], i) => (
      <rect key={i} x={x - 2.5} y={y - 10} width="5" height="20" rx="2.5" fill="#ea580c" transform={`rotate(${r} ${x} ${y})`} />
    ))}
    {[[-22, -30], [28, -40], [2, -8], [-52, -10]].map(([x, y], i) => (
      <g key={i}><rect x={x - 14} y={y - 9} width="28" height="18" rx="8" fill="#7c2d12" /><rect x={x - 10} y={y - 6} width="14" height="5" rx="2.5" fill="#fff" opacity="0.18" /></g>
    ))}
    {[[-34, -6], [40, -16], [14, -22], [-6, 6], [66, -30], [-64, -24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#fde68a" />)}
    <g transform="translate(70 -34)">
      <ellipse rx="13" ry="15" fill="#fff7ed" /><path d="M0 -14 V14 M-6 -12 Q-10 0 -6 12 M6 -12 Q10 0 6 12" stroke="#fdba74" strokeWidth="1.5" fill="none" />
      <path d="M-2 -14 L0 -22 L2 -14 Z" fill="#fff7ed" />
    </g>
    {/* bug' */}
    {[-34, 0, 34].map((x, i) => (
      <path key={i} d={`M${x} -66 q-10 -14 0 -26 q10 -12 0 -26`} stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity={0.5 - i * 0.05} transform={`translate(${i === 1 ? 6 : 0} ${i === 1 ? -6 : 0})`} />
    ))}
  </g>
);

export const Doner = () => {
  const half = (y) => 30 + ((y + 72) * 22) / 142;
  const ys = [-72, -48, -24, 0, 24, 48, 72];
  const cols = ["#9a3412", "#b45309", "#7c2d12", "#a16207", "#92400e", "#b45309"];
  return (
    <g>
      <Shadow rx={130} />
      <rect x="-3" y="-104" width="6" height="196" rx="3" fill="#94a3b8" />
      {ys.slice(0, -1).map((y, i) => (
        <path key={i} d={`M${-half(y)} ${y} L${half(y)} ${y} L${half(ys[i + 1])} ${ys[i + 1]} L${-half(ys[i + 1])} ${ys[i + 1]} Z`} fill={cols[i]} />
      ))}
      <ellipse cx="0" cy="-72" rx="30" ry="7" fill="#c2410c" />
      <Shine d="M-28 -70 L-40 70 L-52 72 L-30 -72 Z" o={0.16} />
      {[[-20, -40], [14, -14], [-8, 18], [22, 44], [-26, 50]].map(([x, y], i) => <rect key={i} x={x} y={y} width="14" height="4" rx="2" fill="#fbbf24" opacity="0.35" />)}
      <circle cx="0" cy="-108" r="7" fill="#cbd5e1" />
      <ellipse cx="0" cy="74" rx="68" ry="10" fill="#64748b" /><ellipse cx="0" cy="71" rx="60" ry="8" fill="#94a3b8" />
      {/* isitgich */}
      <rect x="82" y="-66" width="12" height="132" rx="5" fill="#f97316" /><rect x="86" y="-58" width="4" height="116" rx="2" fill="#fde68a" />
      {/* choy stakani */}
      <g transform="translate(-116 42)">
        <ellipse cy="50" rx="32" ry="8" fill="#f8fafc" /><ellipse cy="48" rx="24" ry="5" fill="#e2e8f0" />
        <path d="M-17 -34 C-20 -8 -16 24 -10 38 C-6 46 6 46 10 38 C16 24 20 -8 17 -34 Z" fill="#fff" opacity="0.25" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M-18 -14 C-19 6 -15 26 -10 38 C-6 46 6 46 10 38 C15 26 19 6 18 -14 Z" fill="#b45309" />
        <rect x="-16" y="-24" width="32" height="6" fill="#fbbf24" opacity="0.7" />
        <Shine d="M-12 -30 C-14 -8 -10 14 -6 30 C-8 10 -8 -12 -6 -30 Z" o={0.5} />
      </g>
    </g>
  );
};

export const Kebab = () => {
  const row = (y, seq) => (
    <g>
      <rect x="-150" y={y - 2.5} width="300" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="-160" y={y - 6} width="34" height="12" rx="6" fill="#92400e" />
      {seq.map((t, i) => {
        const x = -104 + i * 34;
        if (t === "m") return <g key={i}><rect x={x - 17} y={y - 15} width="34" height="30" rx="10" fill="#7c2d12" /><rect x={x - 12} y={y - 11} width="16" height="6" rx="3" fill="#fff" opacity="0.2" /></g>;
        if (t === "t") return <g key={i}><circle cx={x} cy={y} r="15" fill="#ef4444" /><circle cx={x - 5} cy={y - 5} r="4" fill="#fff" opacity="0.35" /></g>;
        if (t === "p") return <g key={i}><rect x={x - 11} y={y - 15} width="22" height="30" rx="7" fill="#22c55e" /><rect x={x - 7} y={y - 11} width="5" height="20" rx="2.5" fill="#fff" opacity="0.25" /></g>;
        return <g key={i}><circle cx={x} cy={y} r="14" fill="#a855f7" /><circle cx={x} cy={y} r="8" fill="#c084fc" /></g>;
      })}
    </g>
  );
  return (
    <g>
      <Shadow rx={150} />
      {/* olov */}
      {[-120, -80, -40, 0, 40, 80, 120].map((x, i) => (
        <path key={i} d={`M${x - 16} 96 C${x - 18} 70 ${x} 62 ${x - 2} 40 C${x + 12} 58 ${x + 20} 76 ${x + 16} 96 Z`} fill={i % 2 ? "#f97316" : "#ef4444"} opacity="0.95" />
      ))}
      {[-100, -20, 60, 130].map((x, i) => <path key={i} d={`M${x - 8} 96 C${x - 8} 82 ${x} 78 ${x} 66 C${x + 8} 76 ${x + 10} 86 ${x + 8} 96 Z`} fill="#fde047" />)}
      {row(-50, ["m", "t", "m", "p", "m", "o", "m"])}
      {row(-6, ["p", "m", "o", "m", "t", "m", "p"])}
      {row(38, ["m", "o", "m", "p", "m", "t", "m"])}
      <rect x="-150" y="86" width="300" height="6" rx="3" fill="#1e293b" opacity="0.8" />
    </g>
  );
};

/* ---------------- KIYIM ---------------- */

const Hanger = ({ y = -70 }) => (
  <g stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" fill="none">
    <path d={`M0 ${y} C0 ${y - 14} 14 ${y - 14} 14 ${y - 26} C14 ${y - 36} -2 ${y - 36} -2 ${y - 26}`} />
    <path d={`M-52 ${y + 16} L0 ${y} L52 ${y + 16}`} />
  </g>
);

export const Suit = () => (
  <g>
    <Shadow rx={100} />
    <Hanger y={-70} />
    <path d="M-60 -48 L-92 66 L-68 74 L-56 34 Z" fill="#1e40af" />
    <path d="M60 -48 L92 66 L68 74 L56 34 Z" fill="#1e40af" />
    <path d="M-60 -52 C-30 -66 30 -66 60 -52 L58 88 L-58 88 Z" fill="#1e3a8a" />
    <path d="M-24 -58 L0 -14 L24 -58 L14 -60 L0 -40 L-14 -60 Z" fill="#f8fafc" />
    <path d="M-24 -58 L0 -14 L-12 30 L-58 -14 L-60 -52 Z" fill="#172554" />
    <path d="M24 -58 L0 -14 L12 30 L58 -14 L60 -52 Z" fill="#172554" />
    <path d="M-6 -40 L6 -40 L4 -30 L-4 -30 Z" fill="#b91c1c" />
    <path d="M-4 -30 L4 -30 L9 34 L0 46 L-9 34 Z" fill="#dc2626" />
    <circle cx="0" cy="58" r="3" fill="#93c5fd" /><circle cx="0" cy="74" r="3" fill="#93c5fd" />
    <path d="M22 4 h18 v14 h-18 z" fill="#1d4ed8" /><path d="M24 4 l4 -6 l4 6 l4 -6 l4 6 z" fill="#fff" />
    <Shine d="M-52 -40 C-56 0 -54 50 -52 84 C-60 50 -62 0 -56 -46 Z" o={0.14} />
  </g>
);

export const Casual = () => (
  <g>
    <Shadow rx={110} />
    {/* jinsi */}
    <path d="M-42 8 L42 8 L48 92 L14 92 L0 34 L-14 92 L-48 92 Z" fill="#2563eb" />
    <path d="M-42 8 L42 8 L42 22 L-42 22 Z" fill="#1d4ed8" />
    <path d="M0 22 L0 40" stroke="#93c5fd" strokeWidth="2" />
    <path d="M-30 30 L-26 88 M30 30 L26 88" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
    {/* futbolka */}
    <path d="M-44 -62 L-76 -34 L-58 -12 L-42 -26 L-42 24 L42 24 L42 -26 L58 -12 L76 -34 L44 -62 C24 -48 -24 -48 -44 -62 Z" fill="#f8fafc" />
    <path d="M-44 -62 C-24 -46 24 -46 44 -62 C30 -38 -30 -38 -44 -62 Z" fill="#e2e8f0" />
    <circle cx="0" cy="-8" r="16" fill="#10b981" /><path d="M-8 -8 h16 M0 -16 v16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    {/* kepka */}
    <g transform="translate(118 46)">
      <path d="M-30 6 C-30 -20 30 -20 30 6 Z" fill="#f59e0b" /><path d="M-8 6 L44 6 C44 14 -4 14 -8 6 Z" fill="#d97706" /><circle cx="0" cy="-12" r="3.5" fill="#fbbf24" />
    </g>
  </g>
);

export const Dress = () => (
  <g>
    <Shadow rx={110} />
    <Hanger y={-72} />
    <path d="M-22 -60 L-14 -60 L0 -44 L14 -60 L22 -60 L24 -8 L-24 -8 Z" fill="#db2777" />
    <path d="M-24 -10 L24 -10 C32 30 48 60 60 90 Q0 108 -60 90 C-48 60 -32 30 -24 -10 Z" fill="#ec4899" />
    {[-30, -12, 8, 28].map((x, i) => <path key={i} d={`M${x * 0.3} -4 C${x} 30 ${x * 1.6} 60 ${x * 1.9} 92`} stroke="#fbcfe8" strokeWidth="2.5" opacity="0.45" fill="none" />)}
    <rect x="-26" y="-14" width="52" height="11" rx="3" fill="#fbbf24" /><rect x="-5" y="-15" width="10" height="13" rx="2" fill="#f59e0b" />
    <Shine d="M-20 -6 C-32 30 -46 62 -56 88 C-40 62 -28 30 -14 -6 Z" o={0.2} />
    {/* tufli */}
    <g transform="translate(122 56)">
      <path d="M-32 -6 C-32 -26 -20 -30 -10 -22 L8 -4 L30 0 C38 2 38 16 30 16 L-24 16 Z" fill="#f8fafc" />
      <path d="M-32 6 L-24 6 L-26 40 L-32 40 Z" fill="#cbd5e1" />
      <path d="M-30 12 L30 12 L30 16 L-24 16 Z" fill="#ec4899" />
    </g>
    {[[-108, -40], [-84, 40], [100, -46]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 3} Z`} fill="#fff" opacity="0.85" />)}
  </g>
);

export const Kids = () => (
  <g>
    <Shadow rx={120} />
    {/* sharlar */}
    {[[-104, -26, "#f472b6"], [-76, -56, "#fbbf24"]].map(([x, y, c], i) => (
      <g key={i}>
        <path d={`M${x} ${y + 26} C${x + 6} ${y + 60} ${x - 6} ${y + 84} ${x + 4} ${y + 116}`} stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
        <ellipse cx={x} cy={y} rx="22" ry="26" fill={c} /><ellipse cx={x - 7} cy={y - 8} rx="5" ry="8" fill="#fff" opacity="0.4" />
      </g>
    ))}
    <path d="M-38 6 L38 6 L44 64 L14 64 L0 30 L-14 64 L-44 64 Z" fill="#f97316" />
    <path d="M-38 6 L38 6 L38 16 L-38 16 Z" fill="#ea580c" />
    <path d="M-44 -54 L-72 -30 L-56 -8 L-40 -22 L-40 26 L40 26 L40 -22 L56 -8 L72 -30 L44 -54 C24 -40 -24 -40 -44 -54 Z" fill="#38bdf8" />
    <path d="M-44 -54 C-24 -38 24 -38 44 -54 C30 -32 -30 -32 -44 -54 Z" fill="#0ea5e9" />
    <path d="M0 -20 L6 -6 L22 -5 L10 5 L14 20 L0 12 L-14 20 L-10 5 L-22 -5 L-6 -6 Z" fill="#fde047" />
    {/* paypoq */}
    <g transform="translate(112 62)">
      <path d="M-24 -8 C-24 -22 6 -22 8 -8 L26 -2 C34 0 34 14 26 14 L-24 14 Z" fill="#a3e635" /><rect x="-24" y="10" width="52" height="7" rx="3" fill="#fff" />
      <path d="M-12 -12 l4 4 M-4 -14 l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  </g>
);

/* ---------------- BIZNES / IJARA / TURIZM ---------------- */

export const Hotel = ({ seed = 0 }) => (
  <g>
    <Shadow rx={150} />
    <circle cx="128" cy="-74" r="17" fill="#fef3c7" opacity="0.92" />
    {[[-138, -70], [-116, -92], [148, -40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#fff" opacity="0.8" />)}
    <rect x="-132" y="-18" width="60" height="110" rx="3" fill="#334155" />
    <rect x="72" y="-44" width="60" height="136" rx="3" fill="#475569" />
    {[0, 1, 2, 3].map((r) => [0, 1].map((c) => <rect key={`l${r}${c}`} x={-122 + c * 26} y={-6 + r * 24} width="16" height="12" rx="2" fill={(r + c + seed) % 3 ? "#64748b" : "#fde68a"} />))}
    {[0, 1, 2, 3, 4].map((r) => [0, 1].map((c) => <rect key={`r${r}${c}`} x={82 + c * 26} y={-32 + r * 24} width="16" height="12" rx="2" fill={(r * 2 + c + seed) % 3 === 0 ? "#fde68a" : "#64748b"} />))}
    <rect x="-68" y="-86" width="136" height="180" rx="4" fill="#1e293b" />
    <rect x="-68" y="-86" width="136" height="8" rx="4" fill="#0f172a" />
    {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3].map((c) => (
      <rect key={`${r}${c}`} x={-54 + c * 28} y={-66 + r * 26} width="18" height="15" rx="2" fill={(r * 3 + c * 5 + seed * 2) % 4 === 0 ? "#fde68a" : (r + c + seed) % 5 === 0 ? "#fbbf24" : "#334155"} />
    )))}
    <rect x="-16" y="-108" width="32" height="24" rx="7" fill="#10b981" />
    <path d="M-8 -101 v10 M8 -101 v10 M-8 -96 h16" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    <rect x="-15" y="62" width="30" height="32" fill="#0f172a" /><rect x="-1" y="62" width="2" height="32" fill="#334155" />
    <path d="M-34 60 L34 60 L42 46 L-42 46 Z" fill="#ef4444" />
    {[-30, -10, 10, 30].map((x, i) => <path key={i} d={`M${x} 60 L${x + 6} 46 L${x + 14} 46 L${x + 8} 60 Z`} fill="#fff" opacity="0.9" transform="translate(-4 0) scale(0.95 1)" />)}
  </g>
);

export const Tower = () => (
  <g>
    <path d="M-170 96 L-116 -18 L-76 34 L-24 -52 L38 42 L96 -8 L170 96 Z" fill="#64748b" opacity="0.85" />
    <path d="M-116 -18 L-100 12 L-112 6 L-122 14 Z M-24 -52 L-6 -20 L-18 -26 L-30 -18 Z M96 -8 L108 14 L98 8 L88 14 Z" fill="#f8fafc" opacity="0.9" />
    <circle cx="-96" cy="-58" r="24" fill="#fde68a" opacity="0.95" /><circle cx="-96" cy="-58" r="34" fill="#fde68a" opacity="0.22" />
    <path d="M-170 96 C-120 56 -60 62 0 80 C60 60 120 52 170 96 Z" fill="#334155" />
    {/* teleminora */}
    <path d="M50 92 L57 -26 L63 -26 L70 92 Z" fill="#e2e8f0" />
    <path d="M57 -26 L63 -26 L62 -8 L58 -8 Z" fill="#cbd5e1" />
    <ellipse cx="60" cy="-30" rx="16" ry="7.5" fill="#f8fafc" /><rect x="49" y="-24" width="22" height="10" rx="5" fill="#f1f5f9" />
    <rect x="59" y="-108" width="2.4" height="80" fill="#cbd5e1" /><circle cx="60.2" cy="-110" r="3.2" fill="#ef4444" />
    {[-140, -118, 116, 140].map((x, i) => <path key={i} d={`M${x} 84 L${x - 9} 100 L${x + 9} 100 Z M${x} 72 L${x - 7} 88 L${x + 7} 88 Z`} fill="#15803d" />)}
  </g>
);

export const Nature = () => (
  <g>
    <path d="M-170 96 L-110 -30 L-62 30 L-8 -60 L50 44 L110 -14 L170 96 Z" fill="#64748b" opacity="0.9" />
    <path d="M-8 -60 L14 -20 L2 -28 L-8 -18 L-22 -28 Z M-110 -30 L-92 6 L-104 -2 L-116 8 Z" fill="#f8fafc" />
    <circle cx="112" cy="-66" r="22" fill="#fde68a" /><circle cx="112" cy="-66" r="32" fill="#fde68a" opacity="0.22" />
    <path d="M-170 96 C-100 60 -40 70 20 84 C80 66 130 60 170 96 Z" fill="#166534" />
    <path d="M-60 96 C-30 80 20 78 70 96 Z" fill="#38bdf8" opacity="0.85" />
    {[-130, -104, 104, 132].map((x, i) => <path key={i} d={`M${x} 60 L${x - 12} 92 L${x + 12} 92 Z M${x} 40 L${x - 10} 70 L${x + 10} 70 Z`} fill={i % 2 ? "#15803d" : "#166534"} />)}
    {/* chodir */}
    <g transform="translate(-30 60)">
      <path d="M-30 32 L0 -22 L30 32 Z" fill="#f97316" /><path d="M0 -22 L30 32 L6 32 Z" fill="#ea580c" /><path d="M-7 32 L0 8 L7 32 Z" fill="#7c2d12" />
    </g>
    <g transform="translate(46 70)"><path d="M0 -12 C-10 -4 -8 6 0 10 C8 6 10 -4 0 -12 Z" fill="#f97316" /><path d="M0 -4 C-4 0 -3 4 0 6 C3 4 4 0 0 -4 Z" fill="#fde047" /></g>
  </g>
);

export const Car = () => (
  <g>
    <rect x="-170" y="90" width="340" height="10" fill="#fff" opacity="0.14" />
    <ellipse cx="6" cy="94" rx="130" ry="9" fill="#000" opacity="0.28" />
    <path d="M-116 44 C-116 22 -96 14 -66 10 L-34 -20 C-24 -30 -8 -34 16 -34 L48 -34 C70 -34 84 -20 94 6 L110 12 C120 14 124 26 124 38 L124 54 L-116 54 Z" fill="#ef4444" />
    <path d="M-30 6 L-4 -22 C0 -26 6 -26 12 -26 L22 -26 L22 6 Z" fill="#bae6fd" />
    <path d="M30 -26 L48 -26 C60 -26 70 -14 78 6 L30 6 Z" fill="#bae6fd" />
    <path d="M-30 6 L-4 -22 C0 -26 6 -26 12 -26 L4 6 Z" fill="#fff" opacity="0.35" />
    <rect x="24" y="-26" width="4" height="34" fill="#dc2626" />
    <path d="M-100 34 L112 34" stroke="#b91c1c" strokeWidth="3" />
    <path d="M-100 26 C-40 20 40 20 110 24" stroke="#fff" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
    <rect x="108" y="24" width="16" height="9" rx="4" fill="#fde68a" /><rect x="-118" y="26" width="10" height="9" rx="4" fill="#fecaca" />
    <rect x="-12" y="16" width="14" height="4" rx="2" fill="#7f1d1d" /><rect x="52" y="16" width="14" height="4" rx="2" fill="#7f1d1d" />
    {[[-66, 54], [70, 54]].map(([x, y], i) => (
      <g key={i}><circle cx={x} cy={y} r="24" fill="#0f172a" /><circle cx={x} cy={y} r="14" fill="#cbd5e1" /><circle cx={x} cy={y} r="5" fill="#64748b" />
        {[0, 72, 144, 216, 288].map((a) => <path key={a} d={`M${x} ${y} L${x + Math.cos((a * Math.PI) / 180) * 13} ${y + Math.sin((a * Math.PI) / 180) * 13}`} stroke="#94a3b8" strokeWidth="2.5" />)}</g>
    ))}
  </g>
);

/* ---------------- TA'LIM ---------------- */

export const Blocks = () => (
  <g>
    <Shadow rx={130} />
    <g transform="translate(-58 62) rotate(-5)"><rect x="-32" y="-30" width="64" height="64" rx="8" fill="#ef4444" /><rect x="-32" y="22" width="64" height="12" rx="6" fill="#b91c1c" /><path d="M-16 16 L0 -18 L16 16 M-9 4 L9 4" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
    <g transform="translate(24 62) rotate(4)"><rect x="-32" y="-30" width="64" height="64" rx="8" fill="#3b82f6" /><rect x="-32" y="22" width="64" height="12" rx="6" fill="#1d4ed8" /><path d="M-10 -18 V16 H4 C18 16 18 0 4 0 H-10 M-10 0 H2 C14 0 14 -18 2 -18 H-10" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
    <g transform="translate(-16 0) rotate(-3)"><rect x="-32" y="-30" width="64" height="64" rx="8" fill="#fbbf24" /><rect x="-32" y="22" width="64" height="12" rx="6" fill="#d97706" /><path d="M14 -12 A18 18 0 1 0 14 12" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" /></g>
    <g transform="translate(112 -30)">
      <path d="M0 26 C6 56 -6 78 4 108" stroke="#e2e8f0" strokeWidth="1.5" fill="none" /><ellipse rx="24" ry="28" fill="#f472b6" /><ellipse cx="-8" cy="-8" rx="5" ry="9" fill="#fff" opacity="0.4" />
    </g>
    <path d="M-110 -30 L-104 -14 L-88 -12 L-100 -2 L-96 14 L-110 6 L-124 14 L-120 -2 L-132 -12 L-116 -14 Z" fill="#fde047" />
  </g>
);

export const Books = () => (
  <g>
    <Shadow rx={130} />
    <g transform="translate(-124 40) rotate(-24)"><rect x="-5" y="-50" width="10" height="90" rx="2" fill="#fbbf24" /><path d="M-5 40 L0 56 L5 40 Z" fill="#fde68a" /><path d="M-2 51 L0 56 L2 51 Z" fill="#334155" /><rect x="-5" y="-50" width="10" height="9" rx="2" fill="#f472b6" /></g>
    <rect x="-92" y="52" width="184" height="38" rx="4" fill="#2563eb" /><rect x="-86" y="58" width="176" height="26" rx="2" fill="#f8fafc" /><rect x="-92" y="52" width="14" height="38" rx="4" fill="#1d4ed8" />
    <path d="M-70 64 H80 M-70 71 H80 M-70 78 H70" stroke="#cbd5e1" strokeWidth="1.5" />
    <rect x="-74" y="14" width="158" height="36" rx="4" fill="#ef4444" /><rect x="-68" y="20" width="150" height="24" rx="2" fill="#f8fafc" /><rect x="-74" y="14" width="14" height="36" rx="4" fill="#b91c1c" />
    <path d="M-52 26 H74 M-52 33 H74 M-52 40 H60" stroke="#cbd5e1" strokeWidth="1.5" />
    <rect x="-58" y="-22" width="130" height="34" rx="4" fill="#10b981" /><rect x="-52" y="-16" width="122" height="22" rx="2" fill="#f8fafc" /><rect x="-58" y="-22" width="14" height="34" rx="4" fill="#047857" />
    <g transform="translate(6 -34)">
      <path d="M-30 -2 L-30 18 C-20 28 20 28 30 18 L30 -2 L0 10 Z" fill="#1f2937" />
      <path d="M0 -30 L66 -8 L0 14 L-66 -8 Z" fill="#111827" /><path d="M0 -30 L66 -8 L0 14 Z" fill="#0f172a" />
      <circle cx="0" cy="-8" r="3.5" fill="#fbbf24" />
      <path d="M0 -8 L58 -4 L58 22" stroke="#fbbf24" strokeWidth="2.5" fill="none" /><rect x="54" y="20" width="8" height="18" rx="4" fill="#fbbf24" />
    </g>
  </g>
);

/* ---------------- SPORT ---------------- */

export const Ribbon = () => (
  <g>
    <Shadow rx={120} />
    <circle cx="86" cy="18" r="50" fill="none" stroke="#fbbf24" strokeWidth="9" /><circle cx="86" cy="18" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4" strokeDasharray="8 10" />
    <path d="M-128 72 C-108 -44 -60 -74 -30 -22 S24 92 52 12 S92 -56 128 -66" stroke="#f472b6" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M-128 72 C-108 -44 -60 -74 -30 -22 S24 92 52 12 S92 -56 128 -66" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45" transform="translate(0 -3)" />
    <path d="M-124 66 C-100 -20 -70 -40 -50 -6" stroke="#c084fc" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
    <rect x="-140" y="66" width="7" height="34" rx="3.5" fill="#f8fafc" transform="rotate(14 -136 66)" />
    {[[-70, -60], [20, 70], [130, 60]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z`} fill="#fff" opacity="0.85" />)}
  </g>
);

const Glove = ({ flip = 1 }) => (
  <g transform={`scale(${flip} 1)`}>
    <rect x="-30" y="34" width="60" height="42" rx="8" fill="#f3f4f6" /><rect x="-30" y="46" width="60" height="8" fill="#1f2937" /><path d="M-22 60 h44" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M-36 -46 C-36 -80 36 -80 36 -46 L40 12 C40 30 26 38 0 38 C-26 38 -40 30 -40 12 Z" fill="#dc2626" />
    <path d="M-38 -6 C-64 -4 -62 30 -34 32" fill="#b91c1c" />
    <ellipse cx="-30" cy="-6" rx="20" ry="24" fill="#b91c1c" transform="rotate(20 -30 -6)" />
    <path d="M-22 -56 C-28 -40 -30 -10 -28 20 C-34 -10 -34 -46 -22 -56 Z" fill="#fff" opacity="0.28" />
    <path d="M10 -62 C24 -58 30 -42 30 -20" stroke="#fff" strokeWidth="4" fill="none" opacity="0.2" strokeLinecap="round" />
  </g>
);

export const Gloves = () => (
  <g>
    <Shadow rx={130} />
    <g transform="translate(-52 0) rotate(-16)"><Glove /></g>
    <g transform="translate(56 6) rotate(18)"><Glove flip={-1} /></g>
    {[[0, -66, 1.2], [-104, -60, 0.8], [112, -64, 0.9]].map(([x, y, s], i) => <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z" fill="#fff" opacity="0.85" />)}
  </g>
);

export const Dumbbell = () => (
  <g>
    <Shadow rx={150} />
    <path d="M-150 -70 H-84 L-70 -100 L-52 -44 L-38 -80 L-26 -70 H150" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    <rect x="-124" y="-7" width="248" height="14" rx="7" fill="#cbd5e1" /><rect x="-124" y="-7" width="248" height="5" rx="2.5" fill="#fff" opacity="0.4" />
    <rect x="-104" y="-50" width="22" height="100" rx="7" fill="#111827" /><rect x="-124" y="-34" width="18" height="68" rx="6" fill="#1f2937" /><rect x="-100" y="-40" width="6" height="80" rx="3" fill="#f43f5e" />
    <rect x="82" y="-50" width="22" height="100" rx="7" fill="#111827" /><rect x="106" y="-34" width="18" height="68" rx="6" fill="#1f2937" /><rect x="94" y="-40" width="6" height="80" rx="3" fill="#f43f5e" />
    <rect x="-80" y="-14" width="10" height="28" rx="3" fill="#94a3b8" /><rect x="70" y="-14" width="10" height="28" rx="3" fill="#94a3b8" />
    <g transform="translate(0 62)">
      <path d="M-14 -22 C-20 -60 20 -60 14 -22" stroke="#111827" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle r="28" fill="#111827" /><ellipse cx="-9" cy="-9" rx="7" ry="10" fill="#fff" opacity="0.2" /><text x="0" y="8" textAnchor="middle" fill="#f43f5e" fontSize="18" fontWeight="800" fontFamily="Manrope, system-ui, sans-serif">16</text>
    </g>
  </g>
);

export const Pin = () => (
  <g>
    <Shadow rx={60} />
    <path d="M0 92 C-50 40 -66 16 -66 -20 C-66 -58 -36 -84 0 -84 C36 -84 66 -58 66 -20 C66 16 50 40 0 92 Z" fill="#f8fafc" />
    <circle cx="0" cy="-20" r="24" fill="#10b981" />
    <Shine d="M-52 -30 C-52 -56 -34 -72 -14 -76 C-38 -62 -44 -44 -44 -20 Z" o={0.5} />
  </g>
);

export const SCENES = {
  burger: Burger, wrap: Wrap, chicken: Chicken, plov: Plov, doner: Doner, kebab: Kebab,
  suit: Suit, casual: Casual, dress: Dress, kids: Kids,
  hotel: Hotel, tower: Tower, nature: Nature, car: Car,
  blocks: Blocks, books: Books, ribbon: Ribbon, gloves: Gloves, dumbbell: Dumbbell, pin: Pin,
};
