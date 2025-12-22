import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { user } = await authService.login(credentials);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const user = await authService.register(userData);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isStaff: user?.role === 'STAFF',
    isAdmin: user?.role === 'ADMIN',
    isStaffOrAdmin: user?.role === 'STAFF' || user?.role === 'ADMIN',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};