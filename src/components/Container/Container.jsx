import "./container.css";

export default function Container({ children, className = "" }) {
  return <div className={`app-container ${className}`}>{children}</div>;
}