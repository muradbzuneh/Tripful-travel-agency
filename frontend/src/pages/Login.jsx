import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <h2>Login to Tripful</h2>
          <p>Welcome back! Please sign in to your account.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Sign up here</Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="demo-accounts">
            <h4>Demo Accounts:</h4>
            <p><strong>Customer:</strong> customer@demo.com / password123</p>
            <p><strong>Staff:</strong> staff@demo.com / password123</p>
          </div>
        </div>

        <div className="auth-image">
          <img src="/src/assets/sample-beach.jpg" alt="Travel destination" />
          <div className="image-overlay">
            <h3>Start Your Journey</h3>
            <p>Book amazing holidays with ease</p>
          </div>
        </div>
      </div>
    </div>
  );
}