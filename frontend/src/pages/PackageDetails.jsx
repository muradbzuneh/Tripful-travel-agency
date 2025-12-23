import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageService } from '../services/packages';
import { bookingService } from '../services/bookings';
import { useAuth } from '../context/AuthContext';
import '../styles/package-details.css';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const data = await packageService.getPackageById(id);
      setPkg(data);
    } catch (err) {
      setError('Package not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!travelDate) {
      alert('Please select a travel date');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingService.createBooking({
        package_id: pkg.id,
        travel_date: travelDate
      });
      
      alert('Booking created successfully! Check your bookings to make payment.');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const getRatingImage = (rating) => {
    return `/src/assets/rating/rating-0${rating}-.png`;
  };

  const getPackageImage = (pkg) => {
    if (pkg.image_url) {
      // If it's a backend uploaded image, prepend the backend URL
      if (pkg.image_url.startsWith('/uploads/')) {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${pkg.image_url}`;
      }
      return pkg.image_url;
    }
    return `/src/assets/packages/${pkg.destination}.jpg`;
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return <div className="loading">Loading package details...</div>;
  }

  if (error || !pkg) {
    return (
      <div className="error-page">
        <h2>{error || 'Package not found'}</h2>
        <button onClick={() => navigate('/packages')}>
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div className="package-details-page">
      <div className="container">
        <button onClick={() => navigate('/packages')} className="back-button">
          ← Back to Packages
        </button>

        <div className="package-details">
          <div className="package-image-section">
            <img 
              src={getPackageImage(pkg)} 
              alt={pkg.title}
              className="main-image"
              onError={(e) => {
                e.target.src = `/src/assets/packages/${pkg.destination}.jpg`;
              }}
            />
          </div>

          <div className="package-info-section">
            <div className="package-header">
              <h1>{pkg.title}</h1>
              <div className="price-badge">
                <span className="price">${pkg.price}</span>
                <span className="duration">for {pkg.duration_days} days</span>
              </div>
            </div>

            <div className="package-meta">
              <div className="meta-item">
                <span className="icon">📍</span>
                <div>
                  <strong>Destination:</strong>
                  <p>{pkg.destination}</p>
                </div>
              </div>

              {pkg.location && (
                <div className="meta-item">
                  <img src="/src/assets/images/location.png" className="meta-item-img" alt='🗺️' ></img>
                  <div>
                    <strong>View Location:</strong>
                    <a href="https://www.google.com/maps/place/Lalibela/@11.0642944,39.7356052,5879m/data=!3m1!1e3!4m6!3m5!1s0x16413eee814f2d03:0xf27414e782ae4b62!8m2!3d12.0308987!4d39.0476298!16zL20vMDJrczB3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" target='_blank'>Location</a>
                  </div>
                </div>
              )}

              <div className="meta-item">
                <span className="icon">🏨</span>
                <div>
                  <strong>Hotel:</strong>
                  <p>{pkg.hotel_name}</p>
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
                    ({pkg.hotel_rating} ⭐)
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <span className="icon">✈️</span>
                <div>
                  <strong>Flight:</strong>
                  <p>{pkg.flight_summary}</p>
                </div>
              </div>

              <div className="meta-item">
                <span className="icon">📅</span>
                <div>
                  <strong>Available Period:</strong>
                  <p>{new Date(pkg.start_date).toLocaleDateString()} - {new Date(pkg.end_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="meta-item">
                <span className="icon">👥</span>
                <div>
                  <strong>Available Slots:</strong>
                  <p>{pkg.available_slots} remaining</p>
                </div>
              </div>
            </div>

            {pkg.description && (
              <div className="package-description">
                <h3>About This Package</h3>
                <p>{pkg.description}</p>
              </div>
            )}

            {isAuthenticated ? (
              <div className="booking-section">
                <h3>Book This Package</h3>
                {pkg.available_slots > 0 ? (
                  <form onSubmit={handleBooking} className="booking-form">
                    <div className="form-group">
                      <label htmlFor="travelDate">Select Travel Date:</label>
                      <input
                        type="date"
                        id="travelDate"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        min={today}
                        max={pkg.end_date}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={bookingLoading}
                      className="book-button"
                    >
                      {bookingLoading ? 'Booking...' : `Book Now - $${pkg.price}`}
                    </button>
                  </form>
                ) : (
                  <div className="sold-out">
                    <p>Sorry, this package is currently sold out.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="login-section">
                <h3>Ready to Book?</h3>
                <p>Please log in to book this amazing package.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="login-button"
                >
                  Login to Book
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}