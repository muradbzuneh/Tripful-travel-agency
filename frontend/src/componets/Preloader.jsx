import { useState, useEffect } from 'react';
import '../styles/preloader.css';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div className="preloader-overlay">
      <div className="preloader-container">
        {/* Travel-themed animated elements */}
        <div className="travel-animation">
          <div className="plane">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">☁️</div>
          <div className="cloud cloud-3">☁️</div>
        </div>

        {/* Logo and branding */}
        <div className="preloader-brand">
          <h1 className="brand-name">Tripful</h1>
          <p className="brand-tagline">Your Journey Begins Here</p>

           <h5 className="brand-name">Build by Group 1 students</h5>
           <li>Murad</li>
           <li>Mena</li>
           <li>Mahlet</li>
           <li>Kidan</li>
           <li>Hubeyb</li>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        {/* Loading messages */}
        <div className="loading-messages">
          <div className="loading-message">
            {progress < 30 && "🌍 Exploring destinations..."}
            {progress >= 30 && progress < 60 && "✈️ Preparing your journey..."}
            {progress >= 60 && progress < 90 && "🏨 Finding best deals..."}
            {progress >= 90 && "🎉 Almost ready!"}
          </div>
        </div>

        {/* Floating travel icons */}
        <div className="floating-icons">
          <div className="icon icon-1">🏔️</div>
          <div className="icon icon-2">🏖️</div>
          <div className="icon icon-3">🏛️</div>
          <div className="icon icon-4">🌅</div>
          <div className="icon icon-5">🗺️</div>
          <div className="icon icon-6">📸</div>
        </div>
      </div>
    </div>
  );
}