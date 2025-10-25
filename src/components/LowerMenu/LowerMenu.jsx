import "./lowerMenu.css";
import { Link } from "react-router-dom";
import { FaHouse, FaCartShopping, FaUser, FaPlaneUp } from "react-icons/fa6";
export default function LowerMenu() {
  return (
    <nav className="lower-menu" aria-label="Dolne menu">
      <Link to="/" className="lm-item" aria-label="Strona główna">
        <FaHouse />
      </Link>
      <Link to="/account" className="lm-item" aria-label="Profil">
        <FaUser />
      </Link>
      <Link to="/cart" className="lm-item" aria-label="Koszyk/Rezerwacje">
        <FaCartShopping />
      </Link>
      <Link to="/search" className="lm-item" aria-label="Wyszukaj loty">
        <FaPlaneUp />
      </Link>
    </nav>
  );
}