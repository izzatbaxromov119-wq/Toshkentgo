import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client.js";
import { LEVELS } from "../constants.js";
import { useAuth } from "../context/AuthContext.jsx";
import AmenityIcons from "./AmenityIcons.jsx";
import PlaceArt from "./PlaceArt.jsx";

// Bitta joy kartochkasi
export default function PlaceCard({ place }) {
  const { user, openAuth } = useAuth();
  const [liked, setLiked] = useState(place.is_favorite);
  const level = LEVELS[place.price_level];

  useEffect(() => setLiked(place.is_favorite), [place.is_favorite]);

  async function toggleLike() {
    if (!user) return openAuth(); // kirmagan bo'lsa — kirish oynasi
    const result = await api(`/places/${place.slug}/favorite/`, { method: "POST" });
    setLiked(result.is_favorite);
  }

  return (
    <article className="place-card">
      <div className="place-photo">
        {place.main_image ? (
          <img src={place.main_image} alt={place.name} loading="lazy" />
        ) : (
          <PlaceArt place={place} />
        )}

        <button className={`like-btn ${liked ? "liked" : ""}`} onClick={toggleLike} aria-label="Sevimli">
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>

        {level && (
          <span className="badge" style={{ background: level.color }}>
            {level.label}
          </span>
        )}

        {place.discount_percent && <span className="discount-badge">-{place.discount_percent}%</span>}
      </div>

      <div className="place-body">
        <h3>{place.name}</h3>

        <p className="rating">
          <Star size={15} fill="#F59E0B" color="#F59E0B" />
          <strong>{Number(place.rating_avg).toFixed(1)}</strong>
          <span>({place.reviews_count} ta sharh)</span>
        </p>

        <p className="address">
          <MapPin size={15} /> {place.district ? `${place.district}, ` : ""}Toshkent
        </p>

        <AmenityIcons keys={[...place.amenities, ...(place.call_center ? ["callcenter"] : [])]} />

        <div className="place-footer">
          <div className="price-block">
            {place.discount_price_text && <s className="price-old">{place.price_text}</s>}
            <strong className={`price ${place.discount_price_text ? "sale" : ""}`}>
              {place.discount_price_text || place.price_text}
            </strong>
          </div>
          <Link to={`/places/${place.slug}`} className="btn btn-primary btn-small">
            Batafsil <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
