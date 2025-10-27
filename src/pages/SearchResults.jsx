import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../components/Container/Container";
import Button1 from "../components/Button/Button1";
import "./../styles/searchResults.css";
import { FaPlane } from "react-icons/fa6";

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
    // tu docelowo przejście do ekranu rezerwacji z payloadem
    const payload = {
      o, d,
      dateISO,
      retISO: rt ? retISO : null,
      pax,
      selected: { outbound: selOut, inbound: selBack }
    };
    console.log("REZERWUJ:", payload);
    alert("Super! Przechodzimy do rezerwacji 🙂 (payload w konsoli)");
  };

  return (
    <main className="page page-results">
      <div className="sr-hero">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Wróć">←</button>
          <h1 className="sr-title">DOSTĘPNE POŁĄCZENIA:</h1>
          <div className="sr-route">

            <span className="sr-airport">{o}</span>
            <span className="sr-arrow"><FaPlane/></span>
            <span className="sr-airport">{d}</span>
                        <span className="sr-pax"> • {pax} os.</span>
          </div>
      </div>

      <Container className="container-search">
        {/* OUTBOUND */}
        <section className="sr-section">
          <div className="sr-datebar">
            <button className="pill" disabled={!outNeighbors.prev} onClick={() => outNeighbors.prev && gotoOut(outNeighbors.prev)}>← {outNeighbors.prev || ""}</button>
            <div className="pill pill--active">Wylot {dateISO}</div>
            <button className="pill" disabled={!outNeighbors.next} onClick={() => outNeighbors.next && gotoOut(outNeighbors.next)}>{outNeighbors.next || ""} →</button>
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
              <button className="pill" disabled={!backNeighbors.prev} onClick={() => backNeighbors.prev && gotoBack(backNeighbors.prev)}>← {backNeighbors.prev || ""}</button>
              <div className="pill pill--active">Powrót {retISO || "-"}</div>
              <button className="pill" disabled={!backNeighbors.next} onClick={() => backNeighbors.next && gotoBack(backNeighbors.next)}>{backNeighbors.next || ""} →</button>
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
      aria-pressed={selected}
    >

       <div className="fc-row fc-meta">
        <div className="fc-fnumber">Nr lotu: <strong>{data.flightNo}</strong></div>
       </div>
      <div className="fc-row fc-times">
        <div className="fc-time">{data.departTime}</div>
        <div className="fc-icon"><FaPlane/></div>
        <div className="fc-time">{data.arriveTime}</div>
      </div>
       <div className="fc-row fc-meta">
        {data.origin.name}<span> {data.durationText}</span> {data.destination.name}
      </div>

      <div className="fc-row fc-route">
        <div className="fc-airport">
          {data.origin.code}
        </div>
        <div className="fc-airport fc-airport--right">
          {data.destination.code}
        </div>
      </div>

     

      <div className="fc-row fc-bottom">
        <div className="fc-price">{data.pricePLN.toFixed(2)} PLN</div>
        <div className={`fc-radio ${selected ? "fc-radio--on" : ""}`} aria-hidden />
      </div>
    </button>
  );
}
