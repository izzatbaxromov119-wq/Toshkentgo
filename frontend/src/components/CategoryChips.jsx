import { Baby, BedDouble, Briefcase, Dumbbell, Flame, GraduationCap, Sandwich, Shirt, Soup } from "lucide-react";
import { Link } from "react-router-dom";

// Tez o'tish tugmalari: kategoriya slug'i backenddagi (seed_data) bilan bir xil bo'lishi kerak
const CHIPS = [
  { slug: "fast-food", label: "Fast food", Icon: Sandwich },
  { slug: "milliy-taom", label: "Milliy taomlar", Icon: Soup },
  { slug: "turk-taom", label: "Turk taomlari", Icon: Flame },
  { slug: "kiyim-erkak", label: "Erkaklar kiyimi", Icon: Shirt },
  { slug: "kiyim-ayol", label: "Ayollar kiyimi", Icon: Shirt },
  { slug: "kiyim-bola", label: "Bolalar kiyimi", Icon: Baby },
  { slug: "ijara", label: "Ijara", Icon: BedDouble },
  { slug: "sport", label: "Sport", Icon: Dumbbell },
  { slug: "talim", label: "Ta'lim", Icon: GraduationCap },
  { slug: "biznes", label: "Biznes", Icon: Briefcase },
];

export default function CategoryChips() {
  return (
    <section className="container chips">
      {CHIPS.map(({ slug, label, Icon }) => (
        <Link key={slug} to={`/places?category=${slug}`} className="chip">
          <Icon size={17} /> {label}
        </Link>
      ))}
    </section>
  );
}
