import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packageService } from '../services/packages';
import { useAuth } from '../context/AuthContext';
import PackageCard from '../componets/packageCard';
import '../styles/packages.css';

export default function Packages() {
  const { isStaffOrAdmin } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [isStaffOrAdmin, showInactive]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      let data;
      if (isStaffOrAdmin && showInactive) {
        // Staff/Admin can see all packages including inactive ones
        data = await packageService.getAllPackages();
      } else {
        // Regular users and staff (when not viewing inactive) see only active packages
        data = await packageService.getActivePackages();
      }
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

  const handlePackageUpdate = () => {
    // Refresh packages after edit/deactivate
    fetchPackages();
  };

  // Filter and sort packages
  const filteredPackages = packages
    .filter(pkg => 
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.location && pkg.location.toLowerCase().includes(searchTerm.toLowerCase()))
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
        case 'status':
          return b.is_active - a.is_active;
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
          {isStaffOrAdmin && (
            <div className="admin-actions">
              <Link to="/staff" className="add-package-btn">
                ➕ Add New Package
              </Link>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by destination, title, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <div className="sort-box">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="title">Sort by Title</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
                <option value="rating">Hotel Rating</option>
                {isStaffOrAdmin && <option value="status">Status</option>}
              </select>
            </div>
            {isStaffOrAdmin && (
              <div className="status-filter">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                  />
                  Show Inactive Packages
                </label>
              </div>
            )}
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
              <div key={pkg.id} className="package-item">
                <Link to={`/package/${pkg.id}`} className="view-details-link">
                  View Details
                </Link>
                <PackageCard 
                  pkg={pkg} 
                  onBookingSuccess={handleBookingSuccess}
                  onPackageUpdate={handlePackageUpdate}
                />
              </div>
            ))}
          </div>
        )}

        {/* Package Count */}
        <div className="package-count">
          Showing {filteredPackages.length} of {packages.length} packages
          {isStaffOrAdmin && showInactive && (
            <span className="inactive-count">
              ({packages.filter(p => !p.is_active).length} inactive)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}