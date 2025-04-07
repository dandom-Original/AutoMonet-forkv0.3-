import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  if (!user?.email?.endsWith('@admin.com')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Admin-spezifische Komponenten hier */}
    </div>
  );
};

export default AdminPage;
