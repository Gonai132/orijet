import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import Button2 from "../components/Buttons/Button2";
import BackButton from "../components/Buttons/BackButton";
import { FaSuitcaseRolling } from "react-icons/fa6";
import "./../styles/bagSelection.css";

const BAGS = {
  "10": { label: "10 KG", dims: "40 x 50 x 80 cm", price: 49.90, scale: 0.9 },
  "20": { label: "20 KG", dims: "50 x 70 x 90 cm", price: 79.90, scale: 1.2 },
  "32": { label: "32 KG", dims: "60 x 80 x 150 cm", price: 99.90, scale: 1.5 },
};

export default function BagSelection() {
  const navigate = useNavigate();
  const { state: prev = {} } = useLocation();

  const [sel, setSel] = useState("10");
  const [qty, setQty] = useState(1);

  const current = useMemo(() => BAGS[sel], [sel]);

  const pushNext = (bagPayload) => {
    navigate("/passengers", {
      state: { ...prev, baggage: bagPayload },
    });
  };

  const addBaggage = () => {
    const unit = current.price;
    const total = +(unit * qty).toFixed(2);
    pushNext({
      weightKg: Number(sel),
      dims: current.dims,
      unitPricePLN: unit,
      qty,
      totalPricePLN: total,
      label: BAGS[sel].label,
    });
  };

  const noBaggage = () => {
    pushNext({
      weightKg: 0,
      dims: null,
      unitPricePLN: 0,
      qty: 0,
      totalPricePLN: 0,
      label: "brak",
    });
  };

  return (
    <main className="page bag-page">
      <BackButton />
      <Container className="bag-wrap">
        <h1 className="bag-title">
          WYBIERZ DODATKOWY<br />BAGAŻ REJESTROWANY:
        </h1>

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
            <div className="bag-card-caption">CENA (za 1 szt.):</div>
            <div className="bag-price">
              {current.price.toFixed(2)} <span>PLN</span>
            </div>
          </div>
             <hr className="bp-hr" />
            <div className="bag-qty">
            <div>Ilość sztuk wybranego bagażu:</div>
            <div className="counter">
              <button type="button" onClick={() => setQty(q => Math.max(0, q - 1))}>−</button>
              <span className="counter-val">{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min(9, q + 1))}>+</button>
            </div>
          </div>

          <div className="bag-card-line bag-card-total">
            <div className="bag-card-caption">CENA RAZEM:</div>
            <div className="bag-price">
              {(current.price * qty || 0).toFixed(2)} <span>PLN</span>
            </div>
          </div>
        </div>

        <div className="bag-cta">
          <Button1 onClick={addBaggage}>DODAJ WYBRANY BAGAŻ</Button1>
          <Button2 onClick={noBaggage}>NIE CHCĘ BAGAŻU CARGO</Button2>
        </div>
      </Container>
    </main>
  );
}