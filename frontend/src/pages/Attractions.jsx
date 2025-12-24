import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attraction } from '../assets/Attraction.js';
import { packageService } from '../services/packages';
import '../styles/attractions.css';

export default function Attractions() {
  const [attractions, setAttractions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default 3 attractions to display initially
  const defaultAttractions = [
    {
      id: 16,
      img: "/src/assets/packages/Lalibela.jpg",
      place: "Lalibela",
      Historicalplace: "The Rock-Hewn Churches of Lalibela, carved from solid rock in the 12th century, are among the greatest religious monuments in the world.",
      History: "Lalibela was established as a New Jerusalem by King Lalibela and remains a major pilgrimage site of the Ethiopian Orthodox Church."
    },
    {
      id: 17,
      img: "/src/assets/packages/Axsum.jpg",
      place: "Axum",
      Historicalplace: "The Axum Obelisks, royal tombs, and ruins of ancient palaces represent one of Africa's greatest civilizations.",
      History: "Axum was the capital of the Axumite Empire and an important center of early Christianity in Ethiopia."
    },
    {
      id: 18,
      img: "/src/assets/packages/addisabeba.jpg",
      place: "Addis Ababa",
      Historicalplace: "The National Museum, Holy Trinity Cathedral, and Entoto Mountains are major historical landmarks.",
      History: "Founded by Emperor Menelik II, Addis Ababa became the political and diplomatic center of Ethiopia and Africa."
    }
  ];

  useEffect(() => {
    // Show default attractions initially
    setAttractions(defaultAttractions);
    
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setAttractions(defaultAttractions);
      setSelectedAttraction(null);
      return;
    }

    setLoading(true);
    
    // Filter attractions based on search term
    const filteredAttractions = attraction.filter(attr =>
      attr.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.Historicalplace.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.History.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setAttractions(filteredAttractions);

    // If specific place found, also search for related packages
    if (filteredAttractions.length > 0) {
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

  const handleAttractionClick = async (attraction) => {
    setSelectedAttraction(attraction);
    
    // Search for related packages
    try {
      const packages = await packageService.getActivePackages();
      const related = packages.filter(pkg =>
        pkg.destination.toLowerCase().includes(attraction.place.toLowerCase()) ||
        pkg.title.toLowerCase().includes(attraction.place.toLowerCase()) ||
        (pkg.location && pkg.location.toLowerCase().includes(attraction.place.toLowerCase()))
      );
      setRelatedPackages(related);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };

  const getAttractionImage = (attraction) => {
    // Map attraction places to available images
    const imageMap = {
      'Lalibela': '/src/assets/desandatt/lalibela.jpg',
      'Axum': '/src/assets/desandatt/Axum.jpg',
      'Addis Ababa': '/src/assets/desandatt/Addis abeba.jpg',
      'Bahir Dar': '/src/assets/desandatt/Bahrdar.jpg',
      'Gondar': '/src/assets/desandatt/Gonder.jpg',
      'Harar': '/src/assets/desandatt/harar.jpg',
      'Dire Dawa': '/src/assets/desandatt/Dire dawa.jpg',
      'Hawassa': '/src/assets/desandatt/hawasa.jpg',
      'Mekelle': '/src/assets/desandatt/Mekelle.jpg',
      'Afar': '/src/assets/desandatt/Afar.jpg',
      'Konso':'/src/assets/desandatt/Konso.jpg',
      'jigjiga':'/src/assets/desandatt/jigjiga.jpg',
      'asosa':'/src/assets/desandatt/Asosa.jpg',
      'wolaita sodo':'/src/assets/desandatt/jimma.jpg',
      'Gambela':'/src/assets/desandatt/Gambela.jpg',
      'Arba Mnchi':'/src/assets/desandatt/Arba mnchi.jpg',
      'Jimma':'/src/assets/desandatt/jimma.jpg',
      'Adama':'/src/assets/desandatt/jimma.jpg'

    };

    return imageMap[attraction.place] || '/src/assets/images/ethiopia.jpg';
  };

  return (
    <div className="attractions-page">
      <div className="container">
        <div className="page-header">
          <h1>🏛️ Ethiopian Attractions</h1>
          <p>Discover the rich history and cultural heritage of Ethiopia's most fascinating destinations</p>
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
                    setAttractions(defaultAttractions);
                    setSelectedAttraction(null);
                    setRelatedPackages([]);
                  }
                }}
              >
                <option value="">Select an Attraction</option>
                {attraction.map(attr => (
                  <option key={attr.id} value={attr.place}>
                    {attr.place}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Or search attractions by place, history, or landmarks..."
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

        {/* Attractions Grid */}
        <div className="attractions-grid">
          {attractions.map(attr => (
            <div 
              key={attr.id} 
              className="attraction-card"
              onClick={() => handleAttractionClick(attr)}
            >
              <div className="attraction-image">
                <img 
                  src={getAttractionImage(attr)} 
                  alt={attr.place}
                  onError={(e) => {
                    e.target.src = '/src/assets/images/ethiopia.jpg';
                  }}
                />
                <div className="attraction-overlay">
                  <h3>{attr.place}</h3>
                </div>
              </div>
              <div className="attraction-content">
                <h4>🏛️ Historical Places</h4>
                <p>{attr.Historicalplace}</p>
                <h4>📜 History</h4>
                <p>{attr.History}</p>
                <button className="explore-btn">
                  Explore {attr.place}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Attraction Details */}
        {selectedAttraction && (
          <div className="selected-attraction">
            <div className="attraction-details">
              <h2>🌟 {selectedAttraction.place}</h2>
              <div className="attraction-info">
                <div className="attraction-image-large">
                  <img 
                    src={getAttractionImage(selectedAttraction)} 
                    alt={selectedAttraction.place}
                  />
                </div>
                <div className="attraction-text">
                  <div className="info-section">
                    <h3>🏛️ Historical Places</h3>
                    <p>{selectedAttraction.Historicalplace}</p>
                  </div>
                  <div className="info-section">
                    <h3>📜 Historical Background</h3>
                    <p>{selectedAttraction.History}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <div className="related-packages">
                <h3>🎯 Related Travel Packages</h3>
                <p>We found {relatedPackages.length} package(s) that include {selectedAttraction.place}!</p>
                <div className="packages-suggestions">
                  {relatedPackages.map(pkg => (
                    <div key={pkg.id} className="package-suggestion">
                      <h4>{pkg.title}</h4>
                      <p>📍 {pkg.destination}</p>
                      <p>💰 ${pkg.price} for {pkg.duration_days} days</p>
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
        {attractions.length === 0 && searchTerm && (
          <div className="no-results">
            <h3>🔍 No attractions found</h3>
            <p>Try searching with different keywords or browse our default attractions above.</p>
            <button onClick={() => {
              setSearchTerm('');
              setAttractions(defaultAttractions);
            }}>
              Show Default Attractions
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="cta-section">
          <h2>Ready to Explore Ethiopia?</h2>
          <p>Check out our complete travel packages that include these amazing attractions!</p>
          <Link to="/packages" className="cta-button">
            Browse All Packages
          </Link>
        </div>
      </div>
    </div>
  );
}