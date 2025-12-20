import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookings';
import { paymentService } from '../services/payments';
import '../styles/booking-details.css';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      // Note: This would need a specific endpoint in the backend
      // For now, we'll get all bookings and filter
      const bookings = await bookingService.getMyBookings();
      const foundBooking = bookings.find(b => b.id === id);
      
      if (!foundBooking) {
        setError('Booking not found');
        return;
      }
      
      setBooking(foundBooking);
    } catch (err) {
      setError('Failed to load booking details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        <button onClick={() => navigate('/my-bookings')}>
          Back to My Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="error-page">
        <h2>Booking not found</h2>
        <button onClick={() => navigate('/my-bookings')}>
          Back to My Bookings
        </button>
      </div>
    );
  }

  const remainingAmount = booking.total_price - booking.paid_amount;
  const isFullyPaid = remainingAmount <= 0;

  return (
    <div className="booking-details-page">
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/my-bookings')} className="back-button">
            ← Back to My Bookings
          </button>
          <h1>Booking Details</h1>
        </div>

        <div className="booking-details-card">
          <div className="booking-header">
            <h2>Booking #{booking.id.slice(0, 8)}</h2>
            <div className="status-badges">
              <span className={`status ${booking.booking_status.toLowerCase()}`}>
                {booking.booking_status}
              </span>
              <span className={`status ${booking.payment_status.toLowerCase()}`}>
                {booking.payment_status}
              </span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-section">
              <h3>Trip Information</h3>
              <div className="detail-item">
                <label>Package ID:</label>
                <span>{booking.package_id}</span>
              </div>
              <div className="detail-item">
                <label>Travel Date:</label>
                <span>{new Date(booking.travel_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Booking Date:</label>
                <span>{new Date(booking.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Payment Information</h3>
              <div className="detail-item">
                <label>Total Price:</label>
                <span className="price">${booking.total_price}</span>
              </div>
              <div className="detail-item">
                <label>Amount Paid:</label>
                <span className="paid">${booking.paid_amount}</span>
              </div>
              <div className="detail-item">
                <label>Remaining Balance:</label>
                <span className={isFullyPaid ? 'paid' : 'unpaid'}>
                  ${remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {!isFullyPaid && (
            <div className="payment-section">
              <h3>Make a Payment</h3>
              <p>You can make partial or full payments for your booking.</p>
              <button 
                onClick={() => navigate('/my-bookings')}
                className="payment-button"
              >
                Go to Payments
              </button>
            </div>
          )}

          {isFullyPaid && (
            <div className="confirmation-section">
              <h3>✅ Booking Confirmed</h3>
              <p>Your booking is fully paid and confirmed. Have a great trip!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}