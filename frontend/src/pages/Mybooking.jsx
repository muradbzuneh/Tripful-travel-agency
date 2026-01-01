import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getTranslation } from '../utils/translations';
import { bookingService } from '../services/bookings';
import { paymentService } from '../services/payments';
import '../styles/bookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null);
  const { language } = useTheme();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelLoading(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      fetchBookings(); // Refresh bookings
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancelLoading(null);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || !paymentReference) {
      alert('Please fill in all payment details');
      return;
    }

    setPaymentLoading(true);
    try {
      await paymentService.createPayment({
        booking_id: paymentModal.id,
        amount: parseFloat(paymentAmount),
        reference: paymentReference
      });

      alert('Payment processed successfully!');
      setPaymentModal(null);
      setPaymentAmount('');
      setPaymentReference('');
      fetchBookings(); // Refresh bookings
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="bookings-page">
      <div className="container">
        <div className="page-header">
          <h1>{getTranslation('myBookings', language)}</h1>
          <p>{getTranslation('bookingManagement', language)}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📅</div>
            <h3>{getTranslation('noBookings', language)}</h3>
            <p>{getTranslation('startPlanning', language)}</p>
            <Link to="/packages" className="cta-button">
              {getTranslation('browsePackages', language)}
            </Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking, index) => {
              const remainingAmount = booking.total_price - booking.paid_amount;
              const isFullyPaid = remainingAmount <= 0;

              return (
                <div key={booking.id} className="booking-card animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="booking-header">
                    <div className="booking-id">
                      <span className="booking-icon">🎫</span>
                      <span className="booking-number">#{String(booking.id).slice(0, 8)}</span>
                    </div>
                    <div className="booking-statuses">
                      <span 
                        className={`status-badge ${booking.booking_status.toLowerCase()}`}
                      >
                        <span className="status-icon">
                          {booking.booking_status === 'CONFIRMED' ? '✅' : 
                           booking.booking_status === 'PENDING' ? '⏳' : 
                           booking.booking_status === 'CANCELLED' ? '❌' : '📋'}
                        </span>
                        {booking.booking_status}
                      </span>
                      <span 
                        className={`status-badge ${booking.payment_status.toLowerCase()}`}
                      >
                        <span className="status-icon">
                          {booking.payment_status === 'SUCCESS' ? '💳' : 
                           booking.payment_status === 'UNPAID' ? '💰' : '💸'}
                        </span>
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Package ID:</span>
                        <span className="detail-value">{booking.package_id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{getTranslation('travelDate', language)}:</span>
                        <span className="detail-value">{formatDate(booking.travel_date)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{getTranslation('totalPrice', language)}:</span>
                        <span className="detail-value price">${booking.total_price}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{getTranslation('paidAmount', language)}:</span>
                        <span className="detail-value paid">${booking.paid_amount}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{getTranslation('remaining', language)}:</span>
                        <span className={`detail-value ${isFullyPaid ? 'paid-full' : 'unpaid'}`}>
                          ${remainingAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{getTranslation('bookedOn', language)}:</span>
                        <span className="detail-value">{formatDate(booking.booked_at)}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Payment */}
                    <div className="payment-progress">
                      <div className="progress-header">
                        <span className="progress-label">Payment Progress</span>
                        <span className="progress-percentage">
                          {Math.round((booking.paid_amount / booking.total_price) * 100)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(booking.paid_amount / booking.total_price) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {!isFullyPaid && booking.booking_status !== 'CANCELLED' && (
                      <button 
                        onClick={() => setPaymentModal(booking)}
                        className="action-btn primary"
                      >
                        <span className="btn-icon">💳</span>
                        <span>{getTranslation('makePayment', language)}</span>
                      </button>
                    )}
                    {booking.booking_status !== 'CANCELLED' && (
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelLoading === booking.id}
                        className="action-btn danger"
                      >
                        <span className="btn-icon">
                          {cancelLoading === booking.id ? '⏳' : '🗑️'}
                        </span>
                        <span>
                          {cancelLoading === booking.id ? 'Cancelling...' : getTranslation('cancelBooking', language)}
                        </span>
                      </button>
                    )}
                    {isFullyPaid && (
                      <div className="paid-indicator">
                        <span className="paid-icon">✅</span>
                        <span className="paid-text">Fully Paid</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Payment Modal */}
        {paymentModal && (
          <div className="modal-overlay">
            <div className="modal animate-scaleIn">
              <div className="modal-header">
                <h3>
                  <span className="modal-icon">💳</span>
                  {getTranslation('makePayment', language)}
                </h3>
                <button 
                  onClick={() => setPaymentModal(null)}
                  className="close-button"
                >
                  ✕
                </button>
              </div>

              <div className="modal-content">
                <div className="payment-summary">
                  <div className="summary-item">
                    <span className="summary-label">Booking:</span>
                    <span className="summary-value">#{String(paymentModal.id).slice(0, 8)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{getTranslation('totalPrice', language)}:</span>
                    <span className="summary-value">${paymentModal.total_price}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Already Paid:</span>
                    <span className="summary-value">${paymentModal.paid_amount}</span>
                  </div>
                  <div className="summary-item highlight">
                    <span className="summary-label">{getTranslation('remaining', language)}:</span>
                    <span className="summary-value">${(paymentModal.total_price - paymentModal.paid_amount).toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handlePayment} className="payment-form">
                  <div className="form-group">
                    <label htmlFor="amount">Payment Amount</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">$</span>
                      <input
                        type="number"
                        id="amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min="0.01"
                        max={paymentModal.total_price - paymentModal.paid_amount}
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="amount-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reference">Payment Reference</label>
                    <input
                      type="text"
                      id="reference"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      required
                      placeholder="e.g., Credit Card, Bank Transfer, etc."
                      className="reference-input"
                    />
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="submit" 
                      disabled={paymentLoading}
                      className="action-btn primary large"
                    >
                      {paymentLoading ? (
                        <>
                          <span className="loading-spinner"></span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">💳</span>
                          <span>Process Payment</span>
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentModal(null)}
                      className="action-btn secondary large"
                    >
                      <span className="btn-icon">❌</span>
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}