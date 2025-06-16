
import React from 'react';
import Navigation from '@/components/Navigation';
import PlanGenerator from '@/components/PlanGenerator';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PlanGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/">
            <button className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powróć do strony głównej
            </button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 AI Plan Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wygeneruj spersonalizowany plan treningowy i dietetyczny za pomocą sztucznej inteligencji
            </p>
          </div>
        </div>
        
        <PlanGenerator />
      </main>
    </div>
  );
};

export default PlanGeneratorPage;
