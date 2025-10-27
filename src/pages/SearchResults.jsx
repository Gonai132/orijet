import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../components/Container/Container";
import Button1 from "../components/Button/Button1";
import "./../styles/searchResults.css";
import { FaPlane } from "react-icons/fa6";
import { IoArrowBackCircle } from "react-icons/io5";


import { listAvailableDates, findFlightsForDate } from "../data/Schedule";

export default function SearchResults() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const o = sp.get("o") || "";
  const d = sp.get("d") || "";
  const dateISO = sp.get("date") || "";
  const pax = parseInt(sp.get("pax") || "1", 10);
  const rt = sp.get("rt") === "1";
  const retISO = sp.get("ret") || "";

  const [rules, setRules] = useState([]);
  const [selOut, setSelOut] = useState(null);
  const [selBack, setSelBack] = useState(null);

  useEffect(() => {
    fetch("/data/flights.json").then(r => r.json()).then(setRules).catch(() => setRules([]));
  }, []);

  // OUTBOUND
  const outFlights = useMemo(
    () => (dateISO ? findFlightsForDate(rules, o, d, dateISO) : []),
    [rules, o, d, dateISO]
  );
  const outNeighbors = useMemo(() => {
    if (!dateISO) return { prev:null, next:null };
    const arr = listAvailableDates(rules, o, d, dateISO, 120);
    const i = arr.indexOf(dateISO);
    return { prev: i>0?arr[i-1]:null, next: i>=0 && i<arr.length-1?arr[i+1]:null };
  }, [rules, o, d, dateISO]);

  // RETURN
  const backFlights = useMemo(
    () => (rt && retISO ? findFlightsForDate(rules, d, o, retISO) : []),
    [rules, o, d, rt, retISO]
  );
  const backNeighbors = useMemo(() => {
    if (!rt || !retISO) return { prev:null, next:null };
    const arr = listAvailableDates(rules, d, o, retISO, 120);
    const i = arr.indexOf(retISO);
    return { prev: i>0?arr[i-1]:null, next: i>=0 && i<arr.length-1?arr[i+1]:null };
  }, [rules, o, d, rt, retISO]);

  const gotoOut = (newISO) => {
    const q = new URLSearchParams({
      o, d, date: newISO, pax: String(pax), rt: rt ? "1" : "0", ...(rt && retISO ? { ret: retISO } : {})
    });
    setSelOut(null);
    navigate(`/search?${q.toString()}`);
  };
  const gotoBack = (newISO) => {
    const q = new URLSearchParams({
      o, d, date: dateISO, pax: String(pax), rt: rt ? "1" : "0", ...(rt ? { ret: newISO } : {})
    });
    setSelBack(null);
    navigate(`/search?${q.toString()}`);
  };

  const canReserve = !rt ? !!selOut : !!selOut && !!selBack;

