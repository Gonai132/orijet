import "./navbarMobile.css";
import { FaBars } from "react-icons/fa6";
import logo from "../../img/logoSmall.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (stored) setUser(JSON.parse(stored));

    const updateUser = () => {
      const updated = localStorage.getItem("loggedUser");
      setUser(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="navbar-mobile">
      <div className="status-bar" />

      <nav className="nav-bar">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src={logo} alt="OriJet logo" className="brand-logo" />
          <span className="brand-text">OriJet</span>
        </Link>

        <div className="user-nav-mobile">
          {user && (
            <Link to="/account" className="user-greet-mobile">Witaj, {user.username}!</Link>)}
          <button
            className="menu-btn"
            aria-label="Otwórz menu"
            aria-expanded={open}
            onClick={toggleMenu}
          >
            <FaBars className="menu-icon" />
          </button>
        </div>
      </nav>

      <div className={`nav-layer ${open ? "is-open" : ""}`} onClick={closeMenu}>
        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
          {user ? (
          <Link to="/login" onClick={handleLogout} className="item">Wyloguj się</Link>
          ) : (<Link to="/login" onClick={closeMenu} className="item">Zaloguj się</Link>)}
          <Link to="/" onClick={closeMenu} className="item">Wyszukaj loty</Link>
          <Link to="/offers" onClick={closeMenu} className="item">Oferty promocyjne</Link>
          <Link to="/map" onClick={closeMenu} className="item">Mapa połączeń</Link>
          <Link to="/rules" onClick={closeMenu} className="item">Regulamin</Link>
          <Link to="/about" onClick={closeMenu} className="item">O nas</Link>
          <Link to="/contact" onClick={closeMenu} className="item">Kontakt</Link>
        </div>
      </div>
    </header>
  );
}
