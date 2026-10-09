import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink, Navigation } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";

import { DEMO, LEVELS, TASHKENT_CENTER } from "../constants.js";

// Demo rejimda tashqi plitkalar bo'lmaydi — o'rniga vektor Toshkent xaritasi (faqat demo bundle'ga kiradi)
const DemoBasemap = import.meta.env.VITE_DEMO ? lazy(() => import("./DemoBasemap.jsx")) : null;

// Xarita plitkalari: CARTO (OpenStreetMap ma'lumotlari asosida), kunduzgi va tungi uslub.
// Diqqat: CARTO bepul rejasi kam yuklamali/notijorat loyihalar uchun. Katta loyihada
// MapTiler / Mapbox / o'z serveringizga o'ting — faqat shu yerdagi URL almashadi.
const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

// Foydalanuvchi qurilmasi tungi rejimdami?
function usePrefersDark() {
  const query = "(prefers-color-scheme: dark)";
  const [dark, setDark] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;
    const onChange = (e) => setDark(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return dark;
}

/*
  PlaceMap — butun loyihadagi YAGONA xarita komponenti.
  Google Maps'ga o'tmoqchi bo'lsangiz, faqat shu faylni almashtirasiz.

  Props:
    places      — xaritada ko'rsatiladigan joylar ro'yxati
    selected    — tanlangan joy (kattaroq marker, xarita unga uchadi)
    onSelect    — markerga bosilganda chaqiriladi
    destination — bor bo'lsa, "Yo'l ko'rsatish" tugmasi chiqadi
    height      — xarita balandligi
*/

// Rangli doira ko'rinishidagi marker (rasm fayllari kerak emas)
function pinIcon(color, active) {
  return L.divIcon({
    className: "pin-wrapper",
    html: `<span class="pin ${active ? "pin-active" : ""}" style="background:${color}"></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const toLatLng = (place) => [Number(place.latitude), Number(place.longitude)];

// Uzoqda joylashgan bitta-yarimta joy butun xaritani kichraytirib yubormasligi uchun:
// markazga yaqin joylarni "yadro" deb olamiz va xarita shularga moslanadi.
function coreBounds(places) {
  const points = places.map(toLatLng);
  if (points.length < 4) return points;
  const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const midLat = median(points.map((p) => p[0]));
  const midLng = median(points.map((p) => p[1]));
  const core = points.filter(([lat, lng]) => Math.abs(lat - midLat) < 0.2 && Math.abs(lng - midLng) < 0.25);
  return core.length > 0 ? core : points;
}

// Xaritaning ko'rinishini boshqaradi: marshrut, tanlangan joy yoki barcha markerlarni sig'diradi
function MapController({ places, selected, route }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) map.fitBounds(route, { padding: [50, 50] });
    else if (selected) map.flyTo(toLatLng(selected), Math.min(15, map.getMaxZoom()));
    else if (places.length > 1) map.fitBounds(coreBounds(places), { padding: [40, 40], maxZoom: Math.min(15, map.getMaxZoom()) });
    else if (places.length === 1) map.setView(toLatLng(places[0]), Math.min(15, map.getMaxZoom()));
  }, [places, selected, route, map]);

  return null;
}

// Brauzerdan foydalanuvchi joylashuvini so'raydi
function getMyPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Brauzer joylashuvni qo'llamaydi"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => reject(new Error("Joylashuvingizga ruxsat bering")),
    );
  });
}

export default function PlaceMap({ places, selected, onSelect, destination, height = 480 }) {
  const dark = usePrefersDark();
  const [route, setRoute] = useState([]);   // yo'l chizig'i nuqtalari
  const [info, setInfo] = useState(null);   // { km, minutes }
  const [routeError, setRouteError] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);

  // Boshqa joy tanlansa, eski yo'lni o'chiramiz
  useEffect(() => {
    setRoute([]);
    setInfo(null);
    setRouteError("");
  }, [destination?.slug]);

  async function showRoute() {
    setRouteError("");
    setRouteLoading(true);
    try {
      const from = await getMyPosition();
      const to = toLatLng(destination);

      // OSRM ochiq yo'l xizmati (namuna uchun). Katta loyihada o'z serveringiz yoki
      // Google Directions / OpenRouteService ishlating.
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
      const data = await (await fetch(url)).json();
      const best = data.routes?.[0];
      if (!best) throw new Error("Yo'l topilmadi");

      // GeoJSON [lng, lat] -> Leaflet [lat, lng]
      setRoute(best.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
      setInfo({ km: (best.distance / 1000).toFixed(1), minutes: Math.round(best.duration / 60) });
    } catch (err) {
      setRouteError(err.message || "Yo'lni hisoblab bo'lmadi");
    } finally {
      setRouteLoading(false);
    }
  }

  return (
    <div className={`map-wrap ${DEMO ? "map-demo" : ""}`} style={{ height }}>
      <MapContainer
        center={TASHKENT_CENTER}
        zoom={12}
        zoomSnap={0.25}
        minZoom={DEMO ? 9 : 3}
        maxZoom={DEMO ? 13 : 19}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        {DEMO ? (
          <Suspense fallback={null}>
            <DemoBasemap />
          </Suspense>
        ) : (
          <TileLayer
            key={dark ? "dark" : "light"}
            url={dark ? TILES.dark : TILES.light}
            subdomains="abcd"
            maxZoom={20}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        )}

        {places.map((place) => (
          <Marker
            key={place.id}
            position={toLatLng(place)}
            icon={pinIcon(LEVELS[place.price_level]?.color || "#2563EB", selected?.id === place.id)}
            eventHandlers={{ click: () => onSelect?.(place) }}
          >
            <Tooltip key={selected?.id === place.id ? "on" : "off"} permanent={selected?.id === place.id} direction="top" offset={[0, -16]} className="pin-tip">{place.name}</Tooltip>
          </Marker>
        ))}

        {route.length > 0 && (
          <>
            <Polyline positions={route} pathOptions={{ color: "#2563EB", weight: 5 }} />
            <Marker position={route[0]} icon={pinIcon("#2563EB", true)} />
          </>
        )}

        <MapController places={places} selected={selected} route={route} />
      </MapContainer>

      {destination && (
        <div className="route-panel glass-dark">
          {!DEMO && (
            <button className="btn btn-primary btn-small" onClick={showRoute} disabled={routeLoading}>
              <Navigation size={15} /> {routeLoading ? "Hisoblanmoqda..." : "Yo'l ko'rsatish"}
            </button>
          )}
          <a
            className="btn btn-ghost btn-small"
            href={`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={15} /> Google Maps
          </a>
          {info && <span className="route-info">{info.km} km · ~{info.minutes} daqiqa</span>}
          {routeError && <span className="route-info route-error">{routeError}</span>}
        </div>
      )}
    </div>
  );
}
