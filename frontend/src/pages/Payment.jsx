import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTranslation } from '../utils/translations';
import { paymentService } from '../services/payment';
import '../styles/payment.css';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useTheme();
  
  // Get booking data from navigation state
  const bookingData = location.state?.bookingData;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    firstName: user?.full_name?.split(' ')[0] || '',
    lastName: user?.full_name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    amount: bookingData?.amount || 0
  });

  useEffect(() => {
    // Redirect if no booking data
    if (!bookingData) {
      navigate('/packages');
      return;
    }
  }, [bookingData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!paymentForm.firstName || !paymentForm.lastName || !paymentForm.email) {
        throw new Error('Please fill in all required fields');
      }

      // Initialize payment with Chapa
      const paymentResponse = await paymentService.initializePayment({
        amount: paymentForm.amount,
        firstName: paymentForm.firstName,
        lastName: paymentForm.lastName,
        email: paymentForm.email,
        bookingId: bookingData.bookingId
      });

      // Redirect to Chapa checkout
      if (paymentResponse.checkout_url) {
        window.location.href = paymentResponse.checkout_url;
      } else {
        throw new Error('Failed to initialize payment');
      }

    } catch (err) {
      setError(err.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="error-message">
            <h2>No booking data found</h2>
            <button onClick={() => navigate('/packages')} className="btn-primary">
              Browse Packages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-container">
          {/* Payment Header */}
          <div className="payment-header">
            <div className="payment-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12C22 15.771 22 17.657 20.828 18.828C19.657 20 17.771 20 14 20H10C6.229 20 4.343 20 3.172 18.828C2 17.657 2 15.771 2 12Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 16H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 16H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 10L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1>Secure Payment</h1>
            <p>Complete your booking payment securely with Chapa</p>
          </div>

          <div className="payment-content">
            {/* Booking Summary */}
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span className="label">Package:</span>
                <span className="value">{bookingData.packageTitle}</span>
              </div>
              <div className="summary-item">
                <span className="label">Destination:</span>
                <span className="value">{bookingData.destination}</span>
              </div>
              <div className="summary-item">
                <span className="label">Travel Date:</span>
                <span className="value">{new Date(bookingData.travelDate).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Duration:</span>
                <span className="value">{bookingData.duration} days</span>
              </div>
              <div className="summary-total">
                <span className="label">Total Amount:</span>
                <span className="value">{paymentForm.amount} ETB</span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="payment-form-container">
              <h3>Payment Information</h3>
              <form onSubmit={handlePayment} className="payment-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={paymentForm.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={paymentForm.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={paymentForm.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={paymentForm.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                {error && (
                  <div className="error-alert">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="payment-actions">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn-pay"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="pay-icon">🔒</span>
                        Pay {paymentForm.amount} ETB
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="security-icon">🔐</div>
            <div className="security-text">
              <h4>Secure Payment</h4>
              <p>Your payment is processed securely through Chapa. We never store your payment information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}