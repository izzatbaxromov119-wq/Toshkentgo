import { LEVELS, LEVEL_FILTERS } from "../constants.js";

// "Barchasi / Budjet / Standart / Premium" tugmalari
export default function FilterPills({ value, onChange }) {
  return (
    <div className="pills">
      {LEVEL_FILTERS.map((item) => {
        const active = value === item.value;
        const color = LEVELS[item.value]?.color;
        return (
          <button
            key={item.value}
            className={`pill ${active ? "active" : ""}`}
            style={active && color ? { background: color, borderColor: color } : undefined}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
