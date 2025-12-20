import { useState, useEffect } from 'react';
import { packageService } from '../services/packages';
import PackageCard from '../componets/packageCard';
import '../styles/packages.css';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getActivePackages();
      setPackages(data);
    } catch (err) {
      setError('Failed to load packages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    // Refresh packages to update available slots
    fetchPackages();
  };

  // Filter and sort packages
  const filteredPackages = packages
    .filter(pkg => 
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return a.duration_days - b.duration_days;
        case 'rating':
          return b.hotel_rating - a.hotel_rating;
        default:
          return a.title.localeCompare(b.title);
      }
    });

  if (loading) {
    return <div className="loading">Loading packages...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="packages-page">
      <div className="container">
        <div className="page-header">
          <h1>Holiday Packages</h1>
          <p>Discover amazing destinations with our curated travel packages</p>
        </div>

        {/* Search and Filter */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by destination or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sort-box">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="title">Sort by Title</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
              <option value="rating">Hotel Rating</option>
            </select>
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="no-packages">
            <p>No packages found matching your criteria.</p>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredPackages.map(pkg => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                onBookingSuccess={handleBookingSuccess}
              />
            ))}
          </div>
        )}

        {/* Package Count */}
        <div className="package-count">
          Showing {filteredPackages.length} of {packages.length} packages
        </div>
      </div>
    </div>
  );
}