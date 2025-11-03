import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/map.css";
import { FaPlane } from "react-icons/fa6";

const geoUrl = process.env.PUBLIC_URL + "/data/europe-geo.json";

export default function Map() {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [activeAirport, setActiveAirport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/flights.json")
      .then((res) => res.json())
      .then((data) => {
        setFlights(data);

        const uniqueAirports = {};
        data.forEach((flight) => {
          uniqueAirports[flight.origin.code] = flight.origin.name;
          uniqueAirports[flight.destination.code] = flight.destination.name;
        });

        const coordinates = {
          WAW: [21.0122, 52.2297],
          LHR: [-0.4543, 51.47],
          BER: [13.0033, 52.0067],
          CDG: [2.55, 49.0097],
          BCN: [2.0734, 41.3851],
          ATH: [23.7275, 37.9838],
          FCO: [12.4964, 41.9028],
          LIS: [-9.1393, 38.7223],
          VIE: [16.3725, 48.2089],
          OSL: [10.7522, 59.9139],
          BOJ: [27.5152, 42.5696],
          LWO: [24.0297, 49.8397],
        };

        const airportsList = Object.entries(uniqueAirports)
          .filter(([code]) => coordinates[code])
          .map(([code, name]) => ({
            code,
            name,
            coordinates: coordinates[code],
          }));

        setAirports(airportsList);
      });
  }, []);

  const handleClick = (airport) => {
    setActiveAirport(activeAirport === airport.code ? null : airport.code);
  };

  const handleRouteClick = (from, to) => {
    navigate("/", {
      state: {
        preselected: { origin: from, destination: to },
      },
    });
  };

  const isMobile = window.innerWidth < 768;

  const activeRoutes = flights.filter((f) => f.origin.code === activeAirport);

return (
  <main className="page map-page">
    <h1 className="title">MAPA POŁĄCZEŃ</h1>

    <div className="map-layout">
      <div className="connections-list">
        {activeAirport ? (
          <>
            <h2>Połączenia z {activeAirport} :</h2>
            <ul>
              {[...new Set(activeRoutes.map((r) => r.destination.code))].map((destCode) => {
                const dest = airports.find((a) => a.code === destCode);
                if (!dest) return null;
                return (
                  <li key={dest.code} onClick={() => handleRouteClick(activeAirport, dest.code)}> <FaPlane className="icon"/>
                  {dest.name} ({dest.code})
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="placeholder">
            <p>1. Naciśnij wybrane lotnisko, aby sprawdzić mapę połączeń.</p>
            <p>2. Następnie naciśnij połączenie aby wyszukać loty <FaPlane/></p>
          </div>
        )}
      </div>

      <div className="map-container">
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-9, -49, 0],
            scale: isMobile ? 1420 : 1320,
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e0feffff"
                  stroke="#777"
                  strokeWidth={0.4}
                />
              ))
            }
          </Geographies>

          {activeRoutes.map((route) => {
            const fromAirport = airports.find((a) => a.code === route.origin.code);
            const toAirport = airports.find((a) => a.code === route.destination.code);
            if (!fromAirport || !toAirport) return null;
            return (
              <Line
                key={route.id}
                from={fromAirport.coordinates}
                to={toAirport.coordinates}
                stroke="#00BCD4"
                strokeWidth={3}
                strokeLinecap="round"
                style={{ opacity: 0.8 }}
              />
            );
          })}

          {airports.map((airport) => (
            <Marker
              key={airport.code}
              coordinates={airport.coordinates}
              onClick={() => handleClick(airport)}
            >
              <circle
                r={activeAirport === airport.code ? 12 : 9}
                fill={airport.code === "WAW" ? "orange" : "#007389"}
                stroke="#fff"
                strokeWidth={1}
                style={{ cursor: "pointer", transition: "all 0.3s" }}
              />
              <text
                textAnchor="middle"
                y={-15}
                style={{ fontSize: 14, fill: "#444", fontWeight: "600" }}
              >
                {airport.code}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  </main>
);
}
