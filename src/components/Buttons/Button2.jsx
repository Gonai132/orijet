import "./button.css";

export default function Button2({ children, onClick, disabled, type = "button" }) {
  return (
    <button className="button button2" onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}