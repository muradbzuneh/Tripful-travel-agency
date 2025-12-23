import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topCities } from '../assets/Destination.js';
import { packageService } from '../services/packages';
import '../styles/destinations.css';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default 3 destinations to display initially
  const defaultDestinations = [
    {
      id: 1,
      city: "Addis Ababa",
      About_city: "The capital city of Ethiopia and Africa's diplomatic hub, hosting the African Union.",
      Hotel_list: "Sheraton Addis, Hilton Addis Ababa, Radisson Blu, Skylight Hotel"
    },
    {
      id: 3,
      city: "Bahir Dar",
      About_city: "A lakeside city near Lake Tana, known for monasteries and the Blue Nile Falls.",
      Hotel_list: "Kuriftu Resort, Blue Nile Resort, Jacaranda Hotel"
    },
    {
      id: 5,
      city: "Lalibela",
      About_city: "A sacred pilgrimage town renowned for its rock-hewn churches.",
      Hotel_list: "Mountain View Hotel, Tukul Village, Roha Hotel"
    }
  ];

  useEffect(() => {
    // Show default destinations initially
    setDestinations(defaultDestinations);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setDestinations(defaultDestinations);
      setSelectedDestination(null);
      return;
    }

    setLoading(true);
    
    // Filter destinations based on search term
    const filteredDestinations = topCities.filter(dest =>
      dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.About_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.Hotel_list.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setDestinations(filteredDestinations);

    // If specific destination found, also search for related packages
    if (filteredDestinations.length > 0) {
      try {
        const packages = await packageService.getActivePackages();
        const related = packages.filter(pkg =>
          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pkg.location && pkg.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setRelatedPackages(related);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      }
    }

    setLoading(false);
  };

  const handleDestinationClick = async (destination) => {
    setSelectedDestination(destination);
    
    // Search for related packages
    try {
      const packages = await packageService.getActivePackages();
      const related = packages.filter(pkg =>
        pkg.destination.toLowerCase().includes(destination.city.toLowerCase()) ||
        pkg.title.toLowerCase().includes(destination.city.toLowerCase()) ||
        (pkg.location && pkg.location.toLowerCase().includes(destination.city.toLowerCase()))
      );
      setRelatedPackages(related);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };

  const getDestinationImage = (destination) => {
    // Map destination cities to available images
    const imageMap = {
      'Addis Ababa': '/src/assets/packages/addisabeba.jpg',
      'Bahir Dar': '/src/assets/packages/Bahrdar.jpg',
      'Lalibela': '/src/assets/packages/Lalibela.jpg',
      'Gondar': '/src/assets/packages/Gonder.jpg',
      'Axum': '/src/assets/packages/Axsum.jpg',
      'Harar': '/src/assets/packages/Harar.jpg',
      'Dire Dawa': '/src/assets/packages/diredawa.jpg',
      'Hawassa': '/src/assets/packages/hawasa.jpg',
      'Mekelle': '/src/assets/packages/mekele.jpg',
      'Jimma': '/src/assets/packages/gena.jpg'
    };

    return imageMap[destination.city] || '/src/assets/images/ethiopia.jpg';
  };

  const getBookingLink = (hotelName) => {
    // Generate Booking.com search URL
    const searchQuery = encodeURIComponent(`${hotelName} Ethiopia`);
    return `https://www.booking.com/searchresults.html?ss=${searchQuery}`;
  };

  return (
    <div className="destinations-page">
      <div className="container">
        <div className="page-header">
          <h1>🌍 Ethiopian Destinations</h1>
          <p>Explore Ethiopia's most beautiful cities and discover amazing places to stay</p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-controls">
            <div className="select-box">
              <select 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value) {
                    handleSearch();
                  } else {
                    setDestinations(defaultDestinations);
                    setSelectedDestination(null);
                    setRelatedPackages([]);
                  }
                }}
              >
                <option value="">Select a Destination</option>
                {topCities.map(dest => (
                  <option key={dest.id} value={dest.city}>
                    {dest.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Or search destinations by city, description, or hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? '🔍 Searching...' : '🔍 Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="destinations-grid">
          {destinations.map(dest => (
            <div 
              key={dest.id} 
              className="destination-card"
              onClick={() => handleDestinationClick(dest)}
            >
              <div className="destination-image">
                <img 
                  src={getDestinationImage(dest)} 
                  alt={dest.city}
                  onError={(e) => {
                    e.target.src = '/src/assets/images/ethiopia.jpg';
                  }}
                />
                <div className="destination-overlay">
                  <h3>{dest.city}</h3>
                </div>
              </div>
              <div className="destination-content">
                <h4>📍 About {dest.city}</h4>
                <p>{dest.About_city}</p>
                <h4>🏨 Popular Hotels</h4>
                <p>{dest.Hotel_list}</p>
                <button className="explore-btn">
                  Explore {dest.city}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Destination Details */}
        {selectedDestination && (
          <div className="selected-destination">
            <div className="destination-details">
              <h2>🌟 {selectedDestination.city}</h2>
              <div className="destination-info">
                <div className="destination-image-large">
                  <img 
                    src={getDestinationImage(selectedDestination)} 
                    alt={selectedDestination.city}
                  />
                </div>
                <div className="destination-text">
                  <div className="info-section">
                    <h3>📍 About the City</h3>
                    <p>{selectedDestination.About_city}</p>
                  </div>
                  <div className="info-section">
                    <h3>🏨 Recommended Hotels</h3>
                    <div className="hotels-list">
                      {selectedDestination.Hotel_list.split(', ').map((hotel, index) => (
                        <div key={index} className="hotel-item">
                          <span>{hotel}</span>
                          <a 
                            href={getBookingLink(hotel)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="booking-link"
                          >
                            Book on Booking.com
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <div className="related-packages">
                <h3>🎯 Related Travel Packages</h3>
                <p>We found {relatedPackages.length} package(s) for {selectedDestination.city}!</p>
                <div className="packages-suggestions">
                  {relatedPackages.map(pkg => (
                    <div key={pkg.id} className="package-suggestion">
                      <h4>{pkg.title}</h4>
                      <p>📍 {pkg.destination}</p>
                      <p>💰 ${pkg.price} for {pkg.duration_days} days</p>
                      <p>🏨 {pkg.hotel_name}</p>
                      <Link to={`/package/${pkg.id}`} className="view-package-btn">
                        View Package Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {destinations.length === 0 && searchTerm && (
          <div className="no-results">
            <h3>🔍 No destinations found</h3>
            <p>Try searching with different keywords or browse our default destinations above.</p>
            <button onClick={() => {
              setSearchTerm('');
              setDestinations(defaultDestinations);
            }}>
              Show Default Destinations
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="cta-section">
          <h2>Ready to Visit These Amazing Places?</h2>
          <p>Book complete travel packages that include flights, hotels, and guided tours!</p>
          <Link to="/packages" className="cta-button">
            Browse All Packages
          </Link>
        </div>
      </div>
    </div>
  );
}