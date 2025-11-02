import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import Button2 from "../components/Buttons/Button2";
import { FaPlane, FaSuitcaseRolling,} from "react-icons/fa6";
import BackButton from "../components/Buttons/BackButton";
import { FaBagShopping } from "react-icons/fa6";
import "./../styles/flightDetails.css";
import "./../styles/searchResults.css";
import logo from "../img/logoSmall.png";

function formatDuration(min) {
  if (typeof min !== "number" || Number.isNaN(min)) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h} h ${String(m).padStart(2, "0")} min`;
}

export default function FlightDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sp] = useSearchParams();

  const primary = state?.flight || state?.selected?.outbound || null;
  const secondary = state?.returnFlight || state?.selected?.inbound || null;
  const pax = Number(state?.pax || 1);

  const fallback = useMemo(() => {
    if (primary) return null;
    const o = sp.get("o");
    const d = sp.get("d");
    const dep = sp.get("dep");
    const arr = sp.get("arr");
    const price = Number(sp.get("price") || 0);
    const id = sp.get("id") || "—";
    if (!o || !d) return null;
    return {
      id,
      flightNo: id,
      origin: { code: o, name: o },
      destination: { code: d, name: d },
      departTime: dep || "—:—",
      arriveTime: arr || "—:—",
      durationMin: undefined,
      durationText: "—",
      aircraft: "A320",
      terminal: "Terminal 1",
      availableSeats: 100,
      pricePLN: price,
    };
  }, [sp, primary]);

  const [segment, setSegment] = useState("out");
  const current = (segment === "out" || !secondary) ? (primary || fallback) : secondary;

  if (!current) {
    return (
      <main className="page">
        <Container>
          <h2>Brak danych lotu</h2>
          <p>Wróć do wyników i wybierz połączenie.</p>
          <Button2 onClick={() => navigate(-1)}>Wróć</Button2>
        </Container>
      </main>
    );
  }

  const origin       = current.origin;
  const destination  = current.destination;
  const departTime   = current.departTime || current.departure || "—:—";
  const arriveTime   = current.arriveTime || "—:—";
  const durationText = current.durationText || formatDuration(current.durationMin);
  const aircraft     = current.aircraft || "—";
  const terminal     = current.terminal || "Terminal 1";
  const seats = Number(current.availableSeats ?? current.seatsAvailable ?? current.rule?.availableSeats);
  const price        = Number(current.pricePLN || 0);
  const pricePremium = price + 100;
  const flightNo     = current.flightNo || current.id || "—";

  const handleChoose = (fare) => {
    navigate("/seats", {
      state: {
        pax,
        fare,
        pricePLN: fare === "premium" ? pricePremium : price,
        flight: state?.flight || state?.selected?.outbound || fallback,
        returnFlight: state?.returnFlight || state?.selected?.inbound || null,
      },
    });
  };

  return (
    <main className="page details">
       <BackButton />
       <ul className="location">
        <li className="active">1.POŁĄCZENIE / </li>
        <li>2. MIEJSCE / </li>
        <li>3. BAGAŻ / </li>
        <li>4. DANE / </li>
        <li>5. PŁATNOŚĆ</li>
       </ul>
      <header className="fd-bar">
        <div className="fd-route">
          <h1 className="title">SZCZEGÓŁY POŁĄCZENIA:</h1>
          <div className="sr-flightinfo">
            <div className="sr-flighdata">
          <span className="fd-code">{origin?.code}</span>
          <span className="fc-destination fc-top">{origin?.name}</span>
          </div>
          <div className="sr-flighticon">
          <svg xmlns="http://www.w3.org/2000/svg" width="129" height="20" viewBox="0 0 129 20" fill="none">
            <line x1="2" y1="9.5" x2="122" y2="9.5" stroke="white" strokeDasharray="4 4"/>
            <path d="M73.94 7.475c1.255 0 2.274 1.02 2.274 2.275 0 1.255-1.02 2.275-2.274 2.275H68.77l-6.467 7.053a.98.98 0 0 1-.958.422h-1.775c-.443 0-.756-.435-.618-.858l2.206-6.617h-4.05l-2.145 2.681a.58.58 0 0 1-.508.256h-.804c-.422 0-.731-.398-.629-.808L54.12 9.75l-1.097-4.392c-.106-.41.206-.808.629-.808h.804c.2 0 .387.09.508.244l2.145 2.681h4.05l-2.206-6.618c-.138-.423.179-.858.622-.858h1.775c.365 0 .71.154.958.422l6.467 7.053h5.171Z" fill="#FAF6DD"/>
            <circle cx="3.5" cy="9.5" r="3.5" fill="white"/>
            <circle cx="125.5" cy="9.5" r="3.5" fill="white"/>
          </svg>
           <span className="sr-pax"> • {pax} os.</span>
           </div>
           <div className="sr-flighdata">
          <span className="fd-code">{destination?.code}</span>
          <span className="fc-destination fc-top">{destination?.name}</span>
          </div>
          </div>
        </div>
      </header>

      <Container className="fd-wrap">

        {secondary && (
          <div className="fd-tabs">
            <button className={`fd-tab ${segment === "out" ? "is-active" : ""}`} onClick={() => setSegment("out")}>Wylot</button>
            <button className={`fd-tab ${segment === "in" ? "is-active" : ""}`} onClick={() => setSegment("in")}>Powrót</button>
          </div>
        )}

        <section className="fd-card">
          <div className="fc-row fc-meta">
            <div className="fc-fnumber">Nr lotu: <strong>{flightNo}</strong></div>
          </div>

          <div className="fc-row fc-times">
            <div className="fc-time">{departTime}</div>
            <div className="fc-icon"><FaPlane /></div>
            <div className="fc-time">{arriveTime}</div>
          </div>

          <div className="fc-row fc-meta">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="6" viewBox="0 0 96 6" fill="none">
              <path d="M96 2.88678L91 2.83718e-05V5.77353L96 2.88678ZM0 2.88678V3.38678H91.5V2.88678V2.38678H0V2.88678Z" fill="#333333"/>
            </svg>
            <span className="fc-destination">{origin?.name}</span>
            <span>{durationText}</span>
            <span className="fc-destination">{destination?.name}</span>
          </div>

          <div className="fc-row fc-route">
            <div className="fc-airport">{origin?.code}</div>
            <div className="fc-airport">{destination?.code}</div>
          </div>


          <div className="fd-details">
            <div className="logo-details"><img src={logo} alt="OriJet logo" className="brand-logo" /></div>
            <div className="fd-detail"><span>Samolot</span><strong>{aircraft}</strong></div>
            <div className="fd-detail">Dostępne miejsca: <strong>{seats}</strong></div>
            <div className="fd-detail"><span>Terminal</span><strong>{terminal}</strong></div>
          </div>


          <h3 className="fd-subtitle">DOSTĘPNE TARYFY:</h3>

          <div className="fd-fares">
            <div className="fd-fare">
              <div className="fd-fare-title">TARYFA PODSTAWOWA:</div>
              <ul className="fd-fare-list">
                <li> Mały bagaż podręczny</li>
                <li>(musi mieścić się pod siedzenie)</li>
                <li className="fd-icons"><FaBagShopping /></li>
              </ul>
              <div className="fd-fare-price">
                {price.toFixed(2)} <span>PLN</span>
              </div>
            </div>

            <div className="fd-fare">
              <div className="fd-fare-title">TARYFA PREMIUM:</div>
              <ul className="fd-fare-list">
                <li> Mały bagaż + walizka</li>
                <li>+ Pierwszeństwo wejścia na samolot</li>
                <li className="fd-icons"><FaBagShopping /><span> + </span><FaSuitcaseRolling className="suitcase"/></li>
              </ul>
              <div className="fd-fare-price">
                {pricePremium.toFixed(2)} <span>PLN</span>
              </div>
            </div>
          </div>
        </section>
      </Container>

      <div className="fd-cta">
        <Button1 onClick={() => handleChoose("premium")}>WYBIERZ PREMIUM</Button1>
        <Button2 onClick={() => handleChoose("base")}>TARYFA PODSTAWOWA</Button2>
      </div>
    </main>
  );
}