const handleReserve = () => {
  if (!canReserve) return;

  navigate("/details", {
    state: {
      flight: selOut,                      
      returnFlight: rt ? selBack : null,   
      pax                                   
    },
  });
};

  return (
    <main className="page page-results">
      <div className="sr-hero">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Wróć"><IoArrowBackCircle /></button>
          <h1 className="sr-title">DOSTĘPNE POŁĄCZENIA:</h1>
          <div className="sr-route">

            <span className="sr-airport">{o}</span>
            <span className="sr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="129" height="20" viewBox="0 0 129 20" fill="none">
            <line x1="2" y1="9.5" x2="122" y2="9.5" stroke="white" stroke-dasharray="4 4"/>
            <path d="M73.9425 7.475C75.1979 7.475 76.2175 8.49469 76.2175 9.75C76.2175 11.0053 75.1979 12.025 73.9425 12.025H68.771L62.3035 19.0775C62.0557 19.3456 61.7104 19.5 61.3447 19.5H59.5694C59.1266 19.5 58.8138 19.0653 58.9519 18.6428L61.1579 12.025H57.1075L54.9625 14.7062C54.8407 14.8606 54.6538 14.95 54.4547 14.95H53.6504C53.2279 14.95 52.9191 14.5519 53.0207 14.1416L54.1175 9.75L53.0207 5.35844C52.915 4.94812 53.2279 4.55 53.6504 4.55H54.4547C54.6538 4.55 54.8407 4.63937 54.9625 4.79375L57.1075 7.475H61.1579L58.9519 0.857187C58.8138 0.434687 59.1266 0 59.5694 0H61.3447C61.7104 0 62.0557 0.154375 62.3035 0.4225L68.771 7.475H73.9425Z" fill="#FAF6DD"/>
            <circle cx="3.5" cy="9.5" r="3.5" fill="white"/>
            <circle cx="125.5" cy="9.5" r="3.5" fill="white"/>
            </svg>
            </span>
            <span className="sr-airport">{d}</span>
                        <span className="sr-pax"> • {pax} os.</span>
          </div>
      </div>

      <Container className="container-search">
        {/* OUTBOUND */}
        <section className="sr-section">
          <div className="sr-datebar">
            <button className="pill" disabled={!outNeighbors.prev} onClick={() => outNeighbors.prev && gotoOut(outNeighbors.prev)}><span>← </span> {outNeighbors.prev || ""}</button>
            <div className="pill pill--active">Wylot {dateISO}</div>
            <button className="pill" disabled={!outNeighbors.next} onClick={() => outNeighbors.next && gotoOut(outNeighbors.next)}>{outNeighbors.next || ""} <span>→</span></button>
          </div>

          {outFlights.length === 0 ? (
            <p className="sr-empty">Brak lotów w wybranym dniu.</p>
          ) : (
            <div className="sr-cards">
              {outFlights.map(f => (
                <FlightCard
                  key={f.id}
                  data={f}
                  selected={selOut?.id === f.id}
                  onSelect={() => setSelOut(f)}
                />
              ))}
            </div>
          )}
        </section>

        {/* RETURN */}
        {rt && (
          <section className="sr-section">
            <div className="sr-datebar">
              <button className="pill" disabled={!backNeighbors.prev} onClick={() => backNeighbors.prev && gotoBack(backNeighbors.prev)}><span>← </span> {backNeighbors.prev || ""}</button>
              <div className="pill pill--active">Powrót {retISO || "-"}</div>
              <button className="pill" disabled={!backNeighbors.next} onClick={() => backNeighbors.next && gotoBack(backNeighbors.next)}>{backNeighbors.next || ""} <span>→</span></button>
            </div>

            {backFlights.length === 0 ? (
              <p className="sr-empty">Brak lotów w wybranym dniu.</p>
            ) : (
              <div className="sr-cards">
                {backFlights.map(f => (
                  <FlightCard
                    key={f.id}
                    data={f}
                    selected={selBack?.id === f.id}
                    onSelect={() => setSelBack(f)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA */}
        <div className="sr-reserve">
          <Button1
            className="reserve-btn"
            onClick={handleReserve}
            disabled={!canReserve}
            aria-disabled={!canReserve}
          >
            ZAREZERWUJ
          </Button1>
          {!canReserve && (
            <div className="sr-hint">
              Wybierz {rt ? "lot tam i z powrotem" : "lot"} aby kontynuować.
            </div>
          )}
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
      aria-pressed={selected}>

       <div className="fc-row fc-meta">
        <div className="fc-fnumber">Nr lotu: <strong>{data.flightNo}</strong></div>
       </div>
      <div className="fc-row fc-times">
        <div className="fc-time">{data.departTime}</div>
        <div className="fc-icon"><FaPlane/></div>
        <div className="fc-time">{data.arriveTime}</div>
      </div>
       <div className="fc-row fc-meta">
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="6" viewBox="0 0 96 6" fill="none">
      <path d="M96 2.88678L91 2.83718e-05V5.77353L96 2.88678ZM0 2.88678V3.38678H91.5V2.88678V2.38678H0V2.88678Z" fill="#333333"/>
      </svg>
       <span className="fc-destination">{data.origin.name}</span><span> {data.durationText}</span> <span className="fc-destination">{data.destination.name}</span>
      </div>

      <div className="fc-row fc-route">
        <div className="fc-airport">
          {data.origin.code}
        </div>
        <div className="fc-airport">
          {data.destination.code}
        </div>
      </div>

     

      <div className="fc-row fc-bottom">
        <div className="fc-price"><span>TARYFA PODSTAWOWA:</span>{data.pricePLN.toFixed(2)}<span>PLN</span></div>
        <div className={`fc-radio ${selected ? "fc-radio--on" : ""}`} aria-hidden />
      </div>
    </button>
  );
}
