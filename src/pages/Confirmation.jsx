import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import html2canvas from "html2canvas";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import Button2 from "../components/Buttons/Button2";
import "./../styles/confirmation.css";
import { FaPlane} from "react-icons/fa6";
import barcodeImg from "../img/code.png";
import logo from "../img/logoSmall.png";

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const out = state?.flight ?? null;

  const pax = state?.passenger || {};
  const fullName = [pax.fname, pax.lname].filter(Boolean).join(" ") || "—";
  const dob = pax.dob || "—";
  const doc = pax.doc || "—";
  const seat = (state?.selectedSeats && state.selectedSeats[0]) || "—"; 

  const flightNo = out?.flightNo || (state?.bookingRef || "—");
  const dep = out?.departTime || out?.departure || "—";
  const arr = out?.arriveTime || "—";
  const oCode = out?.origin?.code || "—";
  const oName = out?.origin?.name || "";
  const dCode = out?.destination?.code || "—";
  const dName = out?.destination?.name || "";
  const date = state?.dateISO || out?.date || "—";
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
    if (out?.durationText) return out.durationText;
    const m = Number(out?.durationMin || 0);
    if (!m) return "—";
    const h = Math.floor(m / 60);
    const mm = String(m % 60).padStart(2, "0");
    return `${h} h ${mm} min`;
  }, [out]);

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
    a.download = `boarding-${flightNo}.png`;
    a.click();
  };

  return (
    <main className="page confirmation">
      <h1 className="bp-title">KARTA POKŁADOWA:</h1>

      <Container className="bp-wrap">
        <div id="boarding-card" className="bp-stack">
          <section className="bp-card bp-card--top">
            <div className="bp-logo"><img src={logo} alt="OriJet logo" className="brand-logo"/>
          <span className="brand-text">OriJet</span></div>
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
                <div className="bp-plane"><FaPlane /></div>
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
            <img src={barcodeImg} alt="Kod kreskowy" className="bp-barcode" />
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
