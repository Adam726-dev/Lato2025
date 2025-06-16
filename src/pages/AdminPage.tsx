
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminPanel from '@/components/AdminPanel';
import Navigation from '@/components/Navigation';

const AdminPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Brak dostępu</h1>
            <p className="text-gray-600">Nie masz uprawnień do przeglądania tej strony.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AdminPanel />
    </div>
  );
};

export default AdminPage;
