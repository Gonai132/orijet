import "./button.css";

export default function Button1({ children, onClick, disabled, type = "button" }) {
  return (
    <button className="button button1" onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}