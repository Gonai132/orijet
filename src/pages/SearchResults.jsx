import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import "./../styles/searchResults.css";
import "./../styles/flightDetails.css";
import { FaPlane } from "react-icons/fa6";
import mapImg from "../img/mapa1.png";
import { listAvailableDates, findFlightsForDate } from "../data/Schedule";
import BackButton from "../components/Buttons/BackButton";

function formatDate(iso, full = false) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return full ? `${day}-${month}-${year}` : `${day}-${month}`;
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const originCode = sp.get("o") || "";
  const destinationCode = sp.get("d") || "";
  const departISO = sp.get("date") || "";
  const returnISO = sp.get("ret") || "";
  const passengers = parseInt(sp.get("pax") || "1", 10);
  const isRoundTrip = sp.get("rt") === "1";

  const [rules, setRules] = useState([]);
  const [selectedDepart, setSelectedDepart] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  // 🆕 osobne klucze dla animacji sekcji wylotu i powrotu
  const [fadeDepartKey, setFadeDepartKey] = useState(0);
  const [fadeReturnKey, setFadeReturnKey] = useState(0);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/flights.json`)
      .then((r) => r.json())
      .then(setRules)
      .catch(() => setRules([]));
  }, []);

  const outboundFlights = useMemo(
    () =>
      departISO
        ? findFlightsForDate(rules, originCode, destinationCode, departISO)
        : [],
    [rules, originCode, destinationCode, departISO]
  );

  const outboundNeighbors = useMemo(() => {
    if (!departISO) return { prev: null, next: null };
    const arr = listAvailableDates(
      rules,
      originCode,
      destinationCode,
      departISO,
      120
    );
    const i = arr.indexOf(departISO);
    return {
      prev: i > 0 ? arr[i - 1] : null,
      next: i >= 0 && i < arr.length - 1 ? arr[i + 1] : null,
    };
  }, [rules, originCode, destinationCode, departISO]);

  const returnFlights = useMemo(
    () =>
      isRoundTrip && returnISO
        ? findFlightsForDate(rules, destinationCode, originCode, returnISO)
        : [],
    [rules, originCode, destinationCode, isRoundTrip, returnISO]
  );

  const returnNeighbors = useMemo(() => {
    if (!isRoundTrip || !returnISO) return { prev: null, next: null };
    const arr = listAvailableDates(
      rules,
      destinationCode,
      originCode,
      returnISO,
      120
    );
    const i = arr.indexOf(returnISO);
    return {
      prev: i > 0 ? arr[i - 1] : null,
      next: i >= 0 && i < arr.length - 1 ? arr[i + 1] : null,
    };
  }, [rules, originCode, destinationCode, isRoundTrip, returnISO]);

  const gotoDepart = (newISO) => {
    setFadeDepartKey((k) => k + 1);
    const q = new URLSearchParams({
      o: originCode,
      d: destinationCode,
      date: newISO,
      pax: String(passengers),
      rt: isRoundTrip ? "1" : "0",
      ...(isRoundTrip && returnISO ? { ret: returnISO } : {}),
    });
    setSelectedDepart(null);
    navigate(`/search?${q.toString()}`);
  };

  const gotoReturn = (newISO) => {
    setFadeReturnKey((k) => k + 1);
    const q = new URLSearchParams({
      o: originCode,
      d: destinationCode,
      date: departISO,
      pax: String(passengers),
      rt: isRoundTrip ? "1" : "0",
      ...(isRoundTrip ? { ret: newISO } : {}),
    });
    setSelectedReturn(null);
    navigate(`/search?${q.toString()}`);
  };

  const canReserve = !isRoundTrip
    ? !!selectedDepart
    : !!selectedDepart && !!selectedReturn;

  const handleReserve = () => {
    if (!canReserve) return;
    navigate("/details", {
      state: {
        flight: selectedDepart,
        returnFlight: isRoundTrip ? selectedReturn : null,
        pax: passengers,
      },
    });
  };

  const origin =
    outboundFlights[0]?.origin || { code: originCode, name: "" };
  const destination =
    outboundFlights[0]?.destination || { code: destinationCode, name: "" };

  return (
    <main className="page page-results">
      <BackButton />
      <ul className="location">
        <li className="active">1.POŁĄCZENIE / </li>
        <li>2. MIEJSCE / </li>
        <li>3. BAGAŻ / </li>
        <li>4. DANE / </li>
        <li>5. PŁATNOŚĆ</li>
      </ul>

      <img src={mapImg} className="mapa-img" alt="Mapa w tle" />

      <div className="sr-hero">
        <header className="fd-bar">
          <div className="fd-route">
            <h1 className="title">DOSTĘPNE POŁĄCZENIA:</h1>
            <div className="sr-flightinfo">
              <div className="sr-flighdata">
                <span className="fd-code">{origin.code}</span>
                <span className="fc-destination fc-top">{origin.name}</span>
              </div>

              <div className="sr-flighticon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="129"
                  height="20"
                  viewBox="0 0 129 20"
                  fill="none"
                >
                  <line
                    x1="2"
                    y1="9.5"
                    x2="122"
                    y2="9.5"
                    stroke="white"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M73.94 7.475c1.255 0 2.274 1.02 2.274 2.275 0 1.255-1.02 2.275-2.274 2.275H68.77l-6.467 7.053a.98.98 0 0 1-.958.422h-1.775c-.443 0-.756-.435-.618-.858l2.206-6.617h-4.05l-2.145 2.681a.58.58 0 0 1-.508.256h-.804c-.422 0-.731-.398-.629-.808L54.12 9.75l-1.097-4.392c-.106-.41.206-.808.629-.808h.804c.2 0 .387.09.508.244l2.145 2.681h4.05l-2.206-6.618c-.138-.423.179-.858.622-.858h1.775c.365 0 .71.154.958.422l6.467 7.053h5.171Z"
                    fill="#FAF6DD"
                  />
                  <circle cx="3.5" cy="9.5" r="3.5" fill="white" />
                  <circle cx="125.5" cy="9.5" r="3.5" fill="white" />
                </svg>
                <span className="sr-pax"> • {passengers} os.</span>
              </div>

              <div className="sr-flighdata">
                <span className="fd-code">{destination.code}</span>
                <span className="fc-destination fc-top">
                  {destination.name}
                </span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <Container className="container-search">
        <div className="sr-sections-wrapper">
          <section className="sr-section">
            <div className="sr-datebar">
              <button
                className="pill"
                disabled={!outboundNeighbors.prev}
                onClick={() =>
                  outboundNeighbors.prev && gotoDepart(outboundNeighbors.prev)
                }
              >
                <span>← </span>
                {outboundNeighbors.prev
                  ? formatDate(outboundNeighbors.prev)
                  : ""}
              </button>
              <div className="pill pill--active">
                Wylot {formatDate(departISO, true)}
              </div>
              <button
                className="pill"
                disabled={!outboundNeighbors.next}
                onClick={() =>
                  outboundNeighbors.next && gotoDepart(outboundNeighbors.next)
                }
              >
                {outboundNeighbors.next
                  ? formatDate(outboundNeighbors.next)
                  : ""}{" "}
                <span>→</span>
              </button>
            </div>

            {outboundFlights.length === 0 ? (
              <p className="sr-empty fade">Brak lotów w wybranym dniu.</p>
            ) : (
              <div key={fadeDepartKey} className="sr-cards fade">
                {outboundFlights.map((f) => (
                  <FlightCard
                    key={f.id}
                    data={f}
                    selected={selectedDepart?.id === f.id}
                    onSelect={() => setSelectedDepart(f)}
                  />
                ))}
              </div>
            )}
          </section>

          {isRoundTrip && (
            <section className="sr-section">
              <div className="sr-datebar">
                <button
                  className="pill"
                  disabled={!returnNeighbors.prev}
                  onClick={() =>
                    returnNeighbors.prev && gotoReturn(returnNeighbors.prev)
                  }
                >
                  <span>← </span>
                  {returnNeighbors.prev
                    ? formatDate(returnNeighbors.prev)
                    : ""}
                </button>
                <div className="pill pill--active">
                  Powrót {formatDate(returnISO, true) || "-"}
                </div>
                <button
                  className="pill"
                  disabled={!returnNeighbors.next}
                  onClick={() =>
                    returnNeighbors.next && gotoReturn(returnNeighbors.next)
                  }
                >
                  {returnNeighbors.next
                    ? formatDate(returnNeighbors.next)
                    : ""}{" "}
                  <span>→</span>
                </button>
              </div>

              {returnFlights.length === 0 ? (
                <p className="sr-empty fade">Brak lotów w wybranym dniu.</p>
              ) : (
                <div key={fadeReturnKey} className="sr-cards fade">
                  {returnFlights.map((f) => (
                    <FlightCard
                      key={f.id}
                      data={f}
                      selected={selectedReturn?.id === f.id}
                      onSelect={() => setSelectedReturn(f)}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="sr-reserve">
          {!canReserve && (
            <div className="sr-hint">
              Wybierz {isRoundTrip ? "lot tam i z powrotem" : "lot"} aby
              kontynuować.
            </div>
          )}
          <Button1
            className="reserve-btn"
            onClick={handleReserve}
            disabled={!canReserve}
            aria-disabled={!canReserve}
          >
            ZAREZERWUJ
          </Button1>
        </div>
      </Container>
    </main>
  );
}

function FlightCard({ data, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`flight-card ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="fc-row fc-meta">
        <div className="fc-fnumber">
          Nr lotu: <strong>{data.flightNo}</strong>
        </div>
      </div>

      <div className="fc-row fc-times">
        <div className="fc-time">{data.departTime}</div>
        <div className="fc-icon">
          <FaPlane />
        </div>
        <div className="fc-time">{data.arriveTime}</div>
      </div>

      <div className="fc-row fc-meta">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="96"
          height="6"
          viewBox="0 0 96 6"
          fill="none"
        >
          <path
            d="M96 2.88678L91 2.83718e-05V5.77353L96 2.88678ZM0 2.88678V3.38678H91.5V2.88678V2.38678H0V2.88678Z"
            fill="#333333"
          />
        </svg>
        <span className="fc-destination">{data.origin.name}</span>
        <span>{data.durationText}</span>
        <span className="fc-destination">{data.destination.name}</span>
      </div>

      <div className="fc-row fc-route">
        <div className="fc-airport">{data.origin.code}</div>
        <div className="fc-airport">{data.destination.code}</div>
      </div>

      <div className="fc-row fc-bottom">
        <div className="fc-price">
          <div className="price-name">
            <div>TARYFA</div>
            <div>PODSTAWOWA:</div>
          </div>
          <div className="price-value">{data.pricePLN.toFixed(2)}</div>
          <span>PLN</span>
        </div>
        <div
          className={`fc-radio ${selected ? "fc-radio--on" : ""}`}
          aria-hidden
        />
      </div>
    </button>
  );
}
