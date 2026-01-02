import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Packages from "./pages/Package";
import PackageDetails from "./pages/PackageDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/Mybooking";
import StaffDashboard from "./pages/StaffDashboard";
import BookingDetails from "./pages/BookingDetails";
import Payment from "./pages/Payment";
import PaymentDemo from "./pages/PaymentDemo";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Navbar from "./componets/Navbar";
import Attractions from "./pages/Attractions";
import Destinations from "./pages/Destinations";
import Services from "./pages/Services";
import Footer from "./componets/Footer";
import AIRecommendation from "./componets/AIRecommendation";
import ProtectedRoute from "./componets/ProtectedRoute";
import Preloader from "./componets/Preloader";
import { useState, useEffect } from "react";
import "./styles/animations.css";
import "./styles/themes.css";

// Main App Content Component
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds minimum loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/package/:id" element={<PackageDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/attractions" element={<Attractions />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/services" element={<Services />} />
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/booking/:id" 
                element={
                  <ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } 
              />
              <Route path="/payment-demo" element={<PaymentDemo />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />
              <Route 
                path="/staff" 
                element={
                  <ProtectedRoute requireStaff>
                    <StaffDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <AIRecommendation />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;