import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Packages from "./pages/Package";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/Mybooking";
import Navbar from "./componets/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
