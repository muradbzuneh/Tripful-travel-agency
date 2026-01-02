import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getTranslation } from "../utils/translations";
import { container } from "../assets/aboutContainer.js";
import { packageService } from "../services/packages";
import PackageCard from "../componets/packageCard";
import ReviewSection from "../componets/ReviewSection";
import "../styles/home.css";
import "../styles/navbar.css";

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useTheme();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "about") {
      const section = document.getElementById("about");
      section?.scrollIntoView({ behavior: "smooth" });
    } else if (location.state?.scrollTo === "Events") {
      const section = document.getElementById("Events");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const packages = await packageService.getActivePackages();
        setFeaturedPackages(packages.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPackages();
  }, []);

  const refetchFeaturedPackages = async () => {
    try {
      const packages = await packageService.getActivePackages();
      setFeaturedPackages(packages.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero animate-fadeIn">
        <div className="hero-content">
          <h1 className="animate-slideInLeft">
            {getTranslation("welcomeTitle", language)}
          </h1>
          <p className="animate-slideInLeft animate-stagger-1">
            {getTranslation("welcomeSubtitle", language)}
          </p>
          <p className="hero-subtitle animate-slideInLeft animate-stagger-2">
            {getTranslation("heroSubtitle", language)}
          </p>
          <Link
            to="/packages"
            className="cta-button animate-scaleIn animate-stagger-3 hover-lift transition-smooth"
          >
            {getTranslation("explorePackages", language)}
          </Link>
        </div>
        <div className="hero-image"></div>
      </section>

      {/* Features Section */}
      <section className="features animate-fadeIn" id="about">
        <div className="container">
          <h2 className="animate-slideInLeft">
            {getTranslation("whyChoose", language)}
          </h2>
          <div className="features-grid">
            {container.map((con, key) => (
              <div
                key={key}
                className="feature animate-scaleIn hover-lift transition-smooth"
                style={{ animationDelay: `${key * 0.1}s` }}
              >
                <div className="feature-icon">
                  <img src={con.img} alt="" className="feature-icon-image" />
                </div>
                <h3>{con.title}</h3>
                <p>{con.paragrap}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="featured-packages animate-fadeIn" id="Events">
        <div className="container">
          <h2 className="animate-slideInRight">
            {getTranslation("featuredPackages", language)}
          </h2>
          {loading ? (
            <div className="loading animate-pulse">Loading packages...</div>
          ) : (
            <div className="packages-grid">
              {featuredPackages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="animate-scaleIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PackageCard
                    pkg={pkg}
                    onPackageUpdate={refetchFeaturedPackages}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="view-all animate-fadeIn">
            <Link
              to="/packages"
              className="view-all-btn hover-lift transition-smooth"
            >
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works animate-fadeIn" id="contact">
        <div className="container">
          <h2 className="animate-slideInLeft">
            {getTranslation("howItWorks", language)}
          </h2>
          <div className="steps">
            <div className="step animate-scaleIn hover-lift transition-smooth">
              <div className="step-number animate-bounce">1</div>
              <h3>{getTranslation("step1Title", language)}</h3>
              <p>{getTranslation("step1Desc", language)}</p>
            </div>
            <div className="step animate-scaleIn animate-stagger-1 hover-lift transition-smooth">
              <div className="step-number animate-bounce animate-stagger-1">
                2
              </div>
              <h3>{getTranslation("step2Title", language)}</h3>
              <p>{getTranslation("step2Desc", language)}</p>
            </div>
            <div className="step animate-scaleIn animate-stagger-2 hover-lift transition-smooth">
              <div className="step-number animate-bounce animate-stagger-2">
                3
              </div>
              <h3>{getTranslation("step3Title", language)}</h3>
              <p>{getTranslation("step3Desc", language)}</p>
            </div>
            <div className="step animate-scaleIn animate-stagger-3 hover-lift transition-smooth">
              <div className="step-number animate-bounce animate-stagger-3">
                4
              </div>
              <h3>{getTranslation("step4Title", language)}</h3>
              <p>{getTranslation("step4Desc", language)}</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h3>{getTranslation("step5Title", language)}</h3>
              <p>{getTranslation("step5Desc", language)}</p>
            </div>

            <div className="step">
              <div className="step-number">6</div>
              <h3>{getTranslation("step6Title", language)}</h3>
              <p>{getTranslation("step6Desc", language)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSection />
    </div>
  );
}
