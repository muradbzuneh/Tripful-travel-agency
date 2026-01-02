import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import QRCodeGenerator from '../componets/QRCodeGenerator';
import { generateReceiptPDF, generateReceiptEmail } from '../componets/ReceiptGenerator';
import '../styles/payment-demo.css';

export default function PaymentDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentStep, setPaymentStep] = useState('selection'); // selection, processing, qr, receipt
  const [transactionId, setTransactionId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Get booking details from navigation state
  const bookingDetails = location.state?.bookingDetails || {
    packageTitle: 'Sample Holiday Package',
    amount: 2500,
    currency: 'ETB',
    bookingId: 'BK001234'
  };

  // Ethiopian Banks
  const ethiopianBanks = [
    { id: 'cbe', name: 'Commercial Bank of Ethiopia', logo: '🏦', color: '#1e40af' },
    { id: 'dashen', name: 'Dashen Bank', logo: '🏛️', color: '#dc2626' },
    { id: 'awash', name: 'Awash Bank', logo: '🏪', color: '#059669' },
    { id: 'boa', name: 'Bank of Abyssinia', logo: '🏢', color: '#7c3aed' },
    { id: 'nib', name: 'Nib International Bank', logo: '🏦', color: '#ea580c' },
    { id: 'coop', name: 'Cooperative Bank of Oromia', logo: '🏛️', color: '#0891b2' },
    { id: 'wegagen', name: 'Wegagen Bank', logo: '🏪', color: '#be185d' },
    { id: 'united', name: 'United Bank', logo: '🏢', color: '#4338ca' }
  ];

  useEffect(() => {
    // Generate transaction ID when component mounts
    const txId = `TX${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setTransactionId(txId);
  }, []);

  const generateQRCode = () => {
    // Simulate QR code generation
    const qrData = `telebirr://pay?amount=${bookingDetails.amount}&merchant=Tripful&ref=${transactionId}`;
    setQrCode(qrData);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === 'telebirr') {
      setSelectedBank('');
    }
  };

  const handleBankSelect = (bankId) => {
    setSelectedBank(bankId);
  };

  const processPayment = async () => {
    setLoading(true);
    setPaymentStep('processing');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (selectedMethod === 'telebirr') {
      generateQRCode();
      setPaymentStep('qr');
    } else {
      setPaymentStep('bank-transfer');
    }
    setLoading(false);
  };

  const confirmPayment = async () => {
    setLoading(true);
    
    // Simulate payment confirmation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentStep('receipt');
    setLoading(false);
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSelectedBankDetails = () => {
    return ethiopianBanks.find(bank => bank.id === selectedBank);
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      transactionId,
      dateTime: getCurrentDateTime(),
      packageTitle: bookingDetails.packageTitle,
      bookingId: bookingDetails.bookingId,
      paymentMethod: selectedMethod === 'telebirr' ? 'TeleBirr Mobile Wallet' : getSelectedBankDetails()?.name,
      amount: bookingDetails.amount,
      currency: bookingDetails.currency
    };
    generateReceiptPDF(receiptData);
  };

  const handleEmailReceipt = () => {
    const receiptData = {
      transactionId,
      dateTime: getCurrentDateTime(),
      packageTitle: bookingDetails.packageTitle,
      bookingId: bookingDetails.bookingId,
      paymentMethod: selectedMethod === 'telebirr' ? 'TeleBirr Mobile Wallet' : getSelectedBankDetails()?.name,
      amount: bookingDetails.amount,
      currency: bookingDetails.currency
    };
    generateReceiptEmail(receiptData);
  };

  return (
    <div className={`payment-demo ${theme}`}>
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <button 
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1>Payment Gateway</h1>
          <div className="security-badge">
            🔒 Secure Payment
          </div>
        </div>

        {/* Booking Summary */}
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-details">
            <div className="detail-row">
              <span>Package:</span>
              <span>{bookingDetails.packageTitle}</span>
            </div>
            <div className="detail-row">
              <span>Booking ID:</span>
              <span>{bookingDetails.bookingId}</span>
            </div>
            <div className="detail-row total">
              <span>Total Amount:</span>
              <span>{bookingDetails.amount} {bookingDetails.currency}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        {paymentStep === 'selection' && (
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            
            {/* TeleBirr Option */}
            <div 
              className={`payment-option ${selectedMethod === 'telebirr' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('telebirr')}
            >
              <div className="option-header">
                <div className="option-logo">📱</div>
                <div className="option-info">
                  <h4>TeleBirr</h4>
                  <p>Pay with TeleBirr mobile wallet</p>
                </div>
                <div className="option-radio">
                  {selectedMethod === 'telebirr' && <span>✓</span>}
                </div>
              </div>
            </div>

            {/* Bank Transfer Option */}
            <div 
              className={`payment-option ${selectedMethod === 'bank' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('bank')}
            >
              <div className="option-header">
                <div className="option-logo">🏦</div>
                <div className="option-info">
                  <h4>Bank Transfer</h4>
                  <p>Transfer from your bank account</p>
                </div>
                <div className="option-radio">
                  {selectedMethod === 'bank' && <span>✓</span>}
                </div>
              </div>

              {/* Bank Selection */}
              {selectedMethod === 'bank' && (
                <div className="bank-selection">
                  <h5>Select Your Bank</h5>
                  <div className="banks-grid">
                    {ethiopianBanks.map(bank => (
                      <div
                        key={bank.id}
                        className={`bank-option ${selectedBank === bank.id ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBankSelect(bank.id);
                        }}
                        style={{ borderColor: selectedBank === bank.id ? bank.color : '' }}
                      >
                        <div className="bank-logo" style={{ color: bank.color }}>
                          {bank.logo}
                        </div>
                        <span className="bank-name">{bank.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Proceed Button */}
            <button 
              className="proceed-btn"
              onClick={processPayment}
              disabled={selectedMethod === 'bank' && !selectedBank}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Processing Step */}
        {paymentStep === 'processing' && (
          <div className="processing-step">
            <div className="processing-animation">
              <div className="spinner"></div>
            </div>
            <h3>Processing Payment...</h3>
            <p>Please wait while we prepare your payment</p>
          </div>
        )}

        {/* TeleBirr QR Code Step */}
        {paymentStep === 'qr' && (
          <div className="qr-step">
            <div className="qr-header">
              <div className="telebirr-logo">📱 TeleBirr</div>
              <h3>Scan QR Code to Pay</h3>
            </div>
            
            <div className="qr-container">
              <div className="qr-code">
                <QRCodeGenerator 
                  data={qrCode} 
                  size={200}
                />
              </div>
              
              <div className="qr-instructions">
                <h4>How to pay:</h4>
                <ol>
                  <li>Open TeleBirr app on your phone</li>
                  <li>Tap "Scan QR" or "Pay"</li>
                  <li>Scan this QR code</li>
                  <li>Confirm payment of {bookingDetails.amount} ETB</li>
                </ol>
              </div>
            </div>

            <div className="payment-details">
              <div className="detail-item">
                <span>Amount:</span>
                <span>{bookingDetails.amount} ETB</span>
              </div>
              <div className="detail-item">
                <span>Transaction ID:</span>
                <span>{transactionId}</span>
              </div>
              <div className="detail-item">
                <span>Merchant:</span>
                <span>Tripful Travel Agency</span>
              </div>
            </div>

            <div className="qr-actions">
              <button className="confirm-btn" onClick={confirmPayment} disabled={loading}>
                {loading ? 'Confirming...' : 'I have paid'}
              </button>
              <button className="cancel-btn" onClick={() => setPaymentStep('selection')}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bank Transfer Step */}
        {paymentStep === 'bank-transfer' && (
          <div className="bank-transfer-step">
            <div className="bank-header">
              <div className="bank-logo-large" style={{ color: getSelectedBankDetails()?.color }}>
                {getSelectedBankDetails()?.logo}
              </div>
              <h3>{getSelectedBankDetails()?.name}</h3>
            </div>

            <div className="transfer-details">
              <h4>Transfer Details</h4>
              <div className="account-info">
                <div className="info-item">
                  <label>Account Name:</label>
                  <span>Tripful Travel Agency PLC</span>
                </div>
                <div className="info-item">
                  <label>Account Number:</label>
                  <span>1000123456789</span>
                </div>
                <div className="info-item">
                  <label>Amount:</label>
                  <span>{bookingDetails.amount} ETB</span>
                </div>
                <div className="info-item">
                  <label>Reference:</label>
                  <span>{transactionId}</span>
                </div>
              </div>
            </div>

            <div className="transfer-instructions">
              <h4>Instructions:</h4>
              <ol>
                <li>Log in to your {getSelectedBankDetails()?.name} mobile app or internet banking</li>
                <li>Select "Transfer" or "Send Money"</li>
                <li>Enter the account details above</li>
                <li>Use the reference number: <strong>{transactionId}</strong></li>
                <li>Complete the transfer</li>
              </ol>
            </div>

            <div className="bank-actions">
              <button className="confirm-btn" onClick={confirmPayment} disabled={loading}>
                {loading ? 'Confirming...' : 'I have transferred'}
              </button>
              <button className="cancel-btn" onClick={() => setPaymentStep('selection')}>
                Back
              </button>
            </div>
          </div>
        )}

        {/* Receipt Step */}
        {paymentStep === 'receipt' && (
          <div className="receipt-step">
            <div className="receipt-container">
              <div className="receipt-header">
                <div className="success-icon">✅</div>
                <h2>Payment Successful!</h2>
                <p>Your booking has been confirmed</p>
              </div>

              <div className="receipt-details">
                <div className="receipt-title">
                  <h3>Payment Receipt</h3>
                  <span className="receipt-number">#{transactionId}</span>
                </div>

                <div className="receipt-info">
                  <div className="info-row">
                    <span>Date & Time:</span>
                    <span>{getCurrentDateTime()}</span>
                  </div>
                  <div className="info-row">
                    <span>Payment Method:</span>
                    <span>
                      {selectedMethod === 'telebirr' ? 'TeleBirr' : getSelectedBankDetails()?.name}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>Package:</span>
                    <span>{bookingDetails.packageTitle}</span>
                  </div>
                  <div className="info-row">
                    <span>Booking ID:</span>
                    <span>{bookingDetails.bookingId}</span>
                  </div>
                  <div className="info-row total-row">
                    <span>Amount Paid:</span>
                    <span>{bookingDetails.amount} ETB</span>
                  </div>
                </div>

                <div className="receipt-status">
                  <div className="status-badge success">
                    ✓ Payment Confirmed
                  </div>
                </div>
              </div>

              <div className="receipt-actions">
                <button className="download-btn" onClick={handleDownloadReceipt}>
                  📄 Download Receipt
                </button>
                <button className="email-btn" onClick={handleEmailReceipt}>
                  📧 Email Receipt
                </button>
                <button 
                  className="continue-btn"
                  onClick={() => navigate('/mybookings')}
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}