import Button1 from "../components/Buttons/Button1";
import "../styles/rules.css";
import { useNavigate } from "react-router-dom";
import { MdPrivacyTip } from "react-icons/md";
import BackButton from "../components/Buttons/BackButton";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <main className="app-bg">
      <BackButton/>
      <h1 className="title">POLITYKA PRYWATNOŚCI <MdPrivacyTip /></h1>

      <div className="center-vertical rules-wrap">
        <div className="app-container elevated rules-container">
          <h2>1. Postanowienia ogólne</h2>
          <p>
            Niniejsza Polityka Prywatności określa zasady przetwarzania danych w aplikacji <strong>OriJet</strong>.
            Aplikacja ma charakter edukacyjny i nie zbiera, nie przechowuje ani nie udostępnia danych osobowych użytkowników.
          </p>

          <h2>2. Zakres zbieranych danych</h2>
          <p>
            Aplikacja nie wymaga logowania, tworzenia konta ani podawania danych osobowych.  
            Dane wprowadzane w procesie rezerwacji mają charakter demonstracyjny i nie są zapisywane.
          </p>

          <h2>3. Pliki cookies i logi</h2>
          <p>
            Aplikacja nie wykorzystuje plików cookies w celach śledzących ani reklamowych.  
            Nie są również gromadzone żadne logi użytkowników.
          </p>

          <h2>4. Cele przetwarzania danych</h2>
          <p>
            Dane wprowadzane w aplikacji (imię, nazwisko, numer dokumentu, data urodzenia)
            służą wyłącznie celom symulacyjnym.
          </p>

          <h2>5. Bezpieczeństwo informacji</h2>
          <p>
            Aplikacja działa w środowisku przeglądarkowym i nie przesyła żadnych danych do serwera.
            Użytkownik ma pełną kontrolę nad wszystkimi danymi wprowadzonymi w ramach aplikacji.
          </p>

          <h2>6. Zmiany w polityce prywatności</h2>
          <p>
            Autor aplikacji zastrzega sobie prawo do aktualizacji niniejszej polityki.
            Wszelkie zmiany zostaną opublikowane w aplikacji.
          </p>

          <h2>7. Kontakt</h2>
          <p>
            W sprawach dotyczących działania aplikacji można kontaktować się z autorką projektu.
          </p>
        </div>

        <div className="rules-btn">
           <Button1 label="doRegulaminu" onClick={() => navigate("/rules")}>Sprawdź regulamin</Button1>
        </div>
      </div>
    </main>
  );
}
