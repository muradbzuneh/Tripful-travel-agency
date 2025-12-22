import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Packages from "./pages/Package";
import PackageDetails from "./pages/PackageDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/Mybooking";
import StaffDashboard from "./pages/StaffDashboard";
import BookingDetails from "./pages/BookingDetails";
import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";
import AIRecommendation from "./componets/AIRecommendation";
import ProtectedRoute from "./componets/ProtectedRoute";

function App() {
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

export default App;
