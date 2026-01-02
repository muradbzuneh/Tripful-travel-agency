import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingService } from "../services/bookings";
import { packageService } from "../services/packages";
import { getPackageImageUrl, createImageErrorHandler } from "../utils/imageUtils";
import "../styles/card.css";

export default function PackageCard({
  pkg,
  onBookingSuccess,
  onPackageUpdate,
}) {
  const { isAuthenticated, isStaffOrAdmin, isAdmin } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageErrorHandler, setImageErrorHandler] = useState(null);

  // Initialize image source and error handler
  useEffect(() => {
    const primaryImageUrl = getPackageImageUrl(pkg);
    setImageSrc(primaryImageUrl);
    
    const errorHandler = createImageErrorHandler(pkg, () => {
      setImageLoaded(true); // Mark as loaded even if all images fail
    });
    setImageErrorHandler(() => errorHandler);
  }, [pkg.id, pkg.image_url, pkg.destination, pkg.title]);

  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!travelDate) {
      setError("Please select a travel date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await bookingService.createBooking({
        package_id: pkg.id,
        travel_date: travelDate,
      });

      setShowBookingForm(false);
      setTravelDate("");
      if (onBookingSuccess) onBookingSuccess();
      alert(
        "Booking created successfully! Check your bookings to make payment."
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm("Are you sure you want to deactivate this package?")) {
      try {
        await packageService.deactivatePackage(pkg.id);
        alert("Package deactivated successfully!");
        if (onPackageUpdate) onPackageUpdate();
      } catch (err) {
        alert(err.response?.data?.error || "Failed to deactivate package");
      }
    }
  };

  const handleEdit = () => {
    // Navigate to staff dashboard with edit mode
    window.location.href = `/staff?edit=${pkg.id}`;
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div 
      className={`card ${isHovered ? 'hovered' : ''} ${!pkg.is_active ? 'inactive' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Admin Controls */}
      {isStaffOrAdmin && (
        <div className="admin-controls">
          <button
            onClick={handleEdit}
            className="edit-btn"
            title="Edit Package"
          >
            Edit
          </button>
          {isAdmin && pkg.is_active && (
            <button
              onClick={handleDeactivate}
              className="deactivate-btn"
              title="Deactivate Package"
            >
              Deactivate
            </button>
          )}
          {!pkg.is_active && <span className="inactive-badge">Inactive</span>}
        </div>
      )}

      {/* Image Container with Loading Animation */}
      <div className="card-image-container">
        {!imageLoaded && (
          <div className="image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        <img
          src={imageSrc}
          alt={pkg.title}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={imageErrorHandler}
        />
        
        {/* Overlay with View Details */}
        <div className="card-overlay">
          <div className="view-details-overlay">
            <a href={`/package/${pkg.id}`} className="view-details-btn">
              View Details
            </a>
          </div>
        </div>
      </div>

      <div className="card-content">
        {/* Header Section */}
        <div className="card-header">
          <h3 className="package-title">{pkg.title}</h3>
          <div className="package-status">
            {pkg.available_slots === 0 ? (
              <span className="status-badge sold-out">Sold Out</span>
            ) : pkg.available_slots <= 5 ? (
              <span className="status-badge limited">Limited</span>
            ) : (
              <span className="status-badge available">Available</span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="package-details-grid">
          <div className="detail-row">
            <span className="detail-label">Destination</span>
            <span className="detail-value">{pkg.destination}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Duration</span>
            <span className="detail-value">{pkg.duration_days} days</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Hotel</span>
            <div className="hotel-info">
              <span className="detail-value">{pkg.hotel_name}</span>
              {pkg.hotel_rating && (
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < pkg.hotel_rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Flight</span>
            <span className="detail-value">{pkg.flight_summary}</span>
          </div>
        </div>

        {/* Description */}
        {pkg.description && (
          <div className="description-section">
            <p className="description">{pkg.description.substring(0, 100)}...</p>
          </div>
        )}

        {/* Location Link */}
        {pkg.location && (
          <div className="location-section">
            <a href={pkg.location} className="location-link" target="_blank" rel="noopener noreferrer">
              <img src="/src/assets/images/google-map.jpg" alt="Map" />
              <span>View on Map</span>
            </a>
          </div>
        )}

        {/* Availability Section */}
        <div className="availability-section">
          <div className="slots-info">
            <span className="slots-text">{pkg.available_slots} slots available</span>
          </div>
          
          {pkg.available_slots <= 5 && pkg.available_slots > 0 && (
            <div className="urgency-indicator">
              <span className="urgency-text">Only {pkg.available_slots} left!</span>
            </div>
          )}
        </div>

        {isAuthenticated && !isStaffOrAdmin ? (
          <div className="booking-section">
            {!showBookingForm ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className={`book-btn ${pkg.available_slots === 0 || !pkg.is_active ? 'disabled' : 'primary'}`}
                disabled={pkg.available_slots === 0 || !pkg.is_active}
              >
                <span className="btn-text">
                  {!pkg.is_active
                    ? "Inactive"
                    : pkg.available_slots === 0
                    ? "Sold Out"
                    : "Book Now"}
                </span>
              </button>
            ) : (
              <div className="booking-form-container">
                <form onSubmit={handleBookNow} className="booking-form">
                  <div className="form-group">
                    <label htmlFor="travel-date">Select Travel Date:</label>
                    <input
                      id="travel-date"
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={today}
                      required
                      className="date-input"
                    />
                  </div>
                  
                  <div className="form-buttons">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="confirm-btn"
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner"></span>
                          <span>Booking...</span>
                        </>
                      ) : (
                        <span>Confirm Booking</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false);
                        setError("");
                      }}
                      className="cancel-btn"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                  
                  {error && (
                    <div className="error-message">
                      <span>{error}</span>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        ) : !isAuthenticated ? (
          <div className="login-prompt">
            <span>
              <a href="/login" className="login-link">Login</a> to book this package
            </span>
          </div>
        ) : (
          <div className="staff-info">
            <span className="staff-text">Management View</span>
          </div>
        )}
      </div>
    </div>
  );
}
