import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getTranslation } from '../utils/translations';
import '../styles/payment-result.css';

export default function PaymentFailed() {
  const navigate = useNavigate();
  const { language } = useTheme();
  const [searchParams] = useSearchParams();

  const tx_ref = searchParams.get('tx_ref');
  const error = searchParams.get('error') || 'Payment was not completed';

  return (
    <div className="payment-result-page failed">
      <div className="container">
        <div className="result-container">
          <div className="result-animation">
            <div className="failed-cross">
              <div className="cross-icon">
                <span className="icon-line line-left"></span>
                <span className="icon-line line-right"></span>
                <div className="icon-circle"></div>
              </div>
            </div>
          </div>

          <div className="result-content">
            <h1 className="result-title">Payment Failed 😞</h1>
            <p className="result-message">
              Unfortunately, your payment could not be processed. Please try again or contact support.
            </p>

            <div className="error-info">
              <h3>What happened?</h3>
              <div className="error-item">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
              {tx_ref && (
                <div className="transaction-item">
                  <span className="label">Transaction Reference:</span>
                  <span className="value">{tx_ref}</span>
                </div>
              )}
            </div>

            <div className="result-actions">
              <button
                onClick={() => navigate(-1)}
                className="btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="btn-secondary"
              >
                View My Bookings
              </button>
            </div>
          </div>

          <div className="help-section">
            <h3>Need Help?</h3>
            <div className="help-options">
              <div className="help-item">
                <span className="help-icon">💳</span>
                <div className="help-text">
                  <h4>Payment Issues</h4>
                  <p>Check your card details, balance, or try a different payment method</p>
                </div>
              </div>
              <div className="help-item">
                <span className="help-icon">📞</span>
                <div className="help-text">
                  <h4>Contact Support</h4>
                  <p>Our support team is available 24/7 to help you with payment issues</p>
                </div>
              </div>
              <div className="help-item">
                <span className="help-icon">🔄</span>
                <div className="help-text">
                  <h4>Try Different Method</h4>
                  <p>You can try using a different card or payment method</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}