import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { container } from '../assets/aboutContainer.js';
import { packageService } from '../services/packages';
import PackageCard from '../componets/packageCard';
import ReviewSection from '../componets/ReviewSection';
import '../styles/home.css';
import '../styles/navbar.css'

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
    const location = useLocation();

     useEffect(() => {
    if (location.state?.scrollTo === "about") {
      const section = document.getElementById("about");
      section?.scrollIntoView({ behavior: "smooth" });
    }
    else if(location.state?.scrollTo === "Events") {
       const section = document.getElementById("Events");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

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

        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="about">
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
      <section className="featured-packages" id='Events' >
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
      <section className="how-it-works" id="contact">
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

      {/* Reviews Section */}
      <ReviewSection />
    </div>
  );
}