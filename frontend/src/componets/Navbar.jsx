import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getTranslation } from "../utils/translations";
import { useState } from "react";
import ThemeLanguageSelector from "./ThemeLanguageSelector";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated, isStaffOrAdmin, isAdmin } = useAuth();
  const { language } = useTheme();
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

        <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="nav-links-container">
            <Link to="/" onClick={closeMobileMenu}>
              {getTranslation("home", language)}
            </Link>
            <Link to="/packages" onClick={closeMobileMenu}>
              {getTranslation("packages", language)}
            </Link>

            {!isStaffOrAdmin ? (
              <>
                <Link to="/services" onClick={closeMobileMenu}>
                  {getTranslation("services", language)}
                </Link>
                <Link to="#" onClick={handleNavScroll("Events")}>
                  {getTranslation("events", language)}
                </Link>
                <Link to="/attractions" onClick={closeMobileMenu}>
                  {getTranslation("attractions", language)}
                </Link>
                <Link to="/destinations" onClick={closeMobileMenu}>
                  {getTranslation("destinations", language)}
                </Link>
                {isAuthenticated && getTranslation && language && (
                  <Link to="/my-bookings" onClick={closeMobileMenu}>
                    {getTranslation("myBookings", language)}
                  </Link>
                )}
              </>
            ) : null}

            <ThemeLanguageSelector />

            {isAuthenticated ? (
              <>
                {isStaffOrAdmin && (
                  <Link to="/staff" onClick={closeMobileMenu}>
                    {getTranslation("staffDashboard", language)}
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={closeMobileMenu}>
                    {getTranslation("adminPanel", language)}
                  </Link>
                )}
                <div className="user-menu">
                  <span className="user-name">
                    {(() => {
                      if (user?.full_name) {
                        const names = user.full_name.split(" ");
                        const firstInitial =
                          names[0]?.charAt(0).toUpperCase() || "";
                        const fatherInitial =
                          names[1]?.charAt(0).toUpperCase() || "";
                        return `👤 ${firstInitial}${fatherInitial}`;
                      }
                      return "👤 User";
                    })()}
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    {getTranslation("logout", language)}
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" onClick={closeMobileMenu}>
                  {getTranslation("login", language)}
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="register-btn"
                >
                  {getTranslation("register", language)}
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
