import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/logoSmall.png";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa6";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    navigate("/login");
  };

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
          <Link to="/" className="menu-item">Wyszukaj loty</Link>
          <Link to="/contact" className="menu-item">Kontakt</Link>

          {user ? (
            <div className="user-section">
              <Link to="/account" className="user-greet"> Witaj, {user.username}!</Link>
              <button className="logout-btn-nav" onClick={handleLogout}>Wyloguj się</button>
            </div>
          ) : (
            <Link to="/login" className="menu-item accent">Zaloguj się</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
