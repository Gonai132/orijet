import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Button1 from "../components/Buttons/Button1";
import BackButton from "../components/Buttons/BackButton";
import "./../styles/seatSelection.css";
import planeBg from "../img/Samolot.png";
import planeBg2 from "../img/Samolot3.png";

function seatType(letter) {
  if (letter === "A" || letter === "F") return "window";
  if (letter === "C" || letter === "D") return "aisle";
  return "middle";
}
function surchargeByType(seat) {
  if (seat.row === 1) return 49.9;

  if (seat.type === "window") return 29.9;
  if (seat.type === "aisle") return 19.9;
  return 0.0;
}

function buildSeatMap(rows = 30, occRatio = 0.18) {
  const letters = ["A","B","C","D","E","F"];
  const out = [];
  for (let r = 1; r <= rows; r++) {
    for (const L of letters) {
      out.push({
        label: `${r}${L}`,
        row: r,
        col: L,
        type: seatType(L),
        taken: Math.random() < occRatio,
      });
    }
  }
  return out;
}

function autoAssign(seats, count) {
  const pick = [];

  for (const pref of ["middle", "aisle", "window"]) {
    for (const s of seats) {
      if (s.row === 1) continue;

      if (pick.length >= count) break;
      if (!s.taken && s.type === pref && !pick.includes(s)) {
        pick.push(s);
      }
    }
    if (pick.length >= count) break;
  }

  if (pick.length < count) {
    for (const s of seats) {
      if (s.row === 1) continue;
      if (!s.taken && !pick.includes(s)) pick.push(s);
      if (pick.length >= count) break;
    }
  }

  return pick;
}


