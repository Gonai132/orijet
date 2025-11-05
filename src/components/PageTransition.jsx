import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [fade, setFade] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setFade(true); // zaczyna się znikać
    const timeout = setTimeout(() => {
      setDisplayChildren(children); // podmiana zawartości po zniknięciu
      setFade(false); // pojawia się nowa
    }, 200); // 200ms = długość fade-out
    return () => clearTimeout(timeout);
  }, [children, location.pathname]);

  return (
    <div className={`fade-wrapper ${fade ? "fade-out" : "fade-in"}`}>
      {displayChildren}
    </div>
  );
}