import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getTranslation } from '../utils/translations';
import '../styles/payment-result.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { language } = useTheme();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const tx_ref = searchParams.get('tx_ref');

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/my-bookings');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="payment-result-page success">
      <div className="container">
        <div className="result-container">
          <div className="result-animation">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>

          <div className="result-content">
            <h1 className="result-title">Payment Successful! 🎉</h1>
            <p className="result-message">
              Your payment has been processed successfully. Your booking is now confirmed!
            </p>

            {tx_ref && (
              <div className="transaction-info">
                <h3>Transaction Details</h3>
                <div className="transaction-item">
                  <span className="label">Transaction Reference:</span>
                  <span className="value">{tx_ref}</span>
                </div>
                <div className="transaction-item">
                  <span className="label">Status:</span>
                  <span className="value success-status">✅ Confirmed</span>
                </div>
              </div>
            )}

            <div className="result-actions">
              <button
                onClick={() => navigate('/my-bookings')}
                className="btn-primary"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/packages')}
                className="btn-secondary"
              >
                Browse More Packages
              </button>
            </div>

            <div className="auto-redirect">
              <p>You will be automatically redirected to your bookings in {countdown} seconds</p>
              <div className="countdown-bar">
                <div 
                  className="countdown-progress" 
                  style={{ width: `${(countdown / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="success-features">
            <div className="feature-item">
              <span className="feature-icon">📧</span>
              <div className="feature-text">
                <h4>Email Confirmation</h4>
                <p>A confirmation email has been sent to your registered email address</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div className="feature-text">
                <h4>Booking Management</h4>
                <p>You can view and manage your booking in the "My Bookings" section</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎫</span>
              <div className="feature-text">
                <h4>Travel Documents</h4>
                <p>Your travel documents will be available 24 hours before departure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}