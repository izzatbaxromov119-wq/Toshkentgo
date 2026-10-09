import { Gem, ThumbsUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

import { LEVELS } from "../constants.js";

const CARDS = [
  { level: "budget", Icon: Wallet, title: "Budjet", text: "Arzon va qulay", from: "100 000" },
  { level: "standard", Icon: ThumbsUp, title: "Standart", text: "Yaxshi sharoit", from: "300 000" },
  { level: "premium", Icon: Gem, title: "Premium", text: "Yuqori daraja", from: "700 000" },
];

export default function CategoryCards() {
  return (
    <section className="container category-cards">
      {CARDS.map(({ level, Icon, title, text, from }) => (
        <Link key={level} to={`/places?price_level=${level}`} className="category-card">
          <span className="category-icon" style={{ background: `${LEVELS[level].color}22`, color: LEVELS[level].color }}>
            <Icon size={26} />
          </span>
          <div>
            <h3 style={{ color: LEVELS[level].color }}>{title}</h3>
            <p>{text}</p>
            <strong>{from} so'mdan</strong>
          </div>
        </Link>
      ))}
    </section>
  );
}
