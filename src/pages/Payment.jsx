import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import "./../styles/payment.css";

function pln(n) {
  return new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0
  );
}

const onlyDigits = (s) => s.replace(/\D/g, "");
const group4 = (s) => s.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();
const isLuhn = (num) => {
  const s = onlyDigits(num);
  let sum = 0,
    dbl = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = Number(s[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return s.length >= 12 && sum % 10 === 0;
};
const validExpiry = (mmYY) => {
  const m = mmYY.match(/^(\d{2})\s*\/\s*(\d{2}|\d{4})$/);
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

  // - pax: liczba pasażerów
  // - flight (lot tam) z pricePLN
  // - returnFlight (opcjonalnie) z pricePLN
  // - seatFeeTotal: suma dopłat za wybór miejsc (z SeatSelection)
  // - baggageFeeTotal: dopłata za bagaż rejestrowany (z BaggageSelection)
  const pax = Number(state?.pax ?? state?.passenger?.count ?? 1);

  const out = state?.flight ?? null;
  const back = state?.returnFlight ?? null;

  const seatFeeTotal = Number(state?.seatFeeTotal ?? state?.seatFee ?? 0);
  const baggageFeeTotal = Number(state?.baggageFeeTotal ?? state?.baggageFee ?? state?.bagFee ?? 0);

  const ticketOut = Number(out?.pricePLN ?? 0) * pax;
  const ticketBack = back ? Number(back?.pricePLN ?? 0) * pax : 0;

  const grand = ticketOut + ticketBack + seatFeeTotal + baggageFeeTotal;

  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");
  const [exp, setExp] = useState(""); // MM/YY
  const [submitting, setSubmitting] = useState(false);
  const [showOk, setShowOk] = useState(false);
  const bookingRef = useMemo(() => {
    const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "ORJ-";
    for (let i = 0; i < 8; i++) s += a[(Math.random() * a.length) | 0];
    return s;
  }, []);

  const isValid =
    isLuhn(card) &&
    name.trim().length >= 4 &&
    /^\d{3,4}$/.test(cvv) &&
    validExpiry(exp) &&
    grand > 0;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setShowOk(true);
  };

  const goToConfirmation = () => {
    navigate("/confirmation", {
      state: {
        bookingRef,
        pax,
        flight: out,
        returnFlight: back,
        totals: {
          ticketOut,
          ticketBack,
          seatFeeTotal,
          baggageFeeTotal,
          grand,
        },
      },
    });
  };

  const routeA = `${out?.origin?.code ?? ""} → ${out?.destination?.code ?? ""}`;
  const routeB = back ? `${back?.origin?.code ?? ""} → ${back?.destination?.code ?? ""}` : null;
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

        {/* PODSUMOWANIE LOTÓW */}
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
            {/* Bilet(y) */}
            <div className="pay-item">
              <span className="pay-item-l">
                Bilet {pax > 1 ? `× ${pax}` : ""}
                {back ? " (wylot)" : ""}
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

            {/* Wybrane miejsca (łączna dopłata) */}
            <div className="pay-item">
              <span className="pay-item-l">Wybór miejsca</span>
              <span className="pay-item-r">{pln(seatFeeTotal)} PLN</span>
            </div>

            {/* Bagaż rejestrowany (łączna dopłata) */}
            <div className="pay-item">
              <span className="pay-item-l">Bagaż rejestrowany</span>
              <span className="pay-item-r">{pln(baggageFeeTotal)} PLN</span>
            </div>

            <div className="pay-total">
              <span className="pay-total-l">SUMA ŁĄCZNIE:</span>
              <span className="pay-total-r">{pln(grand)} PLN</span>
            </div>
          </div>
        </section>

        {/* FORMULARZ KARTY */}
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
              maxLength={19}
              required
            />
          </label>

          <label className="pay-field">
            <span className="pay-lab">IMIĘ I NAZWISKO POSIADACZA KARTY</span>
            <input
              className="pay-inp"
              placeholder="JAN KOWALSKI"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              required
            />
          </label>

          <div className="pay-row">
            <label className="pay-field half">
              <span className="pay-lab">KOD CVV</span>
              <input
                className="pay-inp"
                inputMode="numeric"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
                maxLength={4}
                required
              />
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
                required
              />
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

      {/* MODAL „Płatność udana” */}
      {showOk && (
        <div className="pay-modal">
          <div className="pay-modal-box">
            <h3>Płatność udana 🎉</h3>
            <p>
              Numer potwierdzenia rezerwacji: <strong>{bookingRef}</strong>
            </p>
            <button className="pay-modal-btn" onClick={goToConfirmation}>
              Przejdź do potwierdzenia
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
