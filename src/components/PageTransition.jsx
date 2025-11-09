import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [fade, setFade] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setFade(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [children, location.pathname]);

  return (
    <div className={`fade-wrapper ${fade ? "fade-out" : "fade-in"}`}>
      {displayChildren}
    </div>
  );
}