import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import FlightDetails from "./pages/FlightDetails";
import SeatSelection from "./pages/SeatSelection";
import BagSelection from "./pages/BagSelection";
import ReservationForm from "./pages/ReservationForm";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Button1 from './components/Button/Button1';
import Button2 from './components/Button/Button2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/flight/:flightId" element={<FlightDetails />} />

        <Route path="/booking/seats" element={<SeatSelection />} />
        <Route path="/booking/baggage" element={<BagSelection />} />
        <Route path="/booking/passengers" element={<ReservationForm />} />
        <Route path="/booking/payment" element={<Payment />} />
        <Route path="/booking/confirmation/:pnr" element={<Confirmation />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Button1>Zarezerwuj</Button1>
      <Button2>Nie chcę bagażu</Button2>
    </BrowserRouter>
  );
}

export default App;