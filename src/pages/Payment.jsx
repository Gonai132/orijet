import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import "./../styles/payment.css";

function pln(n) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

const onlyDigits = (s) => (s || "").replace(/\D/g, "");
const group4 = (s) => (s || "").replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();

const validExpiry = (mmYY) => {
  const m = (mmYY || "").match(/^(\d{2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!m) return false;
  const mm = Number(m[1]);
  let yy = Number(m[2]);
  if (mm < 1 || mm > 12) return false;
  if (yy < 100) yy += 2000;
  const exp = new Date(yy, mm, 0, 23, 59, 59);
  return exp >= new Date();
};

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
   const { state: prev } = useLocation();

  const pax = Number(state?.pax ?? state?.passenger?.count ?? 1);
  const out = state?.flight ?? null;
  const back = state?.returnFlight ?? null;

  const seatFeeTotal = Number(state?.seatFeeTotal ?? state?.seatFee ?? 0);

  const bag = state?.baggage;
  const baggageTotal = bag
    ? (bag.totalPricePLN ?? (bag.unitPricePLN || 0) * (bag.qty || 0))
    : 0;

  const ticketOut = Number(out?.pricePLN ?? 0) * pax;
  const ticketBack = back ? Number(back?.pricePLN ?? 0) * pax : 0;

  const grand = ticketOut + ticketBack + seatFeeTotal + baggageTotal;

  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");
  const [exp, setExp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showOk, setShowOk] = useState(false);

  const [touched, setTouched] = useState({
    card: false,
    name: false,
    cvv: false,
    exp: false,
  });

  const bookingRef = useMemo(() => {
    const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "ORJ-";
    for (let i = 0; i < 8; i++) s += a[(Math.random() * a.length) | 0];
    return s;
  }, []);

  const errors = useMemo(() => {
    const e = {};
    const cardDigits = onlyDigits(card);
    if (!/^\d{16}$/.test(cardDigits)) {
      e.card = "Numer karty musi zawierać 16 cyfr.";
    }
    if (name.trim().length < 4) {
      e.name = "Wpisz imię i nazwisko (min. 4 znaki).";
    }
    if (!/^\d{3}$/.test(cvv)) {
      e.cvv = "CVV musi mieć 3 cyfry.";
    }

    if (!validExpiry(exp)) {
      e.exp = "Niepoprawna data (MM/RR) lub karta po terminie.";
    }
    if (!(grand > 0)) {
      e.total = "Suma musi być większa niż 0.";
    }
    return e;
  }, [card, name, cvv, exp, grand]);

  const isValid = Object.keys(errors).length === 0;

  const markTouched = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const handlePay = async (e) => {
    e.preventDefault();
    setTouched({ card: true, name: true, cvv: true, exp: true });
    if (!isValid) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setShowOk(true);
  };

  const goToConfirmation = () => {
    navigate("/confirmation", {
      state: {
         ...prev,
        bookingRef,
        pax,
        flight: out,
        returnFlight: back,
        totals: {
          ticketOut,
          ticketBack,
          seatFeeTotal,
          baggageTotal,
          grand,
        },
      },
    });
  };

  const dateA = state?.dateISO ?? out?.date ?? "";
  const dateB = state?.retISO ?? back?.date ?? "";

  return (
    <main className="page payment">
      <Container className="pay-wrap">
        
        <header className="pay-hero">
          <h1 className="pay-title">PŁATNOŚĆ</h1>
          <div className="pay-route">
            <div className="pay-route-codes">
              <span className="pay-code">{out?.origin?.code}</span>
              <span className="pay-arrow">✈</span>
              <span className="pay-code">{out?.destination?.code}</span>
              {pax ? <span className="pay-pax"> • {pax} os.</span> : null}
            </div>
          </div>
        </header>

        <section className="pay-summary">
          <div className="pay-summary-top">
            <div className="pay-flight-lines">
              <div className="pay-line">
                <span className="pay-line-l">Lot:</span>
                <span className="pay-line-r">
                  {out?.id || out?.flightNo || "—"} {dateA ? `, ${dateA}` : ""}
                </span>
              </div>
              {back && (
                <div className="pay-line">
                  <span className="pay-line-l">Powrót:</span>
                  <span className="pay-line-r">
                    {back?.id || back?.flightNo || "—"} {dateB ? `, ${dateB}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pay-items">
            <div className="pay-item">
              <span className="pay-item-l">
                Bilet {pax > 1 ? `× ${pax}` : ""}{back ? " (wylot)" : ""}
              </span>
              <span className="pay-item-r">{pln(ticketOut)} PLN</span>
            </div>

            {back ? (
              <div className="pay-item">
                <span className="pay-item-l">
                  Bilet {pax > 1 ? `× ${pax}` : ""} (powrót)
                </span>
                <span className="pay-item-r">{pln(ticketBack)} PLN</span>
              </div>
            ) : null}

            <div className="pay-item">
              <span className="pay-item-l">Wybór miejsca</span>
              <span className="pay-item-r">{pln(seatFeeTotal)} PLN</span>
            </div>

            <div className="pay-item">
              <span className="pay-item-l">Bagaż rejestrowany</span>
              <span className="pay-item-r">{pln(baggageTotal)} PLN</span>
            </div>

            <div className="pay-total">
              <span className="pay-total-l">SUMA ŁĄCZNIE:</span>
              <span className="pay-total-r">{pln(grand)} PLN</span>
            </div>
          </div>
        </section>

        <form className="pay-card" onSubmit={handlePay} noValidate>
          <h2 className="pay-sub">WPROWADŹ DANE KARTY:</h2>

          <label className="pay-field">
            <span className="pay-lab">NUMER KARTY</span>
            <input
              className="pay-inp"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={card}
              onChange={(e) => setCard(group4(e.target.value))}
              onBlur={markTouched("card")}
              maxLength={19}
              required
            />
            {touched.card && errors.card && <div className="pay-err">{errors.card}</div>}
          </label>

          <label className="pay-field">
            <span className="pay-lab">IMIĘ I NAZWISKO POSIADACZA KARTY</span>
            <input
              className="pay-inp"
              placeholder="JAN KOWALSKI"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              onBlur={markTouched("name")}
              required
            />
            {touched.name && errors.name && <div className="pay-err">{errors.name}</div>}
          </label>

          <div className="pay-row">
            <label className="pay-field half">
              <span className="pay-lab">KOD CVV</span>
              <input
                className="pay-inp"
                inputMode="numeric"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 3))}
                onBlur={markTouched("cvv")}
                maxLength={3}
                required
              />
              {touched.cvv && errors.cvv && <div className="pay-err">{errors.cvv}</div>}
            </label>

            <label className="pay-field half">
              <span className="pay-lab">DATA WAŻNOŚCI</span>
              <input
                className="pay-inp"
                placeholder="MM/YY"
                value={exp}
                onChange={(e) => {
                  let v = e.target.value.replace(/[^\d/]/g, "");
                  if (/^\d{2}$/.test(v)) v = v + "/";
                  setExp(v.slice(0, 5));
                }}
                onBlur={markTouched("exp")}
                required
              />
              {touched.exp && errors.exp && <div className="pay-err">{errors.exp}</div>}
            </label>
          </div>

          <Button1
            type="submit"
            className="pay-btn"
            disabled={!isValid || submitting}
            aria-disabled={!isValid || submitting}
          >
            {submitting ? "PRZETWARZANIE…" : `ZAPŁAĆ ${pln(grand)} PLN`}
          </Button1>
        </form>
      </Container>

      {showOk && (
        <div className="pay-modal">
          <div className="pay-modal-box">
            <h3>Płatność udana 🎉</h3>
            <p>
              Twój numer rezerwacji to: <strong>{bookingRef}</strong>
            </p>
            <button className="pay-modal-btn" onClick={goToConfirmation}>
              Przejdź do karty pokładowej
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
