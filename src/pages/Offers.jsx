import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Pagination } from "react-bootstrap";
import "../styles/offers.css";

export default function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [offersPerPage, setOffersPerPage] = useState(6);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const updateOffersPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) setOffersPerPage(3);
      else if (width < 1200) setOffersPerPage(4);
      else setOffersPerPage(6);
    };
    updateOffersPerPage();
    window.addEventListener("resize", updateOffersPerPage);
    return () => window.removeEventListener("resize", updateOffersPerPage);
  }, []);

  const destinations = [
    {
      id: 1,
      origin: "Warszawa",
      destination: "Ateny",
      originCode: "WAW",
      destinationCode: "ATH",
      img: "ateny.jpg",
      desc: "Odkryj starożytne skarby i rozkoszuj się słońcem Grecji.",
    },
    {
      id: 2,
      origin: "Rzym",
      destination: "Lizbona",
      originCode: "FCO",
      destinationCode: "LIS",
      img: "lizbona.jpg",
      desc: "Poznaj kolorowe uliczki Alfamy i widok z punktu Miradouro.",
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
      origin: "Londyn",
      destination: "Warszawa",
      originCode: "LHR",
      destinationCode: "WAW",
      img: "warszawa.jpg",
      desc: "Odwiedź serce Polski i zobacz tętniącą życiem stolicę.",
    },
    {
      id: 5,
      origin: "Londyn",
      destination: "Rzym",
      originCode: "LHR",
      destinationCode: "FCO",
      img: "rzym.jpg",
      desc: "Zanurz się w historii i skosztuj prawdziwej włoskiej kuchni.",
    },
    {
      id: 6,
      origin: "Warszawa",
      destination: "Oslo",
      originCode: "WAW",
      destinationCode: "OSL",
      img: "oslo.jpg",
      desc: "Zanurz się w skandynawskim stylu i odwiedź fiordy Norwegii.",
    },
    {
      id: 7,
      origin: "Paryż",
      destination: "Berlin",
      originCode: "CDG",
      destinationCode: "BER",
      img: "berlin.jpg",
      desc: "Odwiedź nowoczesny Berlin, pełen sztuki i historii.",
    },
    {
      id: 8,
      origin: "Warszawa",
      destination: "Lwów",
      originCode: "WAW",
      destinationCode: "LWO",
      img: "lwow.jpg",
      desc: "Odkryj urokliwe uliczki Lwowa i jego kawową tradycję.",
    },
    {
      id: 9,
      origin: "Lwów",
      destination: "Burgas",
      originCode: "LWO",
      destinationCode: "BOJ",
      img: "burgas.jpg",
      desc: "Zrelaksuj się nad Morzem Czarnym w bułgarskim Burgas.",
    },
    {
      id: 10,
      origin: "Warszawa",
      destination: "Paryż",
      originCode: "WAW",
      destinationCode: "CDG",
      img: "paryz.jpg",
      desc: "Spaceruj nad Sekwaną i odwiedź Wieżę Eiffla w romantycznym Paryżu.",
    },
    {
       id: 11,
    origin: "Rzym",
    destination: "Wiedeń",
    originCode: "FCO",
    destinationCode: "VIE",
    img: "wieden.jpg",
    desc: "Zasmakuj wiedeńskiej elegancji",
    },
    {
      id: 12,
      origin: "Warszawa",
      destination: "Londyn",
      originCode: "WAW",
      destinationCode: "LHR",
      img: "londyn.jpg",
      desc: "Poznaj Londyn — od Pałacu Buckingham po Big Ben.",
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

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(offers.length / offersPerPage);

  const handlePageChange = (page) => {
    setFade(true);
    setTimeout(() => {
      setCurrentPage(page);
      setFade(false);
    }, 200);
  };

  return (
    <main className="page offers-page">
      <h1 className="title">OFERTY SPECJALNE</h1>

      <div className={`offers-wrap fade-wrapper ${fade ? "fade-out" : "fade-in"}`}>
        <Row xs={1} md={3} xl={4} className="g-4">
          {currentOffers.map((offer) => (
            <Col key={offer.id}>
              <Card className="offer-card">
                <Card.Img
                  variant="top"
                  src={require(`../img/${offer.img}`)}
                  alt={offer.destination}
                  className="offer-img"
                />
                <Card.Body>
                  <Card.Title id="card-title">
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
                      id="offer-btn"
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

        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        )}
      </div>
    </main>
  );
}
