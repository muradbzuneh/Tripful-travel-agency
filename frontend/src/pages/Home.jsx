import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { container } from '../assets/aboutContainer.js';
import { packageService } from '../services/packages';
import PackageCard from '../componets/packageCard';
import '../styles/home.css';
import '../styles/navbar.css'

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const packages = await packageService.getActivePackages();
        // Show only first 3 packages as featured
        setFeaturedPackages(packages.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPackages();
  }, []);

  //   const [latestPackages, setLatestPackages] = useState([]);
  // const [showSuggestions, setShowSuggestions] = useState(false);

  // useEffect(() => {
  //   const fetchLatestPackages = async () => {
  //     try {
  //       const packages = await packageService.getLatestPackages();
  //       setLatestPackages(packages);
  //     } catch (error) {
  //       console.error('Failed to fetch latest packages:', error);
  //     }
  //   };

  //   fetchLatestPackages();
  // }, []);
  //  const getDaysLeft = (endDate) => {
  //   const today = new Date();
  //   const end = new Date(endDate);
  //   const diffTime = end - today;
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays > 0 ? diffDays : 0;
  // };
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Tripful</h1>
          <p>Discover amazing holiday packages with flights and hotels included</p>
          <p className="hero-subtitle">Book Now, Pay Later - Make your dream vacation a reality!</p>
          <Link to="/packages" className="cta-button">
            Explore Packages
          </Link>
        </div>
        <div className="hero-image">
          {/* <img src="/src/assets/images/mountain-home.jpg" alt="Beautiful destination" /> */}
           {/* Suggestions Banner
      {latestPackages.length > 0 && (
        <div className="suggestions-banner">
          <div className="container">
            <span className="banner-label">🔥 Latest Packages:</span>
            {latestPackages.map(pkg => {
              const daysLeft = getDaysLeft(pkg.end_date);
              return (
                <Link 
                  key={pkg.id} 
                  to={`/package/${pkg.id}`} 
                  className="suggestion-item"
                >
                  {pkg.title} - {daysLeft > 0 ? `${daysLeft} days left!` : 'Limited time!'}
                </Link>
              );
            })}
          </div>
        </div>
      )} */}

        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="About">
        <div className="container">
          <h2>Why Choose Tripful?</h2>
          <div className="features-grid">
            {container.map((con, key) =>(
                <div key={key} className="feature">
              <div className="feature-icon">
              <img src={con.img} alt=""  className='feature-icon-image'/></div>
              <h3>{con.title}</h3>
              <p>{con.paragrap}</p>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="featured-packages" id='Events'>
        <div className="container">
          <h2>Featured Holiday Packages</h2>
          {loading ? (
            <div className="loading">Loading packages...</div>
          ) : (
            <div className="packages-grid">
              {featuredPackages.map(pkg => (
                <PackageCard 
                  key={pkg.id} 
                  pkg={pkg} 
                  onPackageUpdate={() => fetchFeaturedPackages()}
                />
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/packages" className="view-all-btn">
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Packages</h3>
              <p>Explore our curated holiday packages</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book Your Trip</h3>
              <p>Select dates and confirm your booking</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Pay When Ready</h3>
              <p>Make payments at your convenience</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Enjoy Your Holiday</h3>
              <p>Travel with confidence and create memories</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}