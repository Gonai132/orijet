import Button1 from "../components/Buttons/Button1";
import "../styles/rules.css";
import { useNavigate } from "react-router-dom";

export default function Rules() {
  const navigate = useNavigate();

  return (
    <main className="app-bg">
      <h1 className="title">REGULAMIN</h1>

      <div className="center-vertical">
        <div className="app-container elevated rules-container">
          <h2>1. Postanowienia ogólne</h2>
          <p>
            Niniejszy regulamin określa zasady korzystania z aplikacji internetowej <strong>OriJet</strong>,
            służącej do wyszukiwania i rezerwacji fikcyjnych połączeń lotniczych.
            Aplikacja ma charakter symulacyjny i nie stanowi oferty w rozumieniu przepisów prawa cywilnego.
            Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.
          </p>

          <h2>2. Zakres usług</h2>
          <ul>
            <li>przeglądanie połączeń lotniczych fikcyjnej linii OriJet,</li>
            <li>wyszukiwanie lotów według wybranych kryteriów,</li>
            <li>zapoznanie się z podstawowymi informacjami o locie (godziny, cena, czas trwania),</li>
            <li>symulację procesu rezerwacji biletów.</li>
          </ul>

          <h2>3. Warunki korzystania</h2>
          <p>
            Użytkownik zobowiązany jest do korzystania z aplikacji zgodnie z obowiązującym prawem i niniejszym regulaminem.
            Zabrania się podejmowania działań mogących zakłócić działanie serwisu.
          </p>

          <h2>4. Odpowiedzialność</h2>
          <ul>
            <li>Administrator nie ponosi odpowiedzialności za błędy wynikające z zewnętrznych źródeł danych,</li>
            <li>przerwy techniczne w działaniu aplikacji,</li>
            <li>szkody wynikające z użytkowania niezgodnego z przeznaczeniem.</li>
          </ul>

          <h2>5. Ochrona danych osobowych</h2>
          <p>
            Dane użytkowników nie są nigdzie zapisywane ani przetwarzane.  
            Aplikacja nie gromadzi żadnych informacji osobistych.
          </p>

          <h2>6. Prawa autorskie</h2>
          <p>
            Wszelkie elementy graficzne, tekstowe i projekt interfejsu stanowią własność autora projektu lub pochodzą z darmowych źródeł stockowych.
            Zabrania się ich kopiowania bez zgody twórcy.
          </p>

          <h2>7. Postanowienia końcowe</h2>
          <p>
            Administrator zastrzega sobie prawo do wprowadzania zmian w regulaminie.  
            W sprawach nieuregulowanych zastosowanie mają przepisy Kodeksu cywilnego.
          </p>
        </div>

        <div className="rules-btn">
          <Button1 label="doPolityki" onClick={() => navigate("/privacy")}>Polityka prywatności</Button1>
        </div>
      </div>
    </main>
  );
}
