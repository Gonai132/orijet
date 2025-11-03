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
import NavbarMobile from './components/Navbar/NavbarMobile';
import LowerMenu from './components/LowerMenu/LowerMenu';
import Navbar from './components/Navbar/Navbar';
import Contact from "./pages/Contact";
import Offers from "./pages/Offers";
import Map from './pages/Map';
import Rules from './pages/Rules';
import Login from './pages/Login';

function App() {
  return (
    <div className="app-bg">
    <BrowserRouter>
    <Navbar />
    <NavbarMobile />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/details" element={<FlightDetails />} />
        <Route path="/seats" element={<SeatSelection />} />
        <Route path="/baggage" element={<BagSelection />} />
        <Route path="/passengers" element={<ReservationForm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/map" element={<Map />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LowerMenu />
    </BrowserRouter>
    </div>
  );
}

export default App;