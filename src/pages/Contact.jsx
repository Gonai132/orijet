import { useState, useEffect } from "react";
import Container from "../components/Container/Container";
import Button1 from "../components/Buttons/Button1";
import "../styles/contact.css";
import mapImg from "../img/mapa1.png";
import { FaMessage } from "react-icons/fa6";
import BackButton from "../components/Buttons/BackButton";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (stored) {
      const user = JSON.parse(stored);
      const fullName = [user.fname, user.lname].filter(Boolean).join(" ");

      setForm((f) => ({
        ...f,
        name: fullName || "",
        email: user.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = {
    name: form.name.trim().length > 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    topic: !!form.topic,
    message: form.message.trim().length > 10,
  };

  const isValid = Object.values(validate).every(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      topic: true,
      message: true,
    });
    if (!isValid) return;
    setSent(true);
    setForm({ name: "", email: "", topic: "", message: "" });
  };

  return (
    <main className="page contact-page">
      <BackButton />
      <h1 className="title">
        SKONTAKTUJ SIĘ Z NAMI <FaMessage />
      </h1>

      <img src={mapImg} className="mapa-img mapa-confirmation" alt="Mapa w tle" />

      <Container className="contact-wrap">
        {sent ? (
          <div className="contact-success">
            Wiadomość została wysłana!
            <div>Odpowiemy jak naszybciej.</div>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-field">
              <label>Imię i nazwisko:</label>
              <input
                type="text"
                name="name"
                placeholder="np. Jan Kowalski"
                value={form.name}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
              {touched.name && !validate.name && (
                <p className="err-msg">Podaj pełne imię i nazwisko.</p>
              )}
            </div>

            <div className="contact-field">
              <label>Adres e-mail:</label>
              <input
                type="email"
                name="email"
                placeholder="np. jan.kowalski@email.pl"
                value={form.email}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
              {touched.email && !validate.email && (
                <p className="err-msg">Wprowadź poprawny adres e-mail.</p>
              )}
            </div>

            <div className="contact-field">
              <label>Temat wiadomości:</label>
              <select
                name="topic"
                value={form.topic}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, topic: true }))}
              >
                <option value="">-- wybierz temat --</option>
                <option value="loty">Pytanie o loty</option>
                <option value="rezerwacje">Pomoc z rezerwacją</option>
                <option value="płatności">Problemy z płatnością</option>
                <option value="inne">Inna sprawa</option>
              </select>
              {touched.topic && !validate.topic && (
                <p className="err-msg">Wybierz temat wiadomości.</p>
              )}
            </div>

            <div className="contact-field">
              <label>Treść wiadomości:</label>
              <textarea
                name="message"
                placeholder="Wpisz treść swojej wiadomości..."
                value={form.message}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
              ></textarea>
              {touched.message && !validate.message && (
                <p className="err-msg">Wiadomość powinna mieć min. 10 znaków.</p>
              )}
            </div>

            <div className="contact-btn">
              <Button1 type="submit" disabled={!isValid}>
                WYŚLIJ WIADOMOŚĆ
              </Button1>
            </div>
          </form>
        )}
      </Container>
    </main>
  );
}
