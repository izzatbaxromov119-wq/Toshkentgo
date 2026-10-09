import { Calendar, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { REGIONS } from "../constants.js";
import { toQuery } from "../hooks/usePlaces.js";
import Skyline from "./Skyline.jsx";

export default function Hero() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ q: "", region: "", date: "" });

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // "Qidirish" bosilganda /places sahifasiga filtrlar bilan o'tamiz
  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/places?${toQuery(form)}`);
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <Skyline />
      </div>

      <div className="container hero-content">
        <h1>Toshkentdagi mos joyni toping</h1>
        <p className="hero-text">
          Siz uchun eng yaxshi narxlar, qulay joylar va ishonchli manzillar bir joyda.
          Arzon, o'rtacha va premium variantlar.
        </p>

        <form className="search-bar glass" onSubmit={handleSubmit}>
          <label className="search-field">
            <Search size={18} />
            <input name="q" placeholder="Joy nomi" value={form.q} onChange={handleChange} />
          </label>

          <label className="search-field">
            <MapPin size={18} />
            <select name="region" value={form.region} onChange={handleChange}>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>

          <label className="search-field">
            <Calendar size={18} />
            <input name="date" type="date" value={form.date} onChange={handleChange} aria-label="Sana (ixtiyoriy)" />
          </label>

          <button className="btn btn-primary">Qidirish</button>
        </form>
      </div>
    </section>
  );
}
