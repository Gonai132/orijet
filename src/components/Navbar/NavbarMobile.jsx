import "./navbarMobile.css";
import { FaBars } from "react-icons/fa6";
import logo from "../../img/logoSmall.png";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar-mobile">
      <div className="status-bar" />

      <nav className="nav-bar">
        <Link to="/" className="brand">
          <img src={logo} alt="OriJet logo" className="brand-logo" />
          <span className="brand-text">OriJet</span>
        </Link>

        <button
          className="menu-btn"
          aria-label="Otwórz menu"
          aria-expanded={open}
          onClick={toggleMenu}
        >
          <FaBars className="menu-icon" />
        </button>
      </nav>

      <div className={`nav-layer ${open ? "is-open" : ""}`} onClick={closeMenu}>
        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
          <Link to="/login" onClick={closeMenu} className="item">Zaloguj się</Link>
          <Link to="/register" onClick={closeMenu} className="item">Zarejestruj się</Link>
          <Link to="/search" onClick={closeMenu} className="item">Wyszukaj loty</Link>
          <Link to="/offers" onClick={closeMenu} className="item">Oferty promocyjne</Link>
          <Link to="/map" onClick={closeMenu} className="item">Mapa połączeń</Link>
          <Link to="/my-flights" onClick={closeMenu} className="item">Moje loty</Link>
          <Link to="/contact" onClick={closeMenu} className="item">Kontakt</Link>
        </div>
      </div>
    </header>
  );
}