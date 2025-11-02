import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import "../styles/offers.css";

export default function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);

  const destinations = [
    {
      id: 1,
      origin: "Warszawa Chopin",
      destination: "Ateny",
      originCode: "WAW",
      destinationCode: "ATH",
      img: "ateny.jpg",
      desc: "Odkryj starożytne skarby i rozkoszuj się słońcem Grecji.",
    },
    {
      id: 2,
      origin: "Londyn",
      destination: "Rzym",
      originCode: "LHR",
      destinationCode: "FCO",
      img: "rzym.jpg",
      desc: "Zanurz się w historii i skosztuj prawdziwej włoskiej kuchni.",
    },
    {
      id: 3,
      origin: "Lizbona",
      destination: "Barcelona",
      originCode: "LIS",
      destinationCode: "BCN",
      img: "barcelona.jpg",
      desc: "Zrelaksuj się na plaży i odkryj wyjątkową architekturę Gaudíego.",
    },
    {
      id: 4,
      origin: "Warszawa Chopin",
      destination: "Paryż",
      originCode: "WAW",
      destinationCode: "CDG",
      img: "paryz.jpg",
      desc: "Spaceruj nad Sekwaną i odwiedź Wieżę Eiffla w romantycznym Paryżu.",
    },
    {
      id: 5,
      origin: "Rzym",
      destination: "Lizbona",
      originCode: "FCO",
      destinationCode: "LIS",
      img: "lizbona.jpg",
      desc: "Poznaj kolorowe uliczki Alfamy i widok z punktu Miradouro.",
    },
    {
      id: 6,
      origin: "Warszawa Chopin",
      destination: "Oslo",
      originCode: "WAW",
      destinationCode: "OSL",
      img: "oslo.jpg",
      desc: "Zanurz się w skandynawskim stylu i odwiedź fiordy Norwegii.",
    },
  ];

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/flights.json`)
      .then((r) => r.json())
      .then((flightsData) => {
        const enrichedOffers = destinations.map((offer) => {
          const flights = flightsData.filter(
            (f) =>
              f.origin.code === offer.originCode &&
              f.destination.code === offer.destinationCode
          );

          const minPrice = flights.length
            ? Math.min(...flights.map((f) => f.pricePLN))
            : null;

          return { ...offer, price: minPrice || "—" };
        });

        setOffers(enrichedOffers);
      })
      .catch(() => setOffers(destinations));
  }, []);

  const goToHome = (offer) => {
    navigate("/", {
      state: {
        preselected: {
          origin: offer.originCode,
          destination: offer.destinationCode,
        },
      },
    });
  };

  return (
    <main className="page offers-page">
      <h1 className="title">OFERTY SPECJALNE</h1>

      <div className="offers-wrap">
        <Row xs={1} md={3} xl={4} className="g-4">
          {offers.map((offer) => (
            <Col key={offer.id}>
              <Card className="offer-card">
                <Card.Img
                  variant="top"
                  src={require(`../img/${offer.img}`)}
                  alt={offer.destination}
                  className="offer-img"
                />
                <Card.Body>
                  <Card.Title>
                    {offer.origin} – {offer.destination}
                  </Card.Title>
                  <Card.Text>{offer.desc}</Card.Text>
                  <div className="offer-footer">
                    <span className="offer-price">
                      Cena od{" "}
                      <strong>
                        {offer.price !== "—"
                          ? `${offer.price} PLN`
                          : "brak danych"}
                      </strong>
                    </span>
                    <Button
                      className="offer-btn"
                      onClick={() => goToHome(offer)}
                    >
                      Zobacz loty
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </main>
  );
}
