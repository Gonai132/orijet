import "./navbar.css";
import { Link } from "react-router-dom";
import logo from "../../img/logoSmall.png";

export default function Navbar() {
  return (
    <header className="navbar-desktop">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <img src={logo} alt="OriJet logo" className="brand-logo" />
          <span className="brand-text">OriJet</span>
        </Link>

        <nav className="menu">
          <Link to="/offers" className="menu-item">Oferty</Link>
          <Link to="/map" className="menu-item">Mapa połączeń</Link>
          <Link to="/my-flights" className="menu-item">Moje loty</Link>
          <Link to="/contact" className="menu-item">Kontakt</Link>
          <Link to="/login" className="menu-item accent">Zaloguj się</Link>
        </nav>
      </div>
    </header>
  );
}