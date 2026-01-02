import { useEffect, useRef } from 'react';

export default function QRCodeGenerator({ data, size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      generateQRCode(data, size);
    }
  }, [data, size]);

  const generateQRCode = (text, size) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Simple QR code pattern simulation
    const moduleSize = size / 25; // 25x25 grid
    ctx.fillStyle = '#000000';
    
    // Generate a pseudo-random pattern based on the text
    const hash = simpleHash(text);
    
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Create finder patterns (corners)
        if (isFinderPattern(row, col)) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
        // Create data pattern based on hash
        else if ((hash + row * col) % 3 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Add timing patterns
    for (let i = 8; i < 17; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }
  };

  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const isFinderPattern = (row, col) => {
    // Top-left finder pattern
    if ((row < 7 && col < 7) && 
        ((row === 0 || row === 6) && col < 7) ||
        ((col === 0 || col === 6) && row < 7) ||
        (row >= 2 && row <= 4 && col >= 2 && col <= 4)) {
      return true;
    }
    
    // Top-right finder pattern
    if ((row < 7 && col >= 18) && 
        ((row === 0 || row === 6) && col >= 18) ||
        ((col === 18 || col === 24) && row < 7) ||
        (row >= 2 && row <= 4 && col >= 20 && col <= 22)) {
      return true;
    }
    
    // Bottom-left finder pattern
    if ((row >= 18 && col < 7) && 
        ((row === 18 || row === 24) && col < 7) ||
        ((col === 0 || col === 6) && row >= 18) ||
        (row >= 20 && row <= 22 && col >= 2 && col <= 4)) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="qr-code-generator">
      <canvas 
        ref={canvasRef}
        style={{
          border: '8px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  );
}