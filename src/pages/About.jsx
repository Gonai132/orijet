import "../styles/about.css";
import Button1 from "../components/Buttons/Button1";
import aboutImg from "../img/plane.png";
import { useNavigate } from "react-router-dom";
import { FaPlane } from "react-icons/fa6";
import mapImg from "../img/mapa1.png";
import BackButton from "../components/Buttons/BackButton";

export default function About() {
  const navigate = useNavigate();

  return (
    <main className="app-bg about-page">
      <BackButton/>
      <h1 className="title">O NAS <FaPlane /></h1>

        <div className="map-wrapper"><img src={mapImg} className="mapa-img" alt="Mapa w tle" /></div>

      <div className="about-layout">
        <div className="about-image">
          <img src={aboutImg} alt="Zespół OriJet" />
        </div>

        <div className="about-container">
          <h2>Kim jesteśmy?</h2>
          <p>
            <strong>OriJet</strong> to fikcyjna linia lotnicza stworzona na potrzeby projektu inżynierskiego,
            prezentującego proces projektowania oraz implementacji interfejsu aplikacji internetowej do rezerwacji biletów lotniczych.
          </p>

          <h2>Technologie wykorzystane w projekcie:</h2>
          <ul>
            <li>Figma – projektowanie UX/UI,</li>
            <li>React – framework do budowy interfejsu użytkownika SPA,</li>
            <li>Bootstrap – do responsywnego układu i komponentów,</li>
            <li>CSS3 i Flexbox – dla elastycznych kompozycji elementów.</li>
          </ul>
        </div>
      </div>

      <div className="about-btn">
        <Button1 label="rezerwuj" onClick={() => navigate("/")}>Rezerwuj loty</Button1>
      </div>
    </main>
  );
}
