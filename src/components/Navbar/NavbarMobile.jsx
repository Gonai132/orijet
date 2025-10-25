import "./navbarMobile.css";

export default function NavbarMobile() {
  return (
    <header className="navbar-mobile">
      <div className="status-bar" />

      <nav className="nav-bar">
        <div className="brand">
          <span className="logo-text">OriJet</span>
        </div>

        <button className="menu-btn" aria-label="Otwórz menu">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </nav>
    </header>
  );
}