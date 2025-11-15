import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import BackButton from "../components/Buttons/BackButton";
import "./../styles/payment.css";
import mapImg from "../img/mapa1.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import { FaCalendar } from "react-icons/fa6";
import { LuTicketsPlane } from "react-icons/lu";
registerLocale("pl", pl);

function pln(n) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

const onlyDigits = (s) => (s || "").replace(/\D/g, "");
const group4 = (s) =>
  (s || "").replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();

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

  const pax = Number(state?.pax ?? 1);
  const out = state?.flight ?? null;
  const back = state?.returnFlight ?? null;
  const email =state?.passenger.email ?? null;

  const seatFeeTotal = Number(state?.seatFeeTotal ?? 0);

  const bag = state?.baggage;
  const baggageTotal = bag
    ? bag.totalPricePLN ?? (bag.unitPricePLN || 0) * (bag.qty || 0)
    : 0;

  const basePrice = Number(state?.pricePLN ?? out?.pricePLN ?? 0);
  const ticketOut = basePrice * pax;
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
    let s = "OJ-";
    for (let i = 0; i < 5; i++) s += a[(Math.random() * a.length) | 0];
    return s;
  }, []);

  const errors = useMemo(() => {
    const e = {};
    const cardDigits = onlyDigits(card);
    if (!/^\d{16}$/.test(cardDigits))
      e.card = "Numer karty musi zawierać 16 cyfr.";
    if (name.trim().length < 4)
      e.name = "Wpisz imię i nazwisko (min. 4 znaki).";
    if (!/^\d{3}$/.test(cvv)) e.cvv = "CVV musi mieć 3 cyfry.";
    if (!validExpiry(exp))
      e.exp = "Niepoprawna data (MM/RR) lub karta po terminie.";
    if (!(grand > 0)) e.total = "Suma musi być większa niż 0.";
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

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (loggedUser) {
    const newRes = {
      id: Date.now(),
      bookingRef,
      dateISO: state?.dateISO ?? out?.date ?? "—",
      selectedSeats: state?.selectedSeats ?? [],
      flight: {
        origin: out?.origin ?? { code: "—", name: "" },
        destination: out?.destination ?? { code: "—", name: "" },
        flightNo: out?.flightNo ?? "—",
        departTime: out?.departTime ?? "—",
        arriveTime: out?.arriveTime ?? "—",
        durationText: out?.durationText ?? "—",
      },
    };

    const updatedUser = {
      ...loggedUser,
      reservations: [...(loggedUser.reservations || []), newRes],
    };

    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }
};

const goToConfirmation = () => {
  navigate("/confirmation", {
    state: {
      ...prev,
      bookingRef,
      pax,
      flight: out,
      returnFlight: back,
      totals: { ticketOut, ticketBack, seatFeeTotal, baggageTotal, grand },
    },
  });
};

  const dateA = state?.dateISO ?? out?.date ?? "";
  const dateB = state?.dateISO ?? back?.date ?? "";
  const origin = out?.origin;
  const destination = out?.destination;

  return (
    <main className="page payment">
    <BackButton/>
      <ul className="location">
        <li>1. POŁĄCZENIE / </li>
        <li>2. MIEJSCE / </li>
        <li>3. BAGAŻ / </li>
         <li>4. DANE / </li>
        <li className="active">5. PŁATNOŚĆ</li>
       </ul>
      <section className="sr-hero">
      
        <div className="sr-hero-content">
          <h1 className="title">PŁATNOŚĆ</h1>

          <div className="sr-flightinfo">
            <div className="sr-flighdata">
              <span className="fd-code">{origin?.code}</span>
              <span className="fc-destination fc-top">{origin?.name}</span>
            </div>
            <img src={mapImg} className="mapa-img" alt="Mapa w tle" />

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
              <span className="sr-pax"> • {pax} os.</span>
            </div>

            <div className="sr-flighdata">
              <span className="fd-code">{destination?.code}</span>
              <span className="fc-destination fc-top">
                {destination?.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      <Container className="pay-wrap">
        <section className="pay-summary">
          <div className="pay-items">

             {back ? (
              <div className="pay-line">
                  Lot numer: {(out?.flightNo + " (" + dateA + ") oraz powrót: "  + back?.flightNo + " (" + dateB + ")") || "—"}
                </div>
            ) : <div className="pay-line">
                  Lot numer {out?.flightNo || "—"}{" ("}
                  {dateA ? dateA : "—"}{") "}
                </div>}

            <div className="pay-item">
              <span className="pay-item-l">
                Bilet:  {pax > 1 ? `${ticketOut/pax}pln × ${pax}` : ""}
              </span>
              <span className="pay-item-r">{pln(ticketOut)} PLN</span>
            </div>
            {back ? (
              <div className="pay-item">
                <span className="pay-item-l">
                  Bilet powrotny: {pax > 1 ? `${ticketBack/pax}pln × ${pax}` : ""}
                </span>
                <span className="pay-item-r">{pln(ticketBack)} PLN</span>
              </div>
            ) : null}

            {back ? (
              <div className="pay-item">
               <span className="pay-item-l">Wybór miejsc{pax > 1 ? "" : "a"} w obie strony: {seatFeeTotal}pln x 2</span>
              <span className="pay-item-r">{pln(seatFeeTotal*2)} PLN</span>
              </div>
            ) :  <div className="pay-item">
                    <span className="pay-item-l">Wybór miejsc{pax > 1 ? ":" : "a:"}</span>
                    <span className="pay-item-r">{pln(seatFeeTotal)} PLN</span>
                 </div>}

            {back ? (
              <div className="pay-item">
               <span className="pay-item-l">Bagaż rejestrowany w obie strony: {baggageTotal}pln x 2</span>
              <span className="pay-item-r">{pln(baggageTotal*2)} PLN</span>
              </div>
            ) : <div className="pay-item">
                  <span className="pay-item-l">Bagaż rejestrowany:</span>
                  <span className="pay-item-r">{pln(baggageTotal)} PLN</span>
                </div>}

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
              placeholder="np. 0000 0000 0000 0000"
              value={card}
              onChange={(e) => setCard(group4(e.target.value))}
              onBlur={markTouched("card")}
              maxLength={19}
              required
            />
            {touched.card && errors.card && (
              <div className="pay-err">{errors.card}</div>
            )}
          </label>

          <label className="pay-field">
            <span className="pay-lab">IMIĘ I NAZWISKO POSIADACZA KARTY</span>
            <input
              className="pay-inp"
              placeholder="np. JAN KOWALSKI"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              onBlur={markTouched("name")}
              required
            />
            {touched.name && errors.name && (
              <div className="pay-err">{errors.name}</div>
            )}
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
              {touched.cvv && errors.cvv && (
                <div className="pay-err">{errors.cvv}</div>
              )}
            </label>

            <label className="pay-field half">
              <span className="pay-lab">DATA WAŻNOŚCI</span>
              <div className="exp-wrapper">
                <input
                  className="pay-inp"
                  placeholder="MM/YY"
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  onBlur={markTouched("exp")}
                />
                <DatePicker
                  selected={null}
                  onChange={(date) => {
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = String(date.getFullYear()).slice(-2);
                    setExp(`${month}/${year}`);
                  }}
                  dateFormat="MM/yy"
                  showMonthYearPicker
                  locale="pl"
                  customInput={<button type="button" className="calendar-btn"><FaCalendar/></button>}
                />
              </div>
              {touched.exp && errors.exp && (
                <div className="pay-err">{errors.exp}</div>
              )}
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
            <h3>Płatność udana!</h3>
            <p>
              Twój numer rezerwacji to: <strong>{bookingRef}</strong>
            </p>
             <p>
              Potwierdzenie i inofmacje jak odprawić pozostałych pasażerów zostały wysłane na email: <strong>{email}</strong>
            </p>
            <Button1 className="pay-modal-btn" onClick={goToConfirmation}>
              Mój bilet <LuTicketsPlane />
            </Button1>
          </div>
        </div>
      )}
    </main>
  );
}
