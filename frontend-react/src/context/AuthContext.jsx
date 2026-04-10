import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.profile()
        .then(profileData => setUser(profileData))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    const userData = data?.user || data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', userData?.role || '');
    setUser(userData);
    return data;
  };

  const signup = async (body) => {
    // Always sign up as a regular user — no role selection
    const data = await authService.signup({ ...body, role: 'user' });
    const userData = data?.user || data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', userData?.role || '');
    setUser(userData);
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const data = await authService.googleAuth({ credential });
    const userData = data?.user || data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', userData?.role || '');
    setUser(userData);
    return data;
  };

  // Called after successful vendor registration to update the state with new token and role
  const upgradeToVendor = (userData, token) => {
    if (token) localStorage.setItem('token', token);
    const updatedUser = userData || { ...user, role: 'vendor' };
    localStorage.setItem('userRole', updatedUser?.role || 'vendor');
    setUser(updatedUser);
  };

  const logout = () => {
    const userId = user?._id || user?.id; // Prefer _id
    // Clear cart for this user
    if (userId) localStorage.removeItem(`cart_${userId}`);
    localStorage.removeItem('cart_guest');
    localStorage.removeItem('cart');

    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, upgradeToVendor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
