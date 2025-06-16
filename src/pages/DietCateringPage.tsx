
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CateringMatcher from '@/components/CateringMatcher';

const DietCateringPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dieta');
  };

  const handleBack = () => {
    navigate('/dieta');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CateringMatcher 
          onComplete={handleComplete}
          onBack={handleBack}
        />
      </main>
    </div>
  );
};

export default DietCateringPage;
