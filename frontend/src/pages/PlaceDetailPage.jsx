import { Clock, Headphones, Mail, MapPin, Phone, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../api/client.js";
import AmenityIcons from "../components/AmenityIcons.jsx";
import PlaceArt from "../components/PlaceArt.jsx";
import PlaceMap from "../components/PlaceMap.jsx";
import SocialLinks from "../components/SocialLinks.jsx";
import { LEVELS } from "../constants.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/usePlaces.js";
import { formatUntil } from "../utils.js";

export default function PlaceDetailPage() {
  const { slug } = useParams();
  const [reloadKey, setReloadKey] = useState(0); // sharh qo'shilgach ma'lumotni yangilash uchun
  const { data: place, loading, error } = useApi(`/places/${slug}/?r=${reloadKey}`);
  const { data: reviews } = useApi(`/places/${slug}/reviews/?r=${reloadKey}`);

  // Xaritaga har safar yangi massiv berilmasligi uchun useMemo
  const mapPlaces = useMemo(() => (place ? [place] : []), [place]);

  // Shu joy allaqachon yuklangan bo'lsa (sharhdan keyingi yangilanish), sahifa miltillamaydi
  const ready = place && place.slug === slug;
  if (!ready && loading) return <div className="container section"><p className="muted">Yuklanmoqda...</p></div>;
  if (error) return <div className="container section"><p className="form-error">{error}</p></div>;
  if (!ready) return null;

  const level = LEVELS[place.price_level];

  // Xaritaga silliq o'tkazadi
  function showOnMap() {
    document.getElementById("place-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  const photo = place.images?.[0]?.image;

  return (
    <div className="container section detail">
      <div className="detail-main">
        <div className="detail-photo">
          {photo ? <img src={photo} alt={place.name} /> : <PlaceArt place={{ ...place, category_slug: place.category.slug }} />}
        </div>

        <span className="badge badge-inline" style={{ background: level?.color }}>{level?.label}</span>
        <h1>{place.name}</h1>
        <p className="muted">{place.category.name}</p>

        <p className="rating">
          <Star size={16} fill="#F59E0B" color="#F59E0B" />
          <strong>{Number(place.rating_avg).toFixed(1)}</strong>
          <span>({place.reviews_count} ta sharh)</span>
        </p>

        {place.description && <p>{place.description}</p>}
        {place.offerings && place.offerings !== place.description && (
          <p><strong>Nima taklif qiladi: </strong>{place.offerings}</p>
        )}

        <AmenityIcons keys={place.amenities} withLabel />

        <h3>Sharhlar</h3>
        <ReviewForm slug={slug} onDone={() => setReloadKey(reloadKey + 1)} />
        {(reviews || []).map((r) => (
          <div key={r.id} className="review">
            <strong>{r.user_name}</strong> <span className="muted">· {r.rating} / 5</span>
            {r.comment && <p>{r.comment}</p>}
          </div>
        ))}
        {reviews?.length === 0 && <p className="muted">Hozircha sharh yo'q. Birinchi bo'ling!</p>}
      </div>

      <aside className="detail-side">
        <div className="info-card">
          {place.discount_percent && (
            <div className="info-deal">
              <span className="info-deal-percent">-{place.discount_percent}%</span>
              <div>
                <strong>Chegirma</strong>
                <p>{place.discount_text}</p>
                <small>{formatUntil(place.discount_until)}</small>
              </div>
            </div>
          )}

          <div className="info-body">
            <div className="price-block">
              {place.discount_price_text && <s className="price-old">{place.price_text}</s>}
              <strong className={`price big ${place.discount_price_text ? "sale" : ""}`}>
                {place.discount_price_text || place.price_text}
              </strong>
            </div>

            <a className="info-row" href={`tel:${place.phone}`}><Phone size={20} /> {place.phone}</a>
            {place.call_center && (
              <a className="info-row" href={`tel:${place.call_center}`}>
                <Headphones size={20} />
                <span className="info-stack">
                  {place.call_center}
                  <small>Call-markaz{place.call_center_hours ? ` · ${place.call_center_hours}` : ""}</small>
                </span>
              </a>
            )}
            {place.email && <a className="info-row" href={`mailto:${place.email}`}><Mail size={20} /> {place.email}</a>}
            {place.working_hours && <p className="info-row"><Clock size={20} /> {place.working_hours}</p>}
            <p className="info-row"><MapPin size={20} /> {place.address}</p>
            <button className="info-row info-link" onClick={showOnMap}>
              <MapPin size={20} /> Xaritada ko'rsatish
            </button>
            {place.website && (
              <a className="info-row info-link" href={place.website} target="_blank" rel="noreferrer">Saytga o'tish</a>
            )}

            <SocialLinks place={place} />
          </div>
        </div>

        <div id="place-map">
          <PlaceMap places={mapPlaces} destination={place} height={340} />
        </div>
      </aside>
    </div>
  );
}

// Sharh yozish formasi (faqat kirgan foydalanuvchilar uchun)
function ReviewForm({ slug, onDone }) {
  const { user, openAuth } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return <button className="btn btn-ghost-dark btn-small" onClick={openAuth}>Sharh yozish uchun kiring</button>;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await api(`/places/${slug}/reviews/`, { method: "POST", body: { rating, comment } });
      setComment("");
      onDone();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <select className="input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} yulduz</option>)}
      </select>
      <input className="input" placeholder="Fikringiz" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="btn btn-primary btn-small">Yuborish</button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
