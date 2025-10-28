import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "./button.css";

export default function BackButton({ children, onClick, type = "button" }) {

const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(-1)} aria-label="Wróć">
        <IoArrowBackCircle />
      </button>
  );
}

