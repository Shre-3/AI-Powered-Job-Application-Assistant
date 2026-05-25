import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink className="brand" to="/">
        Job Assistant
      </NavLink>
      <nav>
        <NavLink to="/base-cv">Base CV</NavLink>
        <NavLink to="/generate">Generate</NavLink>
        <NavLink to="/tracker">Tracker</NavLink>
      </nav>
    </header>
  );
}
