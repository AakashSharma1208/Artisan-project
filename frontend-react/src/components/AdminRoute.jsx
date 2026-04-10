import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Strictly check for admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
