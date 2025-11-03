import React from "react";
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
            służącej do wyszukiwania i rezerwacji połączeń lotniczych.  
            Aplikacja ma charakter informacyjny i nie stanowi oferty w rozumieniu przepisów prawa cywilnego.
            Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.
          </p>

          <h2>2. Zakres usług</h2>
          <p>
            Aplikacja umożliwia użytkownikom:
          </p>
          <ul>
            <li>przeglądanie połączeń lotniczych dla fikcyjnej linii lotniczej OriJet,</li>
            <li>wyszukiwanie lotów według wybranych kryteriów (miasta, daty, ceny),</li>
            <li>zapoznanie się z podstawowymi informacjami o locie, takimi jak godziny odlotu i przylotu, czas trwania czy cena,</li>
            <li>symulację procesu rezerwacji biletów w celach edukacyjnych i demonstracyjnych.</li>
          </ul>

          <h2>3. Warunki korzystania</h2>
          <p>
            Użytkownik zobowiązany jest do korzystania z aplikacji w sposób zgodny z obowiązującymi przepisami prawa,
            zasadami współżycia społecznego oraz niniejszym regulaminem.  
            Zabronione jest podejmowanie działań mogących zakłócić działanie serwisu lub uzyskać nieautoryzowany dostęp do jego zasobów.
          </p>

          <h2>4. Odpowiedzialność</h2>
          <p>
            Administrator dokłada wszelkich starań, aby dane prezentowane w aplikacji były aktualne i poprawne.
            Nie ponosi jednak odpowiedzialności za:
          </p>
          <ul>
            <li>nieprawidłowości wynikające z działania zewnętrznych źródeł danych,</li>
            <li>czasowe przerwy w dostępności aplikacji spowodowane pracami serwisowymi,</li>
            <li>szkody wynikające z korzystania z aplikacji w sposób niezgodny z jej przeznaczeniem.</li>
          </ul>

          <h2>5. Ochrona danych osobowych</h2>
          <p>
            Dane osobowe przetwarzane są zgodnie z obowiązującymi przepisami prawa oraz polityką prywatności,
            dostępną w aplikacji. Dane użytkownika nie są zapisywane ani nigdzie przechowywane.
          </p>

          <h2>6. Prawa autorskie</h2>
          <p>
            Wszelkie materiały graficzne, tekstowe i elementy interfejsu użytkownika stanowią własność twórcy aplikacji
            i podlegają ochronie na mocy przepisów prawa autorskiego.  
            Zabrania się kopiowania, modyfikowania lub rozpowszechniania jakichkolwiek elementów aplikacji bez zgody autora.
          </p>

          <h2>7. Postanowienia końcowe</h2>
          <p>
            Administrator zastrzega sobie prawo do wprowadzania zmian w regulaminie.
            Zmiany obowiązują od momentu ich publikacji w aplikacji.  
            W kwestiach nieuregulowanych niniejszym dokumentem zastosowanie mają przepisy Kodeksu cywilnego.
          </p>

          <div className="rules-btn">
            <Button1 label="Powrót" onClick={() => navigate(-1)} >Powrót</Button1>
          </div>
        </div>
      </div>
    </main>
  );
}
