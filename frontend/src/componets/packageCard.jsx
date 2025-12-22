import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingService } from "../services/bookings";
import { packageService } from "../services/packages";
import "../styles/card.css";

export default function PackageCard({ pkg, onBookingSuccess, onPackageUpdate }) {
  const { isAuthenticated, isStaffOrAdmin, isAdmin } = useAuth();
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

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate this package?')) {
      try {
        await packageService.deactivatePackage(pkg.id);
        alert('Package deactivated successfully!');
        if (onPackageUpdate) onPackageUpdate();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to deactivate package');
      }
    }
  };

  const handleEdit = () => {
    // Navigate to staff dashboard with edit mode
    window.location.href = `/staff?edit=${pkg.id}`;
  };

  const getRatingImage = (rating) => {
    return `/src/assets/rating/rating-0${rating}.png`;
  };

  const getPackageImage = (pkg) => {
    if (pkg.image_url) {
      // If it's a backend uploaded image, prepend the backend URL
      if (pkg.image_url.startsWith('/uploads/')) {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${pkg.image_url}`;
      }
      return pkg.image_url;
    }
    // Fallback to sample image
    return `/src/assets/packages/${pkg.title}.jpg`;
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card">
      {/* Admin Controls */}
      {isStaffOrAdmin && (
        <div className="admin-controls">
          <button 
            onClick={handleEdit}
            className="edit-btn"
            title="Edit Package"
          >
            ✏️ Edit
          </button>
          {isAdmin && pkg.is_active && (
            <button 
              onClick={handleDeactivate}
              className="deactivate-btn"
              title="Deactivate Package"
            >
              🗑️ Deactivate
            </button>
          )}
          {!pkg.is_active && (
            <span className="inactive-badge">Inactive</span>
          )}
        </div>
      )}

      <img 
        src={getPackageImage(pkg)} 
        alt={pkg.title} 
        className="card-image"
        onError={(e) => {
          e.target.src = "/src/assets/sample-beach.jpg";
        }}
      />
      <div className="card-content">
        <h3>{pkg.title}</h3>
        <p className="destination">📍 {pkg.destination}</p>
        {pkg.location && <a href ={pkg.location}className="location">
          <img src="/src/assets/images/google-map.jpg" alt="" /></a>}
        <p className="duration">⏱️ {pkg.duration_days} days</p>
        <div className="hotel-info">
          <span className="hotel-name">🏨 {pkg.hotel_name}</span>
          {pkg.hotel_rating && (
            <img 
              src={getRatingImage(pkg.hotel_rating)} 
              alt={`${pkg.hotel_rating} stars`}
              className="rating-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
          )}
          <span className="rating-fallback" style={{display: 'none'}}>
            ({pkg.hotel_rating}⭐)
          </span>
        </div>
        <p className="flight">✈️ {pkg.flight_summary}</p>
        {pkg.description && (
          <p className="description">{pkg.description.substring(0, 100)}...</p>
        )}
        <div className="price-section">
          <strong className="price">${pkg.price}</strong>
          <span className="slots">({pkg.available_slots} slots available)</span>
        </div>
        
        {isAuthenticated && !isStaffOrAdmin ? (
          <div className="booking-section">
            {!showBookingForm ? (
              <button 
                onClick={() => setShowBookingForm(true)}
                className="book-btn"
                disabled={pkg.available_slots === 0 || !pkg.is_active}
              >
                {!pkg.is_active ? 'Inactive' : pkg.available_slots === 0 ? 'Sold Out' : 'Book Now'}
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
        ) : !isAuthenticated ? (
          <p className="login-prompt">
            <a href="/login">Login</a> to book this package
          </p>
        ) : (
          <div className="staff-info">
            <p className="staff-note">📋 Management View</p>
          </div>
        )}
      </div>
    </div>
  );
}
