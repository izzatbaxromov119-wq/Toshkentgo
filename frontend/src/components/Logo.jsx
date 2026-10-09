import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark">
        <MapPin size={22} />
      </span>
      <span>
        <strong className="logo-name">TashkentGo</strong>
        <small className="logo-tag">Yaxshi joylar – yaqinroq</small>
      </span>
    </Link>
  );
}
