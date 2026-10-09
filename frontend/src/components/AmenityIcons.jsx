import { Car, Headphones, Snowflake, Truck, Wifi } from "lucide-react";

// Backenddagi "icon" kaliti -> ikonka va nomi
const ICONS = {
  wifi: { Icon: Wifi, label: "Wi-Fi" },
  parking: { Icon: Car, label: "Avtoturargoh" },
  ac: { Icon: Snowflake, label: "Konditsioner" },
  delivery: { Icon: Truck, label: "Yetkazib berish" },
  callcenter: { Icon: Headphones, label: "Call-markaz bor" },
};

export default function AmenityIcons({ keys = [], withLabel = false }) {
  return (
    <div className="amenities">
      {keys.map((key) => {
        const item = ICONS[key];
        if (!item) return null;
        return (
          <span key={key} className="amenity" title={item.label}>
            <item.Icon size={16} />
            {withLabel && item.label}
          </span>
        );
      })}
    </div>
  );
}
