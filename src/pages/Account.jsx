import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/account.css";
import Button1 from "../components/Buttons/Button1";
import { FaPlane, FaTrashAlt } from "react-icons/fa";
import Button2 from "../components/Buttons/Button2";
import mapImg from "../img/mapa1.png";

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

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    doc: "",
    gender: "female",
    dob: "",
    email: "",
    phone: "",
  });
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedUser"));
    if (!logged) navigate("/login");
    else {
      setUser(logged);
      setForm({
        fname: logged.fname || "",
        lname: logged.lname || "",
        doc: logged.doc || "",
        gender: logged.gender || "female",
        dob: logged.dob || "",
        email: logged.email || "",
        phone: logged.phone || "",
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  const errors = useMemo(() => {
    const e = {};
    if (!form.fname.trim()) e.fname = "Podaj imię.";
    if (!form.lname.trim()) e.lname = "Podaj nazwisko.";
    if (!form.doc.trim()) e.doc = "Podaj numer dokumentu.";
    else if (!docR.test(form.doc.trim())) e.doc = "Nieprawidłowy format dokumentu.";
    if (!form.dob) e.dob = "Wybierz datę urodzenia.";
    else if (!isPastOrToday(form.dob)) e.dob = "Data nie może być z przyszłości.";
    if (!form.email.trim()) e.email = "Podaj adres e-mail.";
    else if (!emailR.test(form.email.trim())) e.email = "Nieprawidłowy e-mail.";
    if (!form.phone.trim()) e.phone = "Podaj numer telefonu.";
    else if (!phoneR.test(form.phone.trim())) e.phone = "Nieprawidłowy numer telefonu.";
    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const onBlur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const handleSave = (e) => {
    e.preventDefault();
    setTouched({
      fname: true, lname: true, doc: true, dob: true, email: true, phone: true,
    });
    if (!isValid) return;

    const updatedUser = { ...user, ...form };
    setUser(updatedUser);
    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setMessage("Dane profilu zostały zapisane!");
    setTimeout(() => setMessage(""), 3000);
  };

  const confirmDelete = (id) => {
    setReservationToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    const updatedReservations = user.reservations.filter(
      (r) => r.id !== reservationToDelete
    );
    const updatedUser = { ...user, reservations: updatedReservations };
    setUser(updatedUser);
    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setShowModal(false);
    setReservationToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setReservationToDelete(null);
  };

  if (!user) return null;

  return (
    <main className="app-bg">
      <h1 className="title">TWOJE KONTO</h1>
      <img src={mapImg} className="mapa-img mapa-confirmation" alt="Mapa w tle" />
      <div className="center-vertical">
        <div className="app-container elevated account-container">
          <div className="account-header">
            <h2>Witaj, {user.username}!</h2>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <h3>Twoje rezerwacje:</h3>
          {user.reservations?.length ? (
            <ul className="reservation-list">
              {user.reservations.map((r) => (
                <li key={r.id} className="reservation-item">
                  <div className="reservation-info">
                    <strong>
                      {r.flight?.origin?.code} <FaPlane size={12}/> {r.flight?.destination?.code}
                    </strong>{", "}{r.dateISO}<br />
                    <div className="account-reservation">
                      Numer rezerwacji: <strong>{r.bookingRef}</strong>
                    </div>
                  </div>
                  <div className="reservation-actions">
                    <button
                      className="small-btn"
                      onClick={() =>
                        navigate("/confirmation", {
                          state: {
                            bookingRef: r.bookingRef,
                            flight: r.flight,
                            passenger: {
                              fname: user.fname,
                              lname: user.lname,
                              doc: user.doc,
                              dob: user.dob,
                            },
                            selectedSeats: r.selectedSeats,
                            dateISO: r.dateISO,
                          },
                        })
                      }
                    >
                      Karta pokładowa
                    </button>
                    <FaTrashAlt
                      className="trash-icon"
                      title="Usuń rezerwację"
                      onClick={() => confirmDelete(r.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nie masz jeszcze żadnych rezerwacji.</p>
          )}

          <Button1 onClick={() => navigate("/")}>Zarezerwuj lot</Button1>

          <hr className="divider" />

          <h3>Dane profilu:</h3>
          <form className="profile-form" onSubmit={handleSave}>
            {["fname", "lname", "doc", "dob", "email", "phone"].map((f) => (
              <label key={f}>
                {f === "fname"
                  ? "Imię:"
                  : f === "lname"
                  ? "Nazwisko:"
                  : f === "doc"
                  ? "Dokument:"
                  : f === "dob"
                  ? "Data urodzenia:"
                  : f === "email"
                  ? "E-mail:"
                  : "Telefon:"}
                <input
                  type={
                    f === "dob"
                      ? "date"
                      : f === "email"
                      ? "email"
                      : f === "phone"
                      ? "tel"
                      : "text"
                  }
                  className={`input ${touched[f] && errors[f] ? "is-error" : ""}`}
                  value={form[f]}
                  onChange={onChange(f)}
                  onBlur={onBlur(f)}
                />
                {touched[f] && errors[f] && (
                  <span className="err">{errors[f]}</span>
                )}
              </label>
            ))}

            <Button1 type="submit" className="login-btn" disabled={!isValid}>
              Zapisz zmiany
            </Button1>
            {message && <p className="save-msg">{message}</p>}
          </form>

          <Button2 className="logout-btn" onClick={handleLogout}>
            Wyloguj się
          </Button2>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Czy na pewno chcesz usunąć rezerwację?</h4>
            <p>Pieniądze zostaną zwrócone na konto.</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={handleConfirmDelete}>
                TAK
              </button>
              <button className="modal-btn cancel" onClick={handleCancelDelete}>
                ANULUJ
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
