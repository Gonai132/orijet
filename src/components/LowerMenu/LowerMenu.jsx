import "./lowerMenu.css";
import { Link } from "react-router-dom";
import { FaHouse, FaCartShopping, FaUser, FaPlaneUp, FaMapLocationDot } from "react-icons/fa6";
export default function LowerMenu() {
  return (
    <nav className="lower-menu" aria-label="Dolne menu">
      <Link to="/" className="lm-item" aria-label="Strona główna">
        <FaHouse />
      </Link>
      <Link to="/login" className="lm-item" aria-label="Profil">
        <FaUser />
      </Link>
      <Link to="/map" className="lm-item" aria-label="Mapa połączeń">
        <FaMapLocationDot size={35} />
      </Link>
      <Link to="/offers" className="lm-item" aria-label="Loty promocyjne">
        <FaPlaneUp />
      </Link>
    </nav>
  );
}