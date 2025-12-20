import { useState, useEffect } from 'react';
import { packageService } from '../services/packages';
import { bookingService } from '../services/bookings';
import '../styles/staff.css';

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  
  const [packageForm, setPackageForm] = useState({
    title: '',
    destination: '',
    flight_summary: '',
    hotel_name: '',
    hotel_rating: 5,
    duration_days: 1,
    price: '',
    available_slots: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    if (activeTab === 'packages') {
      fetchPackages();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingPackage) {
        await packageService.updatePackage(editingPackage.id, packageForm);
        alert('Package updated successfully!');
      } else {
        await packageService.createPackage(packageForm);
        alert('Package created successfully!');
      }
      
      setShowPackageForm(false);
      setEditingPackage(null);
      resetPackageForm();
      fetchPackages();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      title: pkg.title,
      destination: pkg.destination,
      flight_summary: pkg.flight_summary,
      hotel_name: pkg.hotel_name,
      hotel_rating: pkg.hotel_rating,
      duration_days: pkg.duration_days,
      price: pkg.price,
      available_slots: pkg.available_slots,
      start_date: pkg.start_date?.split('T')[0] || '',
      end_date: pkg.end_date?.split('T')[0] || ''
    });
    setShowPackageForm(true);
  };

  const handleDeactivatePackage = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this package?')) {
      try {
        await packageService.deactivatePackage(id);
        alert('Package deactivated successfully!');
        fetchPackages();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to deactivate package');
      }
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, { booking_status: newStatus });
      alert('Booking status updated successfully!');
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update booking status');
    }
  };

  const resetPackageForm = () => {
    setPackageForm({
      title: '',
      destination: '',
      flight_summary: '',
      hotel_name: '',
      hotel_rating: 5,
      duration_days: 1,
      price: '',
      available_slots: '',
      start_date: '',
      end_date: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="staff-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Staff Dashboard</h1>
          <p>Manage packages and bookings</p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={activeTab === 'packages' ? 'active' : ''}
            onClick={() => setActiveTab('packages')}
          >
            Packages Management
          </button>
          <button 
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings Management
          </button>
        </div>

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Packages</h2>
              <button 
                onClick={() => setShowPackageForm(true)}
                className="add-button"
              >
                Add New Package
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading packages...</div>
            ) : (
              <div className="packages-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Available Slots</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map(pkg => (
                      <tr key={pkg.id}>
                        <td>{pkg.title}</td>
                        <td>{pkg.destination}</td>
                        <td>${pkg.price}</td>
                        <td>{pkg.duration_days} days</td>
                        <td>{pkg.available_slots}</td>
                        <td>
                          <span className={`status ${pkg.is_active ? 'active' : 'inactive'}`}>
                            {pkg.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => handleEditPackage(pkg)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                          {pkg.is_active && (
                            <button 
                              onClick={() => handleDeactivatePackage(pkg.id)}
                              className="deactivate-button"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>All Bookings</h2>
            </div>

            {loading ? (
              <div className="loading">Loading bookings...</div>
            ) : (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User ID</th>
                      <th>Package ID</th>
                      <th>Total Price</th>
                      <th>Paid Amount</th>
                      <th>Travel Date</th>
                      <th>Booking Status</th>
                      <th>Payment Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.id.slice(0, 8)}</td>
                        <td>{booking.user_id.slice(0, 8)}</td>
                        <td>{booking.package_id.slice(0, 8)}</td>
                        <td>${booking.total_price}</td>
                        <td>${booking.paid_amount}</td>
                        <td>{formatDate(booking.travel_date)}</td>
                        <td>
                          <span className={`status ${booking.booking_status.toLowerCase()}`}>
                            {booking.booking_status}
                          </span>
                        </td>
                        <td>
                          <span className={`status ${booking.payment_status.toLowerCase()}`}>
                            {booking.payment_status}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={booking.booking_status}
                            onChange={(e) => handleBookingStatusUpdate(booking.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Package Form Modal */}
        {showPackageForm && (
          <div className="modal-overlay">
            <div className="modal large">
              <div className="modal-header">
                <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
                <button 
                  onClick={() => {
                    setShowPackageForm(false);
                    setEditingPackage(null);
                    resetPackageForm();
                  }}
                  className="close-button"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handlePackageSubmit} className="package-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={packageForm.title}
                      onChange={(e) => setPackageForm({...packageForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Destination</label>
                    <input
                      type="text"
                      value={packageForm.destination}
                      onChange={(e) => setPackageForm({...packageForm, destination: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Flight Summary</label>
                  <textarea
                    value={packageForm.flight_summary}
                    onChange={(e) => setPackageForm({...packageForm, flight_summary: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Hotel Name</label>
                    <input
                      type="text"
                      value={packageForm.hotel_name}
                      onChange={(e) => setPackageForm({...packageForm, hotel_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hotel Rating</label>
                    <select
                      value={packageForm.hotel_rating}
                      onChange={(e) => setPackageForm({...packageForm, hotel_rating: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (Days)</label>
                    <input
                      type="number"
                      value={packageForm.duration_days}
                      onChange={(e) => setPackageForm({...packageForm, duration_days: parseInt(e.target.value)})}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Available Slots</label>
                    <input
                      type="number"
                      value={packageForm.available_slots}
                      onChange={(e) => setPackageForm({...packageForm, available_slots: parseInt(e.target.value)})}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={packageForm.start_date}
                      onChange={(e) => setPackageForm({...packageForm, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={packageForm.end_date}
                      onChange={(e) => setPackageForm({...packageForm, end_date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingPackage ? 'Update Package' : 'Create Package')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPackageForm(false);
                      setEditingPackage(null);
                      resetPackageForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}