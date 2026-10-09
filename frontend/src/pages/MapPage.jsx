import { MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import FilterPills from "../components/FilterPills.jsx";
import PlaceMap from "../components/PlaceMap.jsx";
import { LEVELS } from "../constants.js";
import { toQuery, useApi } from "../hooks/usePlaces.js";

// Xarita sahifasi: chapda ro'yxat, o'ngda xarita. Ikkalasi ham bir-biri bilan bog'liq.
export default function MapPage() {
  const [level, setLevel] = useState("");
  const [selected, setSelected] = useState(null);
  const { data: places, loading, error } = useApi(`/places/map/?${toQuery({ price_level: level })}`);

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Xaritada joylar</h2>
        <FilterPills value={level} onChange={(v) => { setLevel(v); setSelected(null); }} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="map-layout">
        <aside className="map-list">
          {loading && <p className="muted">Yuklanmoqda...</p>}

          {(places || []).map((place) => (
            <button
              key={place.id}
              className={`map-item ${selected?.id === place.id ? "active" : ""}`}
              onClick={() => setSelected(place)}
            >
              <span className="dot" style={{ background: LEVELS[place.price_level]?.color }} />
              <span>
                <strong>{place.name}</strong>
                <small>{place.category_name} · {place.price_text}</small>
              </span>
              {place.discount_percent && <span className="mini-discount">-{place.discount_percent}%</span>}
            </button>
          ))}
        </aside>

        <div>
          <PlaceMap places={places || []} selected={selected} onSelect={setSelected} destination={selected} height={560} />

          {selected && (
            <div className="selected-card">
              <h3>{selected.name}</h3>
              <p><MapPin size={15} /> {selected.address}</p>
              <p><Phone size={15} /> <a href={`tel:${selected.phone}`}>{selected.phone}</a></p>
              <p><strong>{selected.price_text}</strong></p>
              <Link to={`/places/${selected.slug}`} className="btn btn-primary btn-small">Batafsil</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
