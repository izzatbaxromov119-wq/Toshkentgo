import PlaceArt from "../components/PlaceArt.jsx";

// Barcha rasmlarni bir joyda ko'rish uchun (faqat ishlab chiqish rejimida): /art-gallery
const SAMPLES = [
  ["Burger Zone", "fast-food", "budget"], ["Lavash House", "fast-food", "budget"], ["Crispy Chicken Point", "fast-food", "standard"],
  ["Prime Burger Lounge", "fast-food", "premium"], ["Toshkent Plov Markazi", "milliy-taom", "budget"], ["Registon Milliy Restoran", "milliy-taom", "premium"],
  ["Istanbul Doner", "turk-taom", "budget"], ["Anadolu Kebab House", "turk-taom", "standard"], ["Gentleman Classic", "kiyim-erkak", "standard"],
  ["Erkaklar Olami", "kiyim-erkak", "budget"], ["Lola Boutique", "kiyim-ayol", "premium"], ["Bolajon Kiyim Olami", "kiyim-bola", "budget"],
  ["Panorama Grand Hotel", "ijara", "premium"], ["Tele Minora Ko'rgazma Nuqtasi", "turistik", "budget"], ["Chirchiq Dam Olish Maskani", "turistik", "budget"],
  ["Avto Markaz Toshkent", "avtosalon", "budget"], ["Quvnoq Bog'cha", "bogcha", "premium"],
  ["Zukko O'quv Markazi", "oquv-markaz", "standard"], ["Grace Gimnastika Studiyasi", "gimnastika", "standard"], ["Chempion Boks Klubi", "boks", "budget"],
  ["Elite Fitness Club", "fitness", "premium"],
];

export default function ArtGallery() {
  return (
    <div className="container section">
      <h2>Rasmlar galereyasi</h2>
      <div className="grid">
        {SAMPLES.map(([name, category_slug, price_level]) => (
          <div key={name} className="place-card">
            <div className="place-photo"><PlaceArt place={{ name, category_slug, price_level }} /></div>
            <div className="place-body"><h3>{name}</h3></div>
          </div>
        ))}
      </div>
    </div>
  );
}
