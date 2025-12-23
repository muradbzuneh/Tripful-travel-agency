import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/services.css';

export default function Services() {
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Flight Booking",
      icon: "✈️",
      image: "/src/assets/services/Flight.jpg",
      description: "Book domestic and international flights with the best airlines",
      features: [
        "Compare prices from multiple airlines",
        "Flexible booking and cancellation",
        "24/7 customer support",
        "Instant confirmation",
        "Mobile boarding passes"
      ],
      link: "https://www.booking.com/flights/",
      linkText: "Book Flights on Booking.com",
      color: "#007bff"
    },
    {
      id: 2,
      title: "Hotel Reservations",
      icon: "🏨",
      image: "/src/assets/services/Hotel.jpg",
      description: "Find and book the perfect accommodation for your stay",
      features: [
        "Wide selection of hotels and resorts",
        "Best price guarantee",
        "Free cancellation on most bookings",
        "Guest reviews and ratings",
        "Instant booking confirmation"
      ],
      link: "https://www.booking.com/",
      linkText: "Book Hotels on Booking.com",
      color: "#28a745"
    },
    {
      id: 3,
      title: "Car Rental",
      icon: "🚗",
      image: "/src/assets/services/Carrental.jpg",
      description: "Rent a car for convenient and flexible travel",
      features: [
        "Wide range of vehicle types",
        "Competitive rental rates",
        "Pick-up and drop-off flexibility",
        "Insurance options available",
        "GPS navigation included"
      ],
      link: "https://www.uber.com/",
      linkText: "Book Rides with Uber",
      color: "#ffc107"
    }
  ];

  const packageBenefits = [
    {
      icon: "💰",
      title: "Cost Savings",
      description: "Save up to 30% when booking flights and hotels together"
    },
    {
      icon: "⏰",
      title: "Time Efficient",
      description: "One-stop booking for all your travel needs"
    },
    {
      icon: "🛡️",
      title: "Travel Protection",
      description: "Comprehensive travel insurance and support"
    },
    {
      icon: "📞",
      title: "24/7 Support",
      description: "Round-the-clock customer service and assistance"
    }
  ];

  const handleServiceClick = (service) => {
    setSelectedService(selectedService?.id === service.id ? null : service);
  };

  const handleExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="services-page">
      <div className="container">
        {/* Hero Section */}
        <div className="services-hero">
          <h1>🌟 Our Travel Services</h1>
          <p>Complete travel solutions for your perfect Ethiopian adventure</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Happy Travelers</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="services-section">
          <h2>🎯 Our Core Services</h2>
          <div className="services-grid">
            {services.map(service => (
              <div 
                key={service.id} 
                className={`service-card ${selectedService?.id === service.id ? 'active' : ''}`}
                onClick={() => handleServiceClick(service)}
                style={{ borderColor: service.color }}
              >
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                  <div className="service-overlay">
                    <span className="service-icon">{service.icon}</span>
                  </div>
                </div>
                <div className="service-content">
                  <h3 style={{ color: service.color }}>{service.title}</h3>
                  <p>{service.description}</p>
                  <button 
                    className="service-toggle"
                    style={{ backgroundColor: service.color }}
                  >
                    {selectedService?.id === service.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Service Details */}
        {selectedService && (
          <div className="service-details">
            <div className="details-header">
              <h2>{selectedService.icon} {selectedService.title}</h2>
              <p>{selectedService.description}</p>
            </div>
            
            <div className="details-content">
              <div className="features-section">
                <h3>✨ Features & Benefits</h3>
                <ul className="features-list">
                  {selectedService.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✅</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="booking-section">
                <h3>📱 Book Now</h3>
                <p>Ready to book? Click below to access our trusted partner platform:</p>
                <button 
                  className="external-booking-btn"
                  onClick={() => handleExternalLink(selectedService.link)}
                  style={{ backgroundColor: selectedService.color }}
                >
                  {selectedService.linkText} 🔗
                </button>
                <small>* You will be redirected to our partner's secure booking platform</small>
              </div>
            </div>
          </div>
        )}

        {/* Package Benefits */}
        <div className="benefits-section">
          <h2>🎁 Why Choose Our Complete Packages?</h2>
          <div className="benefits-grid">
            {packageBenefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Booking Flow */}
        <div className="booking-flow">
          <h2>🚀 How It Works</h2>
          <div className="flow-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Choose Your Service</h3>
                <p>Select from flights, hotels, or car rentals</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Compare Options</h3>
                <p>Browse and compare prices and features</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Secure Booking</h3>
                <p>Book safely through our trusted partners</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Enjoy Your Trip</h3>
                <p>Travel with confidence and support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="actions-grid">
            <button 
              className="action-btn flight-btn"
              onClick={() => handleExternalLink('https://www.booking.com/flights/')}
            >
              <span className="action-icon">✈️</span>
              <span>Book Flight</span>
            </button>
            <button 
              className="action-btn hotel-btn"
              onClick={() => handleExternalLink('https://www.booking.com/')}
            >
              <span className="action-icon">🏨</span>
              <span>Book Hotel</span>
            </button>
            <button 
              className="action-btn car-btn"
              onClick={() => handleExternalLink('https://www.uber.com/')}
            >
              <span className="action-icon">🚗</span>
              <span>Book Ride</span>
            </button>
            {isAuthenticated && (
              <button 
                className="action-btn package-btn"
                onClick={() => window.location.href = '/packages'}
              >
                <span className="action-icon">📦</span>
                <span>View Packages</span>
              </button>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="support-section">
          <h2>💬 Need Help?</h2>
          <p>Our travel experts are here to assist you 24/7</p>
          <div className="support-options">
            <div className="support-option">
              <span className="support-icon">📞</span>
              <div>
                <h4>Call Us</h4>
                <p>+251-11-123-4567</p>
              </div>
            </div>
            <div className="support-option">
              <span className="support-icon">✉️</span>
              <div>
                <h4>Email Us</h4>
                <p>support@tripful.com</p>
              </div>
            </div>
            <div className="support-option">
              <span className="support-icon">💬</span>
              <div>
                <h4>Live Chat</h4>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}