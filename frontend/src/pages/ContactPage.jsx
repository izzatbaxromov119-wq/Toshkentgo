import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container section narrow">
      <h2>Bog'lanish</h2>
      <p>Savol, taklif yoki o'z joyingizni qo'shmoqchi bo'lsangiz — bizga yozing.</p>
      <p><Phone size={16} /> +998 90 000 00 00</p>
      <p><Mail size={16} /> info@tashkentgo.uz</p>
    </div>
  );
}
