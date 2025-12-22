import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireStaff = false, requireAdmin = false }) {
  const { isAuthenticated, isStaff, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireStaff && !isStaff && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}