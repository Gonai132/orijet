import "./lowerMenu.css";
import { Link } from "react-router-dom";
import { FaHouse, FaUser, FaPlaneUp, FaMapLocationDot } from "react-icons/fa6";
import { useState, useEffect } from "react";


export default function LowerMenu() {
  const [user, setUser] = useState(null);

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
  
  return (
    <nav className="lower-menu" aria-label="Dolne menu">
      <Link to="/" className="lm-item" aria-label="Strona główna">
        <FaHouse />
      </Link>
       {user ? (
          <Link to="/account" className="lm-item" aria-label="Profil"><FaUser /></Link>)
           : (<Link to="/login" className="lm-item" aria-label="Profil"><FaUser /></Link>)}
      <Link to="/map" className="lm-item" aria-label="Mapa połączeń">
        <FaMapLocationDot size={35} />
      </Link>
      <Link to="/offers" className="lm-item" aria-label="Loty promocyjne">
        <FaPlaneUp />
      </Link>
    </nav>
  );
}