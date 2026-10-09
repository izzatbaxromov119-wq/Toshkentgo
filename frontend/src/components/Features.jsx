import { Headphones, Search, ShieldCheck, Tag } from "lucide-react";

const FEATURES = [
  { Icon: ShieldCheck, title: "Ishonchli ma'lumotlar", text: "Manzil va telefon raqamlari tekshiriladi" },
  { Icon: Tag, title: "Eng yaxshi narxlar", text: "Har bir joy narx darajasi bilan ko'rsatiladi" },
  { Icon: Search, title: "Qulay qidiruv", text: "Nom, hudud va narx bo'yicha tez topasiz" },
  { Icon: Headphones, title: "24/7 yordam", text: "Savollaringizga har doim javob beramiz" },
];

export default function Features() {
  return (
    <section className="features">
      <div className="container features-grid">
        {FEATURES.map(({ Icon, title, text }) => (
          <div key={title} className="feature">
            <span className="feature-icon"><Icon size={22} /></span>
            <div>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
