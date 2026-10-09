import { useSearchParams } from "react-router-dom";

import FilterPills from "../components/FilterPills.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import { REGIONS } from "../constants.js";
import { toQuery, useApi } from "../hooks/usePlaces.js";

const SORTS = [
  { value: "", label: "Odatiy" },
  { value: "rating", label: "Reyting bo'yicha" },
  { value: "cheap", label: "Avval arzonlari" },
  { value: "expensive", label: "Avval qimmatlari" },
  { value: "discount", label: "Eng katta chegirma" },
];

// Filtrlar URL ichida saqlanadi (masalan /places?price_level=budget&q=boks),
// shuning uchun havolani do'stga yuborsa ham, xuddi shu natija chiqadi.
export default function PlacesPage() {
  const [params, setParams] = useSearchParams();
  const filters = {
    q: params.get("q") || "",
    region: params.get("region") || "",
    category: params.get("category") || "",
    price_level: params.get("price_level") || "",
    has_discount: params.get("has_discount") || "",
    ordering: params.get("ordering") || "",
    page: params.get("page") || "",
  };

  const { data, loading, error } = useApi(`/places/?${toQuery(filters)}`);
  const { data: categories } = useApi("/categories/");

  // Bitta filtrni o'zgartiradi (va sahifani 1-ga qaytaradi)
  function setFilter(name, value) {
    setParams(toQuery({ ...filters, [name]: value, page: name === "page" ? value : "" }));
  }

  const groups = (categories || []).filter((c) => !c.parent);
  const page = Number(filters.page || 1);

  return (
    <div className="container section">
      <h2>Joylar</h2>

      <div className="filters">
        <input
          className="input"
          placeholder="Nom yoki manzil bo'yicha qidirish"
          defaultValue={filters.q}
          onKeyDown={(e) => e.key === "Enter" && setFilter("q", e.target.value)}
          onBlur={(e) => e.target.value !== filters.q && setFilter("q", e.target.value)}
        />

        <select className="input" value={filters.region} onChange={(e) => setFilter("region", e.target.value)}>
          {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>

        <select className="input" value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="">Barcha kategoriyalar</option>
          {groups.map((group) => (
            <optgroup key={group.id} label={group.name}>
              <option value={group.slug}>Hammasi — {group.name}</option>
              {categories.filter((c) => c.parent === group.id).map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <select className="input" value={filters.ordering} onChange={(e) => setFilter("ordering", e.target.value)}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="filter-row">
        <FilterPills value={filters.price_level} onChange={(v) => setFilter("price_level", v)} />
        <button
          className={`pill pill-deal ${filters.has_discount ? "active" : ""}`}
          onClick={() => setFilter("has_discount", filters.has_discount ? "" : "1")}
        >
          Chegirmali
        </button>
      </div>

      {loading && <p className="muted">Yuklanmoqda...</p>}
      {error && <p className="form-error">{error}</p>}
      {data && <p className="muted">{data.count} ta joy topildi</p>}

      <div className="grid">
        {data?.results.map((place) => <PlaceCard key={place.id} place={place} />)}
      </div>

      {data && (data.previous || data.next) && (
        <div className="center pager">
          <button className="btn btn-ghost-dark" disabled={!data.previous} onClick={() => setFilter("page", String(page - 1))}>
            Oldingi
          </button>
          <span>{page}-sahifa</span>
          <button className="btn btn-ghost-dark" disabled={!data.next} onClick={() => setFilter("page", String(page + 1))}>
            Keyingi
          </button>
        </div>
      )}
    </div>
  );
}
