import "./../styles/home.css";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiArrowsClockwiseFill } from "react-icons/pi";
import { FaPlaneDeparture, FaPlaneArrival, FaChevronDown } from "react-icons/fa6";

import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import { parseISO as dfParseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

import {
  toISO,
  parseISO,
  listAvailableDates,
  getReachableAirports,
} from "../data/Schedule";

registerLocale("pl", pl);

export default function Home() {
  const navigate = useNavigate();

  const [rules, setRules] = useState([]);
  const [tripType, setTripType] = useState("rt");
  const [origin, setOrigin] = useState("WAW");
  const [destination, setDestination] = useState("");
  const [departISO, setDepartISO] = useState("");
  const [returnISO, setReturnISO] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/flights.json`)
      .then((r) => r.json())
      .then(setRules)
      .catch(() => setRules([]));
  }, []);

  const airports = useMemo(() => {
    const map = new Map();
    rules.forEach((r) => {
      map.set(r.origin.code, r.origin.name);
      map.set(r.destination.code, r.destination.name);
    });
    return Array.from(map.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [rules]);

  const reachable = useMemo(() => {
    if (!origin) return [];
    return getReachableAirports(rules, origin);
  }, [rules, origin]);

  const departDatesISO = useMemo(() => {
    if (!origin || !destination) return [];
    const pivot = departISO || toISO(new Date());
    return listAvailableDates(rules, origin, destination, pivot, 540);
  }, [rules, origin, destination, departISO]);

  const returnDatesISO = useMemo(() => {
    if (tripType !== "rt" || !origin || !destination || !departISO) return [];
    const pivot = returnISO || departISO;
    return listAvailableDates(rules, destination, origin, pivot, 540).filter(
      (d) => d >= departISO
    );
  }, [rules, origin, destination, tripType, departISO, returnISO]);

  useEffect(() => {
    if (!departISO && origin && destination && departDatesISO.length) {
      setDepartISO(departDatesISO[0]);
    }
  }, [origin, destination, departDatesISO, departISO]);

  useEffect(() => {
    if (tripType === "ow") setReturnISO("");
  }, [tripType]);

  const dec = () => {
    setPassengers((p) => Math.max(1, p - 1));
    setFormError("");
  };
  const inc = () => {
    setPassengers((p) => Math.min(9, p + 1));
    setFormError("");
  };

  const swapDirections = () => {
    setOrigin((prev) => {
      setDestination((prevDest) => prev);
      return destination;
    });
    setDepartISO("");
    setReturnISO("");
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!origin) return setFormError("Wybierz lotnisko wylotu.");
    if (!destination) return setFormError("Wybierz lotnisko przylotu.");
    if (!departISO) return setFormError("Wybierz datę wylotu.");
    if (!departDatesISO.includes(departISO))
      return setFormError("Wybrana data wylotu nie jest dostępna.");

    let params = {
      o: origin,
      d: destination,
      date: departISO,
      pax: String(passengers),
      rt: tripType === "rt" ? "1" : "0",
    };

    if (tripType === "rt") {
      if (!returnISO) return setFormError("Wybierz datę powrotu.");
      if (returnISO < departISO)
        return setFormError("Data powrotu musi być po dacie wylotu.");
      if (!returnDatesISO.includes(returnISO))
        return setFormError("Wybrana data powrotu nie jest dostępna.");
      params.ret = returnISO;
    }

    const q = new URLSearchParams(params);
    navigate(`/search?${q.toString()}`);
  };

  const departSelected = departISO ? dfParseISO(departISO) : null;
  const returnSelected = returnISO ? dfParseISO(returnISO) : null;

  const includeDepart = departDatesISO.map((d) => parseISO(d));
  const includeReturn = returnDatesISO.map((d) => parseISO(d));

  return (
    <main className="page home">
      <section className="movie-banner">
        <video
          className="movie-video"
          src={require("../img/OriJetVideo.mp4")}
          autoPlay
          muted
          loop
          playsInline
        />
      </section>

      <section className="home-search">
        <Container>
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="trip-type">
              <label className="radio">
                <input
                  type="radio"
                  name="tripType"
                  value="rt"
                  checked={tripType === "rt"}
                  onChange={() => {
                    setTripType("rt");
                    setFormError("");
                  }}
                />
                <span>W obie strony</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="tripType"
                  value="ow"
                  checked={tripType === "ow"}
                  onChange={() => {
                    setTripType("ow");
                    setFormError("");
                  }}
                />
                <span>W jedną stronę</span>
              </label>
            </div>

            <div className="loc-group">
              <div className="field-row with-icon">
                <FaPlaneDeparture className="ficon" aria-hidden />
                <div className="select-wrap">
                  <label className="label">Wylot</label>
                  <select
                    className="select"
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setDestination("");
                      setDepartISO("");
                      setReturnISO("");
                      setFormError("");
                    }}
                  >
                    <option value="" disabled>
                      Wybierz lotnisko…
                    </option>
                    {airports.map((a) => (
                      <option key={`o-${a.code}`} value={a.code}>
                        {a.code} {a.name}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="chev" aria-hidden />
                </div>
              </div>

              <button
                type="button"
                className="swap"
                onClick={swapDirections}
                aria-label="Zamień kierunki"
              >
                <PiArrowsClockwiseFill />
              </button>

              <div className="field-row with-icon">
                <FaPlaneArrival className="ficon" aria-hidden />
                <div className="select-wrap">
                  <label className="label">Przylot</label>
                  <select
                    className="select"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setDepartISO("");
                      setReturnISO("");
                      setFormError("");
                    }}
                  >
                    <option value="" disabled>
                      Wybierz z listy…
                    </option>
                    {reachable
                      .filter((a) => a.code !== origin)
                      .map((a) => (
                        <option key={`d-${a.code}`} value={a.code}>
                          {a.code} {a.name}
                        </option>
                      ))}
                  </select>
                  <FaChevronDown className="chev" aria-hidden />
                </div>
              </div>
            </div>

            <div className={`dates-row ${tripType === "ow" ? "single" : ""}`}>
              <div className="date-field">
                <label className="label">Od</label>
                <DatePicker
                  locale="pl"
                  selected={departSelected}
                  onChange={(d) => {
                    setDepartISO(d ? toISO(d) : "");
                    setFormError("");
                  }}
                  includeDates={includeDepart}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="dd.mm.rrrr"
                  withPortal
                  popperPlacement="bottom-start"
                />
              </div>

              {tripType === "rt" && (
                <div className="date-field">
                  <label className="label">Do</label>
                  <DatePicker
                    locale="pl"
                    selected={returnSelected}
                    onChange={(d) => {
                      setReturnISO(d ? toISO(d) : "");
                      setFormError("");
                    }}
                    includeDates={includeReturn}
                    minDate={departSelected || undefined}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="dd.mm.rrrr"
                    withPortal
                    popperPlacement="bottom-start"
                  />
                </div>
              )}
            </div>

            <div className="passengers">
              <span className="label">Liczba pasażerów:</span>
              <div className="counter">
                <button className="counter-btn" type="button" onClick={dec}>−</button>
                <span className="counter-val">{passengers}</span>
                <button className="counter-btn" type="button" onClick={inc}>+</button>
              </div>
            </div>

            <div className="row cta">
              {formError && <div className="form-error">{formError}</div>}
              <Button1 type="submit">Wyszukaj loty</Button1>
            </div>
          </form>
        </Container>
      </section>
    </main>
  );
}
