import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import "./../styles/reservationForm.css";
import BackButton from "../components/Buttons/BackButton";
import { FaCircleCheck } from "react-icons/fa6";

const emailR = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneR = /^(?:\+?48)?[\s-]*\d{3}[\s-]*\d{3}[\s-]*\d{3}$/;
const docR = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,14}$/;

function isPastOrToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return d <= today;
}

export default function ReservationForm() {
  const navigate = useNavigate();
  const { state: prev } = useLocation();

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    doc: "",
    gender: "female",
    dob: "",
    email: "",
    phone: "",
    accept: false,
  });

  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const e = {};
    if (!form.fname.trim()) e.fname = "Podaj imię.";
    if (!form.lname.trim()) e.lname = "Podaj nazwisko.";
    if (!form.doc.trim()) e.doc = "Podaj numer dokumentu.";
    else if (!docR.test(form.doc.trim())) e.doc = "Nieprawidłowy format dokumentu.";
    if (!form.dob) e.dob = "Wybierz datę urodzenia.";
    else if (!isPastOrToday(form.dob)) e.dob = "Data urodzenia nie może być z przyszłości.";
    if (!form.email.trim()) e.email = "Podaj adres e-mail.";
    else if (!emailR.test(form.email.trim())) e.email = "Nieprawidłowy e-mail.";
    if (!form.phone.trim()) e.phone = "Podaj numer telefonu.";
    else if (!phoneR.test(form.phone.trim())) e.phone = "Podaj 9-cyfrowy numer (np. 123-456-789).";
    if (!form.accept) e.accept = "Musisz zaakceptować regulamin.";
    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onBlur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      fname: true,
      lname: true,
      doc: true,
      dob: true,
      email: true,
      phone: true,
      accept: true,
    });
    if (!isValid) return;


    navigate("/payment", {
      state: {
        ...prev,
        passenger: form,
      },
    });
  };

  return (
    <main className="page reservation">
      <BackButton />
            <ul className="location">
          <li>1.POŁĄCZENIE / </li>
          <li>2. MIEJSCE / </li>
          <li>3. BAGAŻ / </li>
          <li className="active">4. DANE / </li>
          <li>5. PŁATNOŚĆ</li>
        </ul>

      <h1 className="title">
        UZUPEŁNIJ SWOJE DANE
        <br />
        OSOBOWE:
      </h1>

      <Container className="rf-container">
        <form className="rf-card" onSubmit={handleSubmit} noValidate>
          <label className="rf-field">
            <span className="rf-label">IMIĘ:</span>
            <input
              className={`rf-input ${touched.fname && errors.fname ? "is-error" : ""}`}
              type="text"
              value={form.fname}
              onChange={onChange("fname")}
              onBlur={onBlur("fname")}
              placeholder="Imię/imiona"
              autoComplete="given-name"
              required
            />
            {touched.fname && errors.fname && <span className="rf-err">{errors.fname}</span>}
          </label>

          <label className="rf-field">
            <span className="rf-label">NAZWISKO:</span>
            <input
              className={`rf-input ${touched.lname && errors.lname ? "is-error" : ""}`}
              type="text"
              value={form.lname}
              onChange={onChange("lname")}
              onBlur={onBlur("lname")}
              placeholder="Nazwisko"
              autoComplete="family-name"
              required
            />
            {touched.lname && errors.lname && <span className="rf-err">{errors.lname}</span>}
          </label>

          <label className="rf-field">
            <span className="rf-label">DOKUMENT:</span>
            <input
              className={`rf-input ${touched.doc && errors.doc ? "is-error" : ""}`}
              type="text"
              value={form.doc}
              onChange={onChange("doc")}
              onBlur={onBlur("doc")}
              placeholder="numer i seria"
              required
            />
            {touched.doc && errors.doc && <span className="rf-err">{errors.doc}</span>}
          </label>

          <fieldset className="rf-field rf-inline">
            <legend className="rf-label">PŁEĆ:</legend>
            <label className="rf-radio">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={onChange("gender")}
              />
              <span>kobieta</span>
            </label>
            <label className="rf-radio">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={onChange("gender")}
              />
              <span>mężczyzna</span>
            </label>
          </fieldset>

          <label className="rf-field rf-inline-date">
            <span className="rf-label">DATA URODZENIA:</span>
            <input
              className={`rf-input ${touched.dob && errors.dob ? "is-error" : ""}`}
              type="date"
              value={form.dob}
              onChange={onChange("dob")}
              onBlur={onBlur("dob")}
              required
            />
            {touched.dob && errors.dob && <span className="rf-err">{errors.dob}</span>}
          </label>

          <label className="rf-field">
            <span className="rf-label">E-MAIL:</span>
            <input
              className={`rf-input ${touched.email && errors.email ? "is-error" : ""}`}
              type="email"
              value={form.email}
              onChange={onChange("email")}
              onBlur={onBlur("email")}
              placeholder="np. email@email.pl"
              autoComplete="email"
              required
            />
            {touched.email && errors.email && <span className="rf-err">{errors.email}</span>}
          </label>

          <label className="rf-field">
            <span className="rf-label">TELEFON:</span>
            <input
              className={`rf-input ${touched.phone && errors.phone ? "is-error" : ""}`}
              type="tel"
              value={form.phone}
              onChange={onChange("phone")}
              onBlur={onBlur("phone")}
              placeholder="np. 123-456-789"
              autoComplete="tel"
              required
            />
            {touched.phone && errors.phone && <span className="rf-err">{errors.phone}</span>}
          </label>
        </form>
      </Container>

  <div className="rf-bottom">
    <label className="rf-consent">
      <input
        type="checkbox"
        checked={form.accept}
        onChange={onChange("accept")}
        onBlur={onBlur("accept")}
      />
      <span>
        Akceptuję{" "}
        <a
          href="/rules"
          target="_blank"
          rel="noopener noreferrer"
          className="rf-link"
        >
          REGULAMIN
        </a>
        <FaCircleCheck className="icon-accept" />
      </span>
    </label>

    {touched.accept && errors.accept && (
      <div className="rf-err rf-err-consent">{errors.accept}</div>
    )}

    <div className="rf-cta">
      <Button1 type="submit" onClick={handleSubmit} disabled={!isValid}>
        PRZEJDŹ DO PŁATNOŚCI
      </Button1>
    </div>
  </div>
    </main>
  );
}
