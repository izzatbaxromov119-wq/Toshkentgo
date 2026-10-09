import { Facebook, Instagram, Send } from "lucide-react";

// Ijtimoiy tarmoq tugmalari (faqat manzili kiritilganlari ko'rsatiladi)
export default function SocialLinks({ place }) {
  const links = [
    { url: place.instagram, label: "Instagram", Icon: Instagram },
    { url: place.telegram, label: "Telegram", Icon: Send },
    { url: place.facebook, label: "Facebook", Icon: Facebook },
  ].filter((item) => item.url);

  if (links.length === 0) return null;

  return (
    <div className="socials-row">
      {links.map(({ url, label, Icon }) => (
        <a key={label} href={url} target="_blank" rel="noreferrer" className="social-circle" aria-label={label}>
          <Icon size={20} />
        </a>
      ))}
    </div>
  );
}
