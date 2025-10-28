import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import Button2 from "../components/Buttons/Button2";
import { FaSuitcaseRolling } from "react-icons/fa6";
import "./../styles/bagSelection.css";
import BackButton from "../components/Buttons/BackButton";

const BAGS = {
  "10": { label: "10 KG", dims: "40 x 50 x 80 cm", price: 49.90, scale: 0.9 },
  "20": { label: "20 KG", dims: "50 x 70 x 90 cm", price: 79.90, scale: 1.2 },
  "32": { label: "32 KG", dims: "60 x 80 x 150 cm", price: 99.90, scale: 1.5 },
};

export default function BagSelection() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sel, setSel] = useState("10");

  const current = useMemo(() => BAGS[sel], [sel]);

  const goNext = (price) => {
    navigate("/passengers", {
      state: {
        ...state,
        baggage: {
          weight: sel === "none" ? 0 : Number(sel),
          dims: sel === "none" ? null : current.dims,
          pricePLN: price,
        },
      },
    });
  };

  return (
    <main className="page bag-page">
      <BackButton/>
      <Container className="bag-wrap">
        <h1 className="bag-title">WYBIERZ DODATKOWY<br />BAGAŻ REJESTROWANY:</h1>

        <div className="bag-icons-row" aria-hidden>
          {["10", "20", "32"].map((w) => (
            <button
              key={w}
              type="button"
              className={`bag-icon ${sel === w ? "is-active" : ""}`}
              onClick={() => setSel(w)}
              title={BAGS[w].label}
            >
              <FaSuitcaseRolling style={{ transform: `scale(${BAGS[w].scale})` }} />
            </button>
          ))}
        </div>

        <div className="bag-pills" role="radiogroup" aria-label="Wybór wagi bagażu">
          {Object.entries(BAGS).map(([key, v]) => (
            <label key={key} className={`bag-pill ${sel === key ? "on" : ""}`}>
              <input
                type="radio"
                name="bagWeight"
                value={key}
                checked={sel === key}
                onChange={() => setSel(key)}
              />
              {v.label}
            </label>
          ))}
        </div>

        <div className="bag-card">
          <div className="bag-card-line">
            <div className="bag-card-caption">Maksymalne wymiary bagażu:</div>
            <div className="bag-card-dims">{current.dims}</div>
          </div>
          <div className="bag-card-line bag-card-price">
            <div className="bag-card-caption">CENA:</div>
            <div className="bag-price">
              {current.price.toFixed(2)} <span>PLN</span>
            </div>
          </div>
        </div>
        
        <div className="bag-cta">
          <Button1 onClick={() => goNext(current.price)}>DODAJ BAGAŻ</Button1>
          <Button2 onClick={() => goNext(0)}>NIE CHCĘ BAGAŻU CARGO</Button2>
        </div>
      </Container>
    </main>
  );
}
