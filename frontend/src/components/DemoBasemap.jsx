import L from "leaflet";
import { useEffect } from "react";
import { GeoJSON, Marker, Tooltip, useMap } from "react-leaflet";

import base from "../assets/tashkentBase.json";

/*
  DEMO uchun xarita fon. Claude'ning e'lon qilingan sahifalarida tashqi xarita rasmlari
  (OpenStreetMap plitkalari) yuklanmaydi, shuning uchun Toshkentning HAQIQIY tuman chegaralari
  (OpenStreetMap ma'lumotlari asosida) vektor ko'rinishida chiziladi.
  Oddiy (lokal) ishga tushirishda bu fayl ishlatilmaydi — u yerda haqiqiy xarita chiqadi.

  Tuman chegaralari: github.com/akbartus/GeoJSON-Uzbekistan  ©  OpenStreetMap contributors
*/

const LANDMARKS = [
  { name: "Amir Temur xiyoboni", lat: 41.3111, lng: 69.2797 },
  { name: "Teleminora", lat: 41.3396, lng: 69.2852 },
  { name: "Chorsu bozori", lat: 41.3268, lng: 69.2312 },
  { name: "Toshkent aeroporti", lat: 41.2579, lng: 69.2812 },
];

const dotIcon = L.divIcon({ className: "landmark-wrap", html: '<span class="landmark-dot"></span>', iconSize: [14, 14], iconAnchor: [7, 7] });

function styleFeature(feature) {
  const tone = feature.properties.name.length % 3; // tumanlar bir xil rangda bo'lmasligi uchun
  return feature.properties.kind === "district"
    ? { className: `geo-district geo-tone-${tone}`, interactive: false }
    : { className: "geo-region", interactive: false };
}

function labelFeature(feature, layer) {
  const isCity = feature.properties.kind === "district";
  layer.bindTooltip(feature.properties.name, {
    permanent: true,
    direction: "center",
    className: isCity ? "map-label district-label" : "map-label region-label",
  });
}

// Masshtabga qarab yozuvlarni yashiradi (tiqilib qolmasligi uchun)
function ZoomLabels() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    const update = () => {
      const z = map.getZoom();
      el.classList.toggle("hide-region-labels", z >= 11);
      el.classList.toggle("hide-district-labels", z >= 15);
    };
    map.attributionControl.addAttribution("Sxematik xarita · tuman chegaralari © OpenStreetMap");
    map.on("zoomend", update);
    update();
    return () => map.off("zoomend", update);
  }, [map]);
  return null;
}

export default function DemoBasemap() {
  return (
    <>
      <GeoJSON data={base} style={styleFeature} onEachFeature={labelFeature} />
      {LANDMARKS.map((point) => (
        <Marker key={point.name} position={[point.lat, point.lng]} icon={dotIcon} interactive={false}>
          <Tooltip permanent direction="right" offset={[8, 0]} className="map-label landmark-label">{point.name}</Tooltip>
        </Marker>
      ))}
      <ZoomLabels />
    </>
  );
}
