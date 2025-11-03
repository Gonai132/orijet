import "../styles/about.css";
import Button1 from "../components/Buttons/Button1";
import aboutImg from "../img/plane.png";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <main className="app-bg about-page">
      <h1 className="title">O NAS</h1>

      <div className="about-layout">
        <div className="about-image">
          <img src={aboutImg} alt="Zespół OriJet" />
        </div>

        <div className="about-container">
          <h2>Kim jesteśmy?</h2>
          <p>
            <strong>OriJet</strong> to fikcyjna linia lotnicza stworzona na potrzeby projektu inżynierskiego,
            prezentującego proces projektowania oraz implementacji interfejsu dla aplikacji internetowej do rezerwacji biletów lotniczych.
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
