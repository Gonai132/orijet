import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import Button1 from "../components/Buttons/Button1";
import mapImg from "../img/mapa1.png";
import { FaUser } from "react-icons/fa6";

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("users"));
    if (!existing || existing.length === 0) {
      const demoUsers = [
        {
          id: 1,
          username: "gosia",
          email: "gosia@email.pl",
          password: "1234",
          fname: "Małgorzata",
          lname: "Szymanik",
          doc: "ABC1234",
          dob: "2025-01-01",
          phone: "123456789",
          gender: "female",
          reservations: [
            {
              id: 1,
              bookingRef: "OJ-A1B2C",
              dateISO: "2026-06-15",
              selectedSeats: ["14A"],
              flight: {
                origin: { code: "WAW", name: "Warszawa Chopin" },
                destination: { code: "FCO", name: "Rzym Fiumicino" },
                flightNo: "OJ321",
                departTime: "09:40",
                arriveTime: "12:10",
                durationText: "2 h 30 min",
              },
            },
            {
              id: 2,
              bookingRef: "OJ-D3E4F",
              dateISO: "2026-06-22",
              selectedSeats: ["18C"],
              flight: {
                origin: { code: "LHR", name: "Londyn Heathrow" },
                destination: { code: "WAW", name: "Warszawa Chopin" },
                flightNo: "OJ322",
                departTime: "18:50",
                arriveTime: "21:20",
                durationText: "2 h 30 min",
              },
            },
          ],
        },
      ];
      localStorage.setItem("users", JSON.stringify(demoUsers));
    }
  }, []);

  const errors = useMemo(() => {
    const e = {};
    if (!username.trim()) e.username = "Podaj nazwę użytkownika.";
    if (isRegistering && !email.trim()) e.email = "Podaj adres e-mail.";
    else if (isRegistering && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Nieprawidłowy adres e-mail.";
    if (!password.trim()) e.password = "Podaj hasło.";
    else if (password.length < 4)
      e.password = "Hasło musi mieć co najmniej 4 znaki.";
    return e;
  }, [username, email, password, isRegistering]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true });
    if (!isValid) return;

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (isRegistering) {
      const existing = storedUsers.find(
        (u) => u.username === username || u.email === email
      );
      if (existing) {
        setMessage("Użytkownik o takiej nazwie lub adresie już istnieje!");
        return;
      }

      const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        reservations: [],
      };

      localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));
      setMessage("Konto utworzone! Możesz się teraz zalogować.");

      setUsername("");
      setEmail("");
      setPassword("");
      setTouched({});
      setIsRegistering(false);

      setTimeout(() => setMessage(""), 10000);
    } else {
      const user = storedUsers.find(
        (u) => u.username === username && u.password === password
      );
      setMessage("");

      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        window.dispatchEvent(new Event("userChanged"));
        setMessage(`Witaj, ${user.username}!`);
        setTimeout(() => navigate("/account"));
      } else {
        setMessage("Nieprawidłowa nazwa użytkownika lub hasło.");
      }
    }
  };

  const onBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  return (
    <main className="app-bg">
      <h1 className="title">{isRegistering ? "REJESTRACJA" : "LOGOWANIE"} <FaUser /></h1>

      <div className="map-wrapper"><img src={mapImg} className="mapa-img mapa-login" alt="Mapa w tle" /></div>

      <div className="center-vertical">
        <div className="app-container elevated login-container">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="label">
              Nazwa użytkownika
              <input
                type="text"
                className={`input ${
                  touched.username && errors.username ? "is-error" : ""
                }`}
                placeholder="np. gosia"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={onBlur("username")}
              />
              {touched.username && errors.username && (
                <span className="err">{errors.username}</span>
              )}
            </label>

            {isRegistering && (
              <label className="label">
                Adres e-mail
                <input
                  type="text"
                  className={`input ${
                    touched.email && errors.email ? "is-error" : ""
                  }`}
                  placeholder="np. login@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={onBlur("email")}
                />
                {touched.email && errors.email && (
                  <span className="err">{errors.email}</span>
                )}
              </label>
            )}

            <label className="label">
              Hasło
              <input
                type="password"
                className={`input ${
                  touched.password && errors.password ? "is-error" : ""
                }`}
                placeholder="np. 1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={onBlur("password")}
              />
              {touched.password && errors.password && (
                <span className="err">{errors.password}</span>
              )}
            </label>

            <Button1 type="submit" className="login-btn" disabled={!isValid}>
              {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
            </Button1>

            <p className="switch-mode">
              {isRegistering ? (
                <>
                  Masz już konto?{" "}
                  <span onClick={() => setIsRegistering(false)}>
                    Zaloguj się
                  </span>
                </>
              ) : (
                <>
                  Nie masz konta?{" "}
                  <span onClick={() => setIsRegistering(true)}>
                    Zarejestruj się
                  </span>
                </>
              )}
            </p>

            {message && <p className="login-message">{message}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
