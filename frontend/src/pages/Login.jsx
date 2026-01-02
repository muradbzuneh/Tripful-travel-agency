import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/auth.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    const errors = { ...validationErrors };

    switch (name) {
      case "email":
        errors.email = validateEmail(value);
        break;
      case "password":
        errors.password = validatePassword(value);
        break;
    }

    setValidationErrors(errors);

    // Clear general error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Final validation
    const errors = {};
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);

    const hasErrors = Object.values(errors).some((error) => error);

    if (hasErrors) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await login(formData);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError("");

    const demoCredentials = {
      admin: { email: "admin@tripful.com", password: "admin123" },
      staff: { email: "staff@demo.com", password: "password123" },
      customer: { email: "customer@demo.com", password: "password123" },
    };

    try {
      await login(demoCredentials[role]);
      navigate("/");
    } catch (err) {
      setError("Demo login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${theme}`}>
      <div className="auth-container">
        <div className="auth-form">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your Tripful account to continue your journey</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-content">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className={validationErrors.email ? "error" : ""}
                autoComplete="email"
              />
              {validationErrors.email && (
                <div className="field-error">{validationErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className={validationErrors.password ? "error" : ""}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {validationErrors.password && (
                <div className="field-error">{validationErrors.password}</div>
              )}
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Create one here</Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <div className="image-overlay">
            <h3>Start Your Journey</h3>
            <p>Book amazing holidays with ease and discover the world</p>
            <div className="feature-list">
              <div className="feature-item">🌍 Global Destinations</div>
              <div className="feature-item">💰 Best Price Guarantee</div>
              <div className="feature-item">⭐ 5-Star Customer Service</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
