import React from 'react';
import Navigation from '@/components/Navigation';
import PlanGenerator from '@/components/PlanGenerator';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PlanGeneratorPage = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <Navigation />
      {/* Tło wideo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/videos/gym.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-60 blur-sm"
        style={{ filter: 'brightness(40%) blur(6px)', WebkitFilter: 'brightness(40%) blur(6px)' }}
      />
      {/* Overlay na tło */}
      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link to="/">
              <button className="mb-4 flex items-center text-white hover:text-slate-200 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powróć do strony głównej
              </button>
            </Link>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
                🤖 AI Plan Generator
              </h1>
              <p className="text-xl text-slate-100 drop-shadow max-w-2xl mx-auto">
                Wygeneruj spersonalizowany plan treningowy i dietetyczny za pomocą sztucznej inteligencji
              </p>
            </div>
          </div>
          
          <PlanGenerator />
        </main>
      </div>
    </div>
  );
};

export default PlanGeneratorPage;
