import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useApi } from "../hooks/usePlaces.js";
import { formatUntil } from "../utils.js";

// Bosh sahifadagi "Chegirmalar" bannerlari (eng katta chegirmalar birinchi)
export default function DiscountBanners() {
  const { data } = useApi("/places/?has_discount=1&ordering=discount");
  const deals = data?.results.slice(0, 3) || [];

  if (deals.length === 0) return null; // chegirma bo'lmasa, bo'lim ko'rinmaydi

  return (
    <section className="container section deals-section">
      <div className="section-head">
        <h2>Chegirmalar</h2>
        <Link to="/places?has_discount=1&ordering=discount" className="btn btn-ghost-dark btn-small">
          Hammasini ko'rish
        </Link>
      </div>

      <div className="deals">
        {deals.map((place, index) => (
          <Link key={place.id} to={`/places/${place.slug}`} className={`deal deal-${index}`}>
            <span className="deal-percent">-{place.discount_percent}%</span>
            <div>
              <h3>{place.name}</h3>
              <p>{place.discount_text}</p>
              <small>{formatUntil(place.discount_until)}</small>
            </div>
            <span className="deal-go"><ArrowRight size={18} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
