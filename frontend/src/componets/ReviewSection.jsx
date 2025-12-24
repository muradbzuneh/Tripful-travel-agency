import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/review-section.css';

export default function ReviewSection() {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample user reviews/feedback
  const existingReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing experience! Tripful made our Ethiopian adventure unforgettable. The Lalibela tour was perfectly organized and our guide was incredibly knowledgeable.",
      date: "2 weeks ago",
      avatar: "👩‍💼"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      comment: "Great service and competitive prices. The booking process was smooth and customer support was very responsive. Highly recommend for Ethiopian travel!",
      date: "1 month ago",
      avatar: "👨‍💻"
    },
    {
      id: 3,
      name: "Emma Williams",
      rating: 5,
      comment: "Tripful exceeded our expectations! The Simien Mountains trek was breathtaking and the accommodations were excellent. Will definitely book again!",
      date: "3 weeks ago",
      avatar: "👩‍🎓"
    },
    {
      id: 4,
      name: "David Rodriguez",
      rating: 4,
      comment: "Professional service and authentic experiences. The cultural tours in Addis Ababa were fascinating. Minor delays but overall very satisfied with the trip.",
      date: "1 week ago",
      avatar: "👨‍🔬"
    }
  ];

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userRating || !userReview.trim()) {
      alert('Please provide both rating and review!');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Thank you for your review! It will be published after moderation.');
      setUserRating(0);
      setUserReview('');
      setIsSubmitting(false);
    }, 1500);
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starNumber = index + 1;
      const isActive = interactive 
        ? starNumber <= (hoveredStar || userRating)
        : starNumber <= rating;
      
      return (
        <span
          key={index}
          className={`star ${isActive ? 'active' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => handleStarClick(starNumber) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(starNumber) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        >
          ⭐
        </span>
      );
    });
  };

  const averageRating = existingReviews.reduce((sum, review) => sum + review.rating, 0) / existingReviews.length;

  return (
    <section className="review-section">
      <div className="container">
        <div className="review-header">
          <h2>🌟 What Our Travelers Say</h2>
          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-number">{averageRating.toFixed(1)}</span>
              <div className="rating-stars">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="rating-count">({existingReviews.length} reviews)</span>
            </div>
          </div>
        </div>

        <div className="reviews-container">
          {/* Existing Reviews */}
          <div className="existing-reviews">
            <h3>Recent Reviews</h3>
            <div className="reviews-grid">
              {existingReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header-card">
                    <div className="reviewer-info">
                      <span className="reviewer-avatar">{review.avatar}</span>
                      <div className="reviewer-details">
                        <h4>{review.name}</h4>
                        <span className="review-date">{review.date}</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Review Form */}
          <div className="submit-review">
            <h3>Share Your Experience</h3>
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="rating-input">
                  <label>Your Rating:</label>
                  <div className="stars-input">
                    {renderStars(userRating, true)}
                  </div>
                  <span className="rating-text">
                    {userRating === 0 && "Click to rate"}
                    {userRating === 1 && "Poor"}
                    {userRating === 2 && "Fair"}
                    {userRating === 3 && "Good"}
                    {userRating === 4 && "Very Good"}
                    {userRating === 5 && "Excellent"}
                  </span>
                </div>

                <div className="review-input">
                  <label htmlFor="review-text">Your Review:</label>
                  <textarea
                    id="review-text"
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Tell us about your experience with Tripful. What did you love most about your trip?"
                    rows="4"
                    maxLength="500"
                  />
                  <div className="character-count">
                    {userReview.length}/500 characters
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting || !userRating || !userReview.trim()}
                >
                  {isSubmitting ? '✈️ Submitting...' : '🚀 Submit Review'}
                </button>
              </form>
            ) : (
              <div className="auth-required">
                <div className="auth-message">
                  <h4>🔐 Login Required</h4>
                  <p>Please log in to share your travel experience and rate our services.</p>
                  <div className="auth-actions">
                    <Link to="/login" className="auth-btn login-btn">
                      Login
                    </Link>
                    <Link to="/register" className="auth-btn register-btn">
                      Create Account
                    </Link>
                  </div>
                  <div className="auth-benefits">
                    <h5>Why create an account?</h5>
                    <ul>
                      <li>✅ Share your travel experiences</li>
                      <li>✅ Rate and review our services</li>
                      <li>✅ Track your bookings</li>
                      <li>✅ Get personalized recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <span>Verified Reviews</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⭐</span>
            <span>4.5+ Rating</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">👥</span>
            <span>1000+ Happy Travelers</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🏆</span>
            <span>Award Winning Service</span>
          </div>
        </div>
      </div>
    </section>
  );
}