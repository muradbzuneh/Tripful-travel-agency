import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingService } from "../services/bookings";
import "../styles/card.css";

export default function PackageCard({ pkg, onBookingSuccess }) {
  const { isAuthenticated } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!travelDate) {
      setError('Please select a travel date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await bookingService.createBooking({
        package_id: pkg.id,
        travel_date: travelDate
      });
      
      setShowBookingForm(false);
      setTravelDate('');
      if (onBookingSuccess) onBookingSuccess();
      alert('Booking created successfully! Check your bookings to make payment.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card">
      <img 
        src="/src/assets/sample-beach.jpg" 
        alt={pkg.title} 
        className="card-image"
      />
      <div className="card-content">
        <h3>{pkg.title}</h3>
        <p className="destination">📍 {pkg.destination}</p>
        <p className="duration">⏱️ {pkg.duration_days} days</p>
        <p className="hotel">🏨 {pkg.hotel_name} ({pkg.hotel_rating}⭐)</p>
        <p className="flight">✈️ {pkg.flight_summary}</p>
        <div className="price-section">
          <strong className="price">${pkg.price}</strong>
          <span className="slots">({pkg.available_slots} slots available)</span>
        </div>
        
        {isAuthenticated ? (
          <div className="booking-section">
            {!showBookingForm ? (
              <button 
                onClick={() => setShowBookingForm(true)}
                className="book-btn"
                disabled={pkg.available_slots === 0}
              >
                {pkg.available_slots === 0 ? 'Sold Out' : 'Book Now'}
              </button>
            ) : (
              <form onSubmit={handleBookNow} className="booking-form">
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={today}
                  required
                />
                <div className="form-buttons">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowBookingForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
                {error && <p className="error">{error}</p>}
              </form>
            )}
          </div>
        ) : (
          <p className="login-prompt">
            <a href="/login">Login</a> to book this package
          </p>
        )}
      </div>
    </div>
  );
}
