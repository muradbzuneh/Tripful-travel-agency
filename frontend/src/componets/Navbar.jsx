import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated, isStaffOrAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavScroll = (section) => (e) => {
    e.preventDefault();
    navigate("/", { state: { scrollTo: section } });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <div className="logo-container">
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="logo-text">
              <h2>Tripful</h2>
              <span className="logo-tagline">Travel Agency</span>
            </div>
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="nav-links-container">
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="#" onClick={handleNavScroll("about")}>
              About us
            </Link>
            <Link to="/packages" onClick={closeMobileMenu}>
              Packages
            </Link>

            {!isStaffOrAdmin ? (
              <>
                <Link to="/services" onClick={closeMobileMenu}>
                  Services
                </Link>
                <Link to="#" onClick={handleNavScroll("Events")}>
                  Events
                </Link>
                <Link to="/attractions" onClick={closeMobileMenu}>
                  Attractions
                </Link>
                <Link to="/destinations" onClick={closeMobileMenu}>
                  Destinations
                </Link>
                <Link to="#" onClick={handleNavScroll("contact")}>
                  Contact
                </Link>
              </>
            ) : null}

            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" onClick={closeMobileMenu}>
                  My Bookings
                </Link>
                {isStaffOrAdmin && (
                  <Link to="/staff" onClick={closeMobileMenu}>
                    Staff Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={closeMobileMenu}>
                    Admin Panel
                  </Link>
                )}
                <div className="user-menu">
                  <span className="user-name">👤 {user?.full_name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="register-btn"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
        )}
      </nav>
    </>
  );
}
