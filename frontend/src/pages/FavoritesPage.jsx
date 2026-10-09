import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import PlaceCard from "../components/PlaceCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/usePlaces.js";

export default function FavoritesPage() {
  const { user, openAuth } = useAuth();

  if (!user) {
    return (
      <div className="container section narrow">
        <h2>Sevimlilar</h2>
        <p className="muted">Sevimli joylaringizni ko'rish uchun tizimga kiring.</p>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAuth}>Kirish</button>
      </div>
    );
  }
  return <FavoritesList />;
}

function FavoritesList() {
  const { data, loading, error } = useApi("/places/favorites/");
  return (
    <div className="container section">
      <h2>Sevimlilar</h2>
      {loading && <p className="muted">Yuklanmoqda...</p>}
      {error && <p className="form-error">{error}</p>}
      {data?.length === 0 && (
        <p className="muted">
          <Heart size={16} /> Hozircha sevimli joy yo'q. Kartochkadagi yurakchani bosing yoki{" "}
          <Link to="/places" style={{ textDecoration: "underline" }}>joylarni ko'ring</Link>.
        </p>
      )}
      <div className="grid">{data?.map((place) => <PlaceCard key={place.id} place={place} />)}</div>
    </div>
  );
}
