import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";
export default function Navbar() {
  const { user, logout, isAuthenticated, isStaffOrAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

 const handleNavScroll = (section) => (e) => {
  e.preventDefault();
  navigate("/", { state: { scrollTo: section } });
};

  const handleLogout = () => {
    logout();
    navigate('/');
  };
 

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          <h2>Tripful</h2>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="#" onClick={handleNavScroll("about")}> About us</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/services">Services</Link>
           <Link to="#" onClick={handleNavScroll("Events")}>
      Events
    </Link>
          <Link to="/attractions">Attractions</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="#" onClick={handleNavScroll("contact")}> Contact</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings">My Bookings</Link>
              {isStaffOrAdmin && <Link to="/staff">Staff Dashboard</Link>}
              {isAdmin && <Link to="/admin">Admin Panel</Link>}
              <div className="user-menu">
                <span> {user?.full_name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout 
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
