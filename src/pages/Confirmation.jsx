import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import Button2 from "../components/Buttons/Button2";
import "./../styles/confirmation.css";
import { FaPlane } from "react-icons/fa6";
import BackButton from "../components/Buttons/BackButton";
import barcodeImg from "../img/code.png";
import logo from "../img/logoSmall.png";
import mapImg from "../img/mapa1.png";

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const out = state?.flight ?? null;
  const back = state?.returnFlight ?? null;

  const [segment, setSegment] = useState("out");

  const currentFlight = segment === "out" ? out : back;

  const pax = state?.passenger || {};
  const fullName = [pax.fname, pax.lname].filter(Boolean).join(" ") || "—";
  const dob = pax.dob || "—";
  const doc = pax.doc || "—";

  const seat =
    segment === "out"
      ? (state?.selectedSeats && state.selectedSeats[0]) || "—"
      : (state?.returnSelectedSeats && state.returnSelectedSeats[0]) || "—";

  const flightNo =
    currentFlight?.flightNo || state?.bookingRef || "—";

  const dep =
    currentFlight?.departTime || currentFlight?.departure || "—";

  const arr = currentFlight?.arriveTime || "—";

  const oCode = currentFlight?.origin?.code || "—";
  const oName = currentFlight?.origin?.name || "";
  const dCode = currentFlight?.destination?.code || "—";
  const dName = currentFlight?.destination?.name || "";

  const date =
    segment === "out"
      ? (state?.dateISO || out?.date || "—")
      : (state?.returnDateISO || back?.date || "—");

  function subtract30min(timeStr) {
    const m = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return "—";
    const h = Number(m[1]);
    const min = Number(m[2]);
    const total = h * 60 + min - 30;
    const newH = ((Math.floor(total / 60) % 24) + 24) % 24;
    const newM = ((total % 60) + 60) % 60;
    return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
  }

  const boarding = dep !== "—" ? subtract30min(dep) : "—";

  const duration = useMemo(() => {
    if (currentFlight?.durationText) return currentFlight.durationText;
    const m = Number(currentFlight?.durationMin || 0);
    if (!m) return "—";
    const h = Math.floor(m / 60);
    const mm = String(m % 60).padStart(2, "0");
    return `${h} h ${mm} min`;
  }, [currentFlight]);

  const downloadCard = async () => {
    const el = document.getElementById("boarding-card");
    if (!el) return;
    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `bilet-${flightNo}.png`;
    a.click();
  };

  return (
    <main className="page confirmation">
      <BackButton />

      <ul className="location">
        <li className="active">
          POTWIERDZENIE REZERWACJI {state?.bookingRef}
        </li>
      </ul>

      <h1 className="title">KARTA POKŁADOWA:</h1>

      <img
        src={mapImg}
        className="mapa-img mapa-confirmation"
        alt="Mapa w tle"
      />

      <Container className="bp-wrap">
              {back ? (
        <div className="fd-tabs">
          <button
            type="button"
            className={`fd-tab ${segment === "out" ? "is-active" : ""}`}
            onClick={() => setSegment("out")}
          >
            Wylot
          </button>
          <button
            type="button"
            className={`fd-tab ${segment === "in" ? "is-active" : ""}`}
            onClick={() => setSegment("in")}
          >
            Powrót
          </button>
        </div>
      ) :null}
        <div id="boarding-card" className="bp-stack">
          <section className="bp-card bp-card--top">
            <div className="bp-logo">
              <img src={logo} alt="OriJet logo" className="brand-logo" />
              <span className="brand-text">OriJet</span>
            </div>

            <div className="bp-head">
              <div className="bp-col-left">
                <div className="bp-airport">{oCode}</div>
                <div className="bp-city">{oName}</div>
                <div className="bp-time">{dep}</div>
              </div>

              <div className="bp-col-mid">
                <div className="bp-flightno">
                  Nr lotu: <strong>{flightNo}</strong>
                </div>
                <div className="bp-plane">
                  <FaPlane />
                </div>
                <div className="bp-duration">{duration}</div>
              </div>

              <div className="bp-col-right">
                <div className="bp-airport">{dCode}</div>
                <div className="bp-city">{dName}</div>
                <div className="bp-time bp-time--right">{arr}</div>
              </div>
            </div>

            <hr className="bp-hr" />

            <div className="bp-two-cols">
              <div className="bp-col">
                <div className="bp-label">Imię i nazwisko:</div>
                <div className="bp-value">{fullName}</div>
              </div>
              <div className="bp-col bp-col--right">
                <div className="bp-label">Boarding:</div>
                <div className="bp-value">{boarding}</div>
              </div>

              <div className="bp-col">
                <div className="bp-label">Data urodzenia:</div>
                <div className="bp-value">{dob}</div>
              </div>
              <div className="bp-col bp-col--right">
                <div className="bp-label">Data:</div>
                <div className="bp-value">{date}</div>
              </div>

              <div className="bp-col">
                <div className="bp-label">Dokument:</div>
                <div className="bp-value">{doc}</div>
              </div>
              <div className="bp-col bp-col--right">
                <div className="bp-label">Miejsce:</div>
                <div className="bp-value bp-seat">{seat}</div>
              </div>
            </div>
          </section>

          <section className="bp-card bp-card--bottom">
            <img
              src={barcodeImg}
              alt="Kod kreskowy"
              className="bp-barcode"
            />
          </section>
        </div>
      </Container>

      <div className="bp-cta">
        <Button1 onClick={downloadCard}>POBIERZ</Button1>
        <Button2 onClick={() => navigate("/")}>ZAMKNIJ</Button2>
      </div>
    </main>
  );
}
