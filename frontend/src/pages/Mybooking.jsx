import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'green';
      case 'PENDING': return 'orange';
      case 'CANCELLED': return 'red';
      case 'SUCCESS': return 'green';
      case 'UNPAID': return 'red';
      default: return 'gray';
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
          <h1>My Bookings</h1>
          <p>Manage your travel bookings and payments</p>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h3>No bookings yet</h3>
            <p>Start planning your next adventure!</p>
            <Link to="/packages" className="cta-button">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => {
              const remainingAmount = booking.total_price - booking.paid_amount;
              const isFullyPaid = remainingAmount <= 0;

              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    {/* <h3>Booking #{booking.id.slice(0, 8)}</h3> */}
                    <div className="booking-statuses">
                      <span 
                        className="status"
                        style={{ color: getStatusColor(booking.booking_status) }}
                      >
                        {booking.booking_status}
                      </span>
                      <span 
                        className="status"
                        style={{ color: getStatusColor(booking.payment_status) }}
                      >
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span>Package ID:</span>
                      <span>{booking.package_id}</span>
                    </div>
                    <div className="detail-row">
                      <span>Travel Date:</span>
                      <span>{formatDate(booking.travel_date)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Total Price:</span>
                      <span>${booking.total_price}</span>
                    </div>
                    <div className="detail-row">
                      <span>Paid Amount:</span>
                      <span>${booking.paid_amount}</span>
                    </div>
                    <div className="detail-row">
                      <span>Remaining:</span>
                      <span className={isFullyPaid ? 'paid' : 'unpaid'}>
                        ${remainingAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Booked On:</span>
                      <span>{formatDate(booking.booked_at)}</span>
                    </div>
                  </div>

                  {!isFullyPaid && (
                    <div className="booking-actions">
                      <button 
                        onClick={() => setPaymentModal(booking)}
                        className="pay-button"
                      >
                        Make Payment
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Modal */}
        {paymentModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Make Payment</h3>
                <button 
                  onClick={() => setPaymentModal(null)}
                  className="close-button"
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="payment-info">
                  <p><strong>Booking:</strong> #{String(paymentModal.id).slice(0, 8)}</p>
                  <p><strong>Total Amount:</strong> ${paymentModal.total_price}</p>
                  <p><strong>Already Paid:</strong> ${paymentModal.paid_amount}</p>
                  <p><strong>Remaining:</strong> ${(paymentModal.total_price - paymentModal.paid_amount).toFixed(2)}</p>
                </div>

                <form onSubmit={handlePayment}>
                  <div className="form-group">
                    <label htmlFor="amount">Payment Amount</label>
                    <input
                      type="number"
                      id="amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="0.01"
                      max={paymentModal.total_price - paymentModal.paid_amount}
                      step="0.01"
                      required
                      placeholder="Enter amount to pay"
                    />
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
                    />
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="submit" 
                      disabled={paymentLoading}
                      className="pay-button"
                    >
                      {paymentLoading ? 'Processing...' : 'Process Payment'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentModal(null)}
                      className="cancel-button"
                    >
                      Cancel
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