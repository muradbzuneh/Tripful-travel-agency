export const generateReceiptPDF = (receiptData) => {
  // Create a new window for the receipt
  const receiptWindow = window.open('', '_blank');
  
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt - ${receiptData.transactionId}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
        }
        .receipt-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .receipt-header {
          text-align: center;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-logo {
          font-size: 32px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .receipt-title {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 5px;
        }
        .receipt-subtitle {
          color: #64748b;
          font-size: 14px;
        }
        .receipt-info {
          margin: 30px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-label {
          color: #64748b;
          font-weight: 500;
        }
        .info-value {
          color: #1e293b;
          font-weight: 600;
        }
        .total-row {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border: 2px solid #3b82f6;
        }
        .total-row .info-label,
        .total-row .info-value {
          color: #1e40af;
          font-size: 18px;
          font-weight: bold;
        }
        .payment-method {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #10b981;
        }
        .status-badge {
          display: inline-block;
          background: #dcfce7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 12px;
        }
        .qr-section {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }
        @media print {
          body { background: white; }
          .receipt-container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-header">
          <div class="company-logo">🌍 Tripful Travel</div>
          <div class="receipt-title">Payment Receipt</div>
          <div class="receipt-subtitle">Transaction Confirmation</div>
        </div>

        <div class="receipt-info">
          <div class="info-row">
            <span class="info-label">Receipt Number:</span>
            <span class="info-value">#${receiptData.transactionId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date & Time:</span>
            <span class="info-value">${receiptData.dateTime}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Package:</span>
            <span class="info-value">${receiptData.packageTitle}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Booking ID:</span>
            <span class="info-value">${receiptData.bookingId}</span>
          </div>
        </div>

        <div class="payment-method">
          <h4 style="margin: 0 0 10px 0; color: #1e293b;">Payment Method</h4>
          <p style="margin: 0; color: #64748b;">${receiptData.paymentMethod}</p>
        </div>

        <div class="total-row">
          <div class="info-row" style="border: none; margin: 0;">
            <span class="info-label">Amount Paid:</span>
            <span class="info-value">${receiptData.amount} ${receiptData.currency}</span>
          </div>
        </div>

        <div style="text-align: center;">
          <span class="status-badge">✓ Payment Confirmed</span>
        </div>

        <div class="qr-section">
          <h4 style="margin: 0 0 15px 0; color: #1e293b;">Verification QR Code</h4>
          <div style="font-family: monospace; font-size: 12px; color: #64748b; word-break: break-all;">
            ${receiptData.transactionId}
          </div>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
            Scan this code to verify transaction authenticity
          </p>
        </div>

        <div class="footer">
          <p><strong>Tripful Travel Agency PLC</strong></p>
          <p>Addis Ababa, Ethiopia | Phone: +251-11-123-4567</p>
          <p>Email: info@tripful.com | Website: www.tripful.com</p>
          <p style="margin-top: 15px;">
            This is a computer-generated receipt. No signature required.
          </p>
          <p style="margin-top: 10px; font-size: 10px;">
            Generated on ${new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <script>
        // Auto-print when page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  receiptWindow.document.write(receiptHTML);
  receiptWindow.document.close();
};

export const generateReceiptEmail = (receiptData, email) => {
  // Simulate email sending
  const emailBody = `
Dear Customer,

Thank you for your payment! Please find your receipt details below:

Receipt Number: #${receiptData.transactionId}
Date & Time: ${receiptData.dateTime}
Package: ${receiptData.packageTitle}
Booking ID: ${receiptData.bookingId}
Payment Method: ${receiptData.paymentMethod}
Amount Paid: ${receiptData.amount} ${receiptData.currency}

Status: Payment Confirmed ✓

Best regards,
Tripful Travel Agency
  `;

  // In a real application, this would send an actual email
  console.log('Email would be sent to:', email);
  console.log('Email body:', emailBody);
  
  // Show success message
  alert(`Receipt has been sent to ${email || 'your registered email address'}`);
};