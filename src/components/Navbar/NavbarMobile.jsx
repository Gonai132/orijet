import "./navbarMobile.css";
import { FaBars, FaUser, FaMapLocationDot, FaRectangleList, FaPlane, FaCircleQuestion, FaMessage   } from "react-icons/fa6";
import logo from "../../img/logoSmall.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoLogOut } from "react-icons/io5";
import { ImSearch } from "react-icons/im";
import { TbCirclePercentageFilled } from "react-icons/tb";
import { IoSearchCircle } from "react-icons/io5";

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
          <Link to="/login" onClick={handleLogout} className="item"><IoLogOut size={22} /> Wyloguj się</Link>
          ) : (<Link to="/login" onClick={closeMenu} className="item"><FaUser size={20}/> Zaloguj się</Link>)}
          <Link to="/" onClick={closeMenu} className="item"><IoSearchCircle size={25} /> Wyszukaj loty</Link>
          <Link to="/offers" onClick={closeMenu} className="item"><TbCirclePercentageFilled size={24}/> Oferty promocyjne</Link>
          <Link to="/map" onClick={closeMenu} className="item"><FaMapLocationDot size={22}/> Mapa połączeń</Link>
          <Link to="/rules" onClick={closeMenu} className="item"><FaRectangleList size={20}/> Regulamin</Link>
          <Link to="/about" onClick={closeMenu} className="item"><FaPlane size={20}/> O nas</Link>
          <Link to="/faq" onClick={closeMenu} className="item"><FaCircleQuestion size={20}/> FAQ</Link>
          <Link to="/contact" onClick={closeMenu} className="item"><FaMessage size={18}/> Kontakt</Link>
        </div>
      </div>
    </header>
  );
}
