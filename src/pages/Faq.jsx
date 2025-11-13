import "../styles/faq.css";
import { Accordion } from "react-bootstrap";
import Button1 from "../components/Buttons/Button1";
import { useNavigate } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";

export default function Faq() {
  const navigate = useNavigate();

  return (
    <main className="app-bg">
      <h1 className="title">FAQ – Najczęściej zadawane pytania  <FaQuestionCircle /></h1>

      <div className="center-vertical faq-wrap">
        <div className="app-container elevated faq-container">
          <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Jak mogę wyszukać lot w aplikacji OriJet?
              </Accordion.Header>
              <Accordion.Body>
                Wystarczy przejść do strony głównej i wybrać lotnisko wylotu oraz przylotu, 
                a następnie określić datę podróży. Po kliknięciu przycisku 
                <strong> „Wyszukaj loty”</strong> zobaczysz wszystkie dostępne połączenia.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Czy aplikacja OriJet umożliwia faktyczną rezerwację biletów?
              </Accordion.Header>
              <Accordion.Body>
                Nie. OriJet to projekt edukacyjny o charakterze symulacyjnym. 
                Proces rezerwacji ma jedynie charakter demonstracyjny i nie prowadzi 
                do rzeczywistego zakupu biletów lotniczych.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                Skąd pochodzą dane o lotach w aplikacji?
              </Accordion.Header>
              <Accordion.Body>
                Dane lotów pochodzą z pliku flights.json umieszczonego lokalnie w projekcie. 
                Plik zawiera przykładowe połączenia, które można filtrować i sortować.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>
                Czy muszę mieć konto, aby korzystać z aplikacji?
              </Accordion.Header>
              <Accordion.Body>
                Nie, wyszukiwanie i przeglądanie połączeń dostępne jest bez logowania. 
                Konto umożliwia jedynie personalizację widoku i zapisanie fikcyjnych rezerwacji.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>
                Jakie technologie zostały użyte do stworzenia OriJet?
              </Accordion.Header>
              <Accordion.Body>
                Aplikacja została wykonana w technologii <strong>React</strong> z użyciem 
                 Bootstrap, CSS oraz React Router.
                Dane lotów przechowywane są w formacie JSON.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>
                Czy moje dane są zapisywane lub przetwarzane?
              </Accordion.Header>
              <Accordion.Body>
                Nie. Aplikacja nie zapisuje żadnych danych osobowych ani informacji o użytkownikach. 
                Wszystkie dane wprowadzane w formularzach mają charakter symulacyjny.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        <div className="faq-btn">
          <Button1 onClick={() => navigate("/contact")}>
            Skontaktuj się z nami
          </Button1>
        </div>
      </div>
    </main>
  );
}
