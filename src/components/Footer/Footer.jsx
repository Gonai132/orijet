import { Link } from "react-router-dom";
import "./footer.css";
import logo from "../../img/logoSmall.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="OriJet logo" className="footer-brand-logo" />
        </div>

        <div className="footer-links">
          <Link to="/about" className="footer-link">O nas</Link>
          <Link to="/rules" className="footer-link">Regulamin</Link>
          <Link to="/faq" className="footer-link">FAQ</Link>
          <Link to="/privacy" className="footer-link">Polityka prywatności</Link>
          <Link to="/contact" className="footer-link">Kontakt</Link>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OriJet. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
