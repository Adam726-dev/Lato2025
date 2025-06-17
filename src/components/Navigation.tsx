
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Home, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  if (loading || !user) return null;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">☀️</span>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">Twój Plan na Lato</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Cześć, {user.displayName}!</span>
            
            {user.isAdmin && (
              <Link to="/admin">
                <button className="flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </button>
              </Link>
            )}
            
            {location.pathname !== '/' && (
              <Link to="/">
                <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-100 rounded-md transition-colors">
                  <Home className="h-4 w-4 mr-2" />
                  Strona główna
                </button>
              </Link>
            )}
            
            <button 
              onClick={logout} 
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
