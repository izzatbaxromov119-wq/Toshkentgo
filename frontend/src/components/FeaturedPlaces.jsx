import { useState } from "react";
import { Link } from "react-router-dom";

import { toQuery, useApi } from "../hooks/usePlaces.js";
import FilterPills from "./FilterPills.jsx";
import PlaceCard from "./PlaceCard.jsx";

// Bosh sahifadagi "Tavsiya etilgan joylar" bo'limi
export default function FeaturedPlaces() {
  const [level, setLevel] = useState("");
  const { data, loading, error } = useApi(`/places/?${toQuery({ price_level: level, ordering: "rating" })}`);
  const places = data?.results.slice(0, 6) || [];

  return (
    <section className="container section">
      <div className="section-head">
        <h2>Tavsiya etilgan joylar</h2>
        <FilterPills value={level} onChange={setLevel} />
      </div>

      {loading && <p className="muted">Yuklanmoqda...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && places.length === 0 && <p className="muted">Bu toifada hozircha joy yo'q.</p>}

      <div className="grid">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      <div className="center">
        <Link to="/places" className="btn btn-ghost-dark">Barcha joylarni ko'rish</Link>
      </div>
    </section>
  );
}
