import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useRef } from "react";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import FlightDetails from "./pages/FlightDetails";
import SeatSelection from "./pages/SeatSelection";
import BagSelection from "./pages/BagSelection";
import ReservationForm from "./pages/ReservationForm";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import NavbarMobile from "./components/Navbar/NavbarMobile";
import ScrollToTop from "./components/ScrollToTop";
import LowerMenu from "./components/LowerMenu/LowerMenu";
import Navbar from "./components/Navbar/Navbar";
import Contact from "./pages/Contact";
import Offers from "./pages/Offers";
import Map from "./pages/Map";
import Rules from "./pages/Rules";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Faq from "./pages/Faq";
import Footer from "./components/Footer/Footer";

function AnimatedRoutes() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
        nodeRef={nodeRef}
        timeout={400}
        classNames="page"
        unmountOnExit
      >
        <div ref={nodeRef} className="page-fade-wrapper">
          <Routes location={location}>
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
            <Route path="/faq" element={<Faq/>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default function App() {
  return (
    <div className="app-bg">
      <BrowserRouter>
      <ScrollToTop />
        <Navbar />
        <NavbarMobile />
        <AnimatedRoutes />
        <LowerMenu />
        <Footer />
      </BrowserRouter>
    </div>
  );
}
