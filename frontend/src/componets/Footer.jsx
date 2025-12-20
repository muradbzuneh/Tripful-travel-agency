import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Tripful</h3>
            <p>Making holiday booking as easy as ordering food online!</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/packages">Packages</a></li>
              <li><a href="/my-bookings">My Bookings</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Complete Holiday Packages</li>
              <li>Book Now, Pay Later</li>
              <li>Quality Assured</li>
              <li>Easy Online Booking</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@tripful.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Tripful. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}