export default function SeatSelection() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const pax         = Number(state?.pax || 1);
  const basePrice   = Number(state?.pricePLN || 0);
  const fare        = state?.fare || "base";
  const flight      = state?.flight || null;
  const returnFlight= state?.returnFlight || null;

  const seats = useMemo(() => buildSeatMap(30, 0.18), []);
  const [selected, setSelected] = useState([]);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => { setAssigned(autoAssign(seats, pax)); }, [seats, pax]);

  const isSelected = (l) => selected.some(s => s.label === l);
  const isAssigned = (l) => assigned.some(s => s.label === l);

  const onSeatClick = (seat) => {
    if (seat.taken) return;
    if (isSelected(seat.label)) {
      setSelected(selected.filter(s => s.label !== seat.label));
    } else {
      if (selected.length >= pax) return;
      setSelected([...selected, seat]);
    }
  };

  const effective = selected.length ? selected : assigned;
  const totalSurcharge = effective.reduce((sum, s) => sum + surchargeByType(s), 0);
  const ready = effective.length === pax;

  const next = () => {
    if (!ready) return;
    navigate("/baggage", {
      state: {
        pax,
        fare,
        pricePLN: basePrice,
        seatFeeTotal: Number(totalSurcharge.toFixed(2)), 
        selectedSeats: effective.map(s => s.label),
        flight,
        returnFlight,
      }
    });
  };

  return (
    <main className="page seat-page transparent">
      <BackButton />
      <ul className="location">
        <li>1.POŁĄCZENIE / </li>
        <li className="active">2. MIEJSCE / </li>
        <li>3. BAGAŻ / </li>
        <li>4. DANE / </li>
        <li>5. PŁATNOŚĆ</li>
       </ul>

      <div className="seat-wrap-no-panel">
        <h1 className="title">WYBIERZ MIEJSC{pax > 1 ? "A" : "E"}:</h1>
        <header className="seat-legend">
          <div><span className="dot dot--taken" /> Zajęte</div>
          <div><span className="dot dot--free" /> Dostępne</div>
          <div><span className="dot dot--selected" /> Wybrane</div>
        </header>
        
        <div className="seat-picked2">
            <div className="picked-title">
                {selected.length > 0 ? "Wybrane miejsc" : "Losowe miejsc"}
                {pax > 1 ? "a" : "e"}:{" "}
                <span className="picked-value">
                  {effective.map((s) => s.label).join(", ") || "—"}
                </span>
              </div>
            <div className="picked-price">
              Dopłata za wybór: <strong>{totalSurcharge.toFixed(2)} PLN</strong>
            </div>
          </div>

<div className="plane-wrapper">
        <div className="plane">
          <img className="plane-bg" src={planeBg} alt="" />
          <div className="seat-grid-rows" aria-label="Mapa miejsc">
          <div className="seat-picked">
            <div className="picked-title">
                {selected.length > 0 ? "Wybrane miejsc" : "Losowe miejsc"}
                {pax > 1 ? "a" : "e"}:{" "}
                <span className="picked-value">
                  {effective.map((s) => s.label).join(", ") || "—"}
                </span>
              </div>
            <div className="picked-price">
              Dopłata za wybór: <strong>{totalSurcharge.toFixed(2)} PLN</strong>
            </div>
          </div>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((row) => {
              const a = seats.find(s => s.label === `${row}A`);
              const b = seats.find(s => s.label === `${row}B`);
              const c = seats.find(s => s.label === `${row}C`);
              const d = seats.find(s => s.label === `${row}D`);
              const e = seats.find(s => s.label === `${row}E`);
              const f = seats.find(s => s.label === `${row}F`);
              return (
                <div key={row} className="row7">
                  <SeatButton seat={a} selected={isSelected(a.label)} assigned={isAssigned(a.label)} onClick={() => onSeatClick(a)} />
                  <SeatButton seat={b} selected={isSelected(b.label)} assigned={isAssigned(b.label)} onClick={() => onSeatClick(b)} />
                  <SeatButton seat={c} selected={isSelected(c.label)} assigned={isAssigned(c.label)} onClick={() => onSeatClick(c)} />
                  <div className="aisle" aria-hidden />
                  <SeatButton seat={d} selected={isSelected(d.label)} assigned={isAssigned(d.label)} onClick={() => onSeatClick(d)} />
                  <SeatButton seat={e} selected={isSelected(e.label)} assigned={isAssigned(e.label)} onClick={() => onSeatClick(e)} />
                  <SeatButton seat={f} selected={isSelected(f.label)} assigned={isAssigned(f.label)} onClick={() => onSeatClick(f)} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="plane2">
          <img className="plane-bg" src={planeBg2} alt="" />
          <div className="seat-grid-horizontal" aria-label="Mapa miejsc">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((row) => {
              const a = seats.find(s => s.label === `${row}A`);
              const b = seats.find(s => s.label === `${row}B`);
              const c = seats.find(s => s.label === `${row}C`);
              const d = seats.find(s => s.label === `${row}D`);
              const e = seats.find(s => s.label === `${row}E`);
              const f = seats.find(s => s.label === `${row}F`);
              return (
                <div key={row} className="row7-horizontal">
                  <SeatButton seat={a} selected={isSelected(a.label)} assigned={isAssigned(a.label)} onClick={() => onSeatClick(a)} />
                  <SeatButton seat={b} selected={isSelected(b.label)} assigned={isAssigned(b.label)} onClick={() => onSeatClick(b)} />
                  <SeatButton seat={c} selected={isSelected(c.label)} assigned={isAssigned(c.label)} onClick={() => onSeatClick(c)} />
                  <div className="aisle" aria-hidden />
                  <SeatButton seat={d} selected={isSelected(d.label)} assigned={isAssigned(d.label)} onClick={() => onSeatClick(d)} />
                  <SeatButton seat={e} selected={isSelected(e.label)} assigned={isAssigned(e.label)} onClick={() => onSeatClick(e)} />
                  <SeatButton seat={f} selected={isSelected(f.label)} assigned={isAssigned(f.label)} onClick={() => onSeatClick(f)} />
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      <div className="seat-cta">
          {!ready && <div className="seat-hint">Wybierz {pax} miejsce(a).</div>}
          <Button1 onClick={next} disabled={!ready}>
            {selected.length > 0
              ? `WYBIERZ MIEJSC${pax > 1 ? "A" : "E"}`
              : `WYBIERZ LOSOWE`}
          </Button1>
        </div>
    </main>
  );
}

function SeatButton({ seat, selected, assigned, onClick }) {
  const cls = [
    "seat",
    `seat--${seat.type}`,
    seat.taken ? "is-taken" : "",
    selected ? "is-selected" : "",
    assigned && !selected ? "is-assigned" : ""
  ].join(" ");
const title = seat.taken
  ? `${seat.label} • zajęte`
  : `${seat.label} • ${
      seat.row === 1
        ? "pierwszy rząd +49,90"
        : seat.type === "window"
        ? "okno +29,90"
        : seat.type === "aisle"
        ? "korytarz +19,90"
        : "środek +0,0"
    }`;
  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      disabled={seat.taken}
      aria-pressed={selected}
      aria-label={`${seat.label} ${seat.taken ? "zajęte" : "dostępne"}`}
      title={title}
    >
      {seat.label}
    </button>
  );
}
