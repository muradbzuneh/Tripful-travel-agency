import { Link } from "react-router-dom";

import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>Tripful</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/my-bookings">My Bookings</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
