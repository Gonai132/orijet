import "./button.css";

export default function Button2({ children, onClick, type = "button" }) {
  return (
    <button className="button button2" onClick={onClick} type={type}>
      {children}
    </button>
  );
}