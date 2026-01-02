import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "CUSTOMER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Real-time validation functions
  const validateName = (name) => {
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const checkEmailAvailability = async (email) => {
    if (!email || validateEmail(email)) return;
    
    try {
      const result = await authService.checkEmailAvailability(email);
      const errors = { ...validationErrors };
      if (!result.available) {
        errors.email = "This email is already registered. Please use a different email or try logging in.";
      } else {
        errors.email = "";
      }
      setValidationErrors(errors);
    } catch (error) {
      console.error('Email check failed:', error);
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("One special character");
    return errors;
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
      case 'full_name':
        errors.full_name = validateName(value);
        break;
      case 'email':
        errors.email = validateEmail(value);
        if (!errors.email) {
          // Debounce email availability check
          clearTimeout(window.emailCheckTimeout);
          window.emailCheckTimeout = setTimeout(() => {
            checkEmailAvailability(value);
          }, 1000);
        }
        break;
      case 'phone':
        errors.phone = validatePhone(value);
        break;
      case 'password':
        errors.password = validatePassword(value);
        if (formData.confirmPassword) {
          errors.confirmPassword = value !== formData.confirmPassword ? "Passwords do not match" : "";
        }
        break;
      case 'confirmPassword':
        errors.confirmPassword = value !== formData.password ? "Passwords do not match" : "";
        break;
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Final validation
    const errors = {};
    errors.full_name = validateName(formData.full_name);
    errors.email = validateEmail(formData.email);
    errors.phone = validatePhone(formData.phone);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = formData.password !== formData.confirmPassword ? "Passwords do not match" : "";

    const hasErrors = Object.values(errors).some(error => error && (Array.isArray(error) ? error.length > 0 : true));
    
    if (hasErrors) {
      setValidationErrors(errors);
      setError("Please fix the validation errors below");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const errors = validatePassword(formData.password);
    if (formData.password.length === 0) return { strength: 0, label: "" };
    if (errors.length === 0) return { strength: 100, label: "Strong" };
    if (errors.length <= 2) return { strength: 75, label: "Good" };
    if (errors.length <= 3) return { strength: 50, label: "Fair" };
    return { strength: 25, label: "Weak" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className={`auth-page ${theme}`}>
      <div className="auth-container">
        <div className="auth-form">
          <div className="auth-header">
            <h2>Join Tripful</h2>
            <p>Create your account and start booking amazing holidays!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-content">
            <div className="form-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={validationErrors.full_name ? 'error' : ''}
              />
              {validationErrors.full_name && (
                <div className="field-error">{validationErrors.full_name}</div>
              )}
            </div>

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
                className={validationErrors.email ? 'error' : ''}
              />
              {validationErrors.email && (
                <div className="field-error">{validationErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className={validationErrors.phone ? 'error' : ''}
              />
              {validationErrors.phone && (
                <div className="field-error">{validationErrors.phone}</div>
              )}
              <small className="form-hint">Include country code (e.g., +1234567890)</small>
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
                  placeholder="Create a strong password"
                  className={Array.isArray(validationErrors.password) && validationErrors.password.length > 0 ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill strength-${passwordStrength.label.toLowerCase()}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                  <span className="strength-label">{passwordStrength.label}</span>
                </div>
              )}

              {Array.isArray(validationErrors.password) && validationErrors.password.length > 0 && (
                <div className="password-requirements">
                  <p>Password must include:</p>
                  <ul>
                    {validationErrors.password.map((req, index) => (
                      <li key={index} className="requirement-item">
                        ❌ {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className={validationErrors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <div className="field-error">{validationErrors.confirmPassword}</div>
              )}
            </div>

        

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
        
        <div className="auth-image">
          <div className="image-overlay">
            <h3>Join Our Community</h3>
            <p>Thousands of travelers trust us with their dream vacations</p>
            <div className="feature-list">
              <div className="feature-item">✈️ Exclusive Travel Deals</div>
              <div className="feature-item">🏨 Premium Hotel Bookings</div>
              <div className="feature-item">🎫 Easy Booking Process</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
