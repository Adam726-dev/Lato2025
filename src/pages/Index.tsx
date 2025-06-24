import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';
import LoginForm from '@/components/LoginForm';
import LandingPage from '@/components/LandingPage';
import Navigation from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { sectionsData } from '@/data/sections';

const sectionColors: Record<string, string> = {
  dieta:    'bg-green-400',
  silownia: 'bg-red-400',
  wakacje:  'bg-yellow-500',
};

const Index = () => {
  const { isLoggedIn } = useAuth();
  const { choices } = usePlan();
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  const hasAnyChoices = Object.keys(choices).length > 0;

  if (!isLoggedIn && !showLoginForm) {
    return <LandingPage onGetStarted={() => setShowLoginForm(true)} />;
  }

  if (!isLoggedIn && showLoginForm) {
    return <LoginForm onBack={() => setShowLoginForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Twój Plan na <span className="text-summer-blue">Lato</span> ☀️
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stwórz idealny plan na najbardziej gorące miesiące roku. Wybierz dietę, siłownię i wakacje dopasowane do Twoich potrzeb!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* <Link to="/kalkulator-bmr">
              <button className="bg-summer-coral hover:bg-summer-coral/90 text-white text-lg px-8 py-3 rounded-md font-medium transition-colors">
                🧮 Kalkulator BMR
              </button>
            </Link>

            <Link to="/generator-planu">
              <button className="bg-gradient-to-r from-summer-blue to-summer-mint hover:from-summer-blue/90 hover:to-summer-mint/90 text-white text-lg px-8 py-3 rounded-md font-medium transition-colors">
                🤖 AI Generator Planów
              </button>
            </Link> */}
            
            {hasAnyChoices && (
              <Link to="/podsumowanie">
                <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-lg px-8 py-3 rounded-md font-medium transition-colors">
                  🧾 Zobacz swój plan
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full">
          {sectionsData.filter(section => section.id !== 'imprezy').map(section => {
            // wyciągamy surową wartość z choices
            const raw = choices[section.id as keyof typeof choices];
            
            // jeśli to imprezy, raw może być tablicą number[]
            // USUNIĘTO OBSŁUGĘ IMPREZ
            let label: string;
            if (section.id === 'imprezy') {
              label = '';
            } else {
              if (typeof raw === 'number') {
                label = section.options.find(o => o.id === raw)?.name ?? 'Nie wybrano';
              } else {
                label = 'Nie wybrano';
              }
            }

            return (
              <div key={section.id} className="animate-scale-in w-full">
                <Link to={`/${section.id}`}>
                  <div className={`
                    ${sectionColors[section.id] ?? 'bg-gray-100'}
                    rounded-lg overflow-hidden shadow-lg cursor-pointer w-full
                    transition-transform duration-200 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-gray-300/60
                  `}>
                    <div className="p-6 text-center">
                      <div className="text-4xl mb-3">{section.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{section.name}</h3>
                      <p className="text-white/90 text-sm mb-4">{section.description}</p>
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${label === 'Nie wybrano'
                          ? 'bg-white/20 border border-white/30 text-white'
                          : 'bg-white/20 text-white'}
                      `}>
                        {label !== 'Nie wybrano' && <span className="mr-2">✓</span>}
                        {label}
                      </span>
                      <div className="flex items-center justify-center mt-3 text-white/80">
                        <span className="text-sm">Wybierz opcję</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-summer-blue to-summer-mint rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Gotowy na najlepsze lato w życiu? 🌊</h2>
          <p className="text-xl mb-6 text-white/90">
            Rozpocznij swój plan już dziś i ciesz się każdą chwilą lata!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dieta">
              <button className="bg-white text-summer-blue hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors">
                🥗 Zacznij od diety
              </button>
            </Link>
            <Link to="/silownia">
              <button className="border border-white text-white hover:bg-white hover:text-summer-blue px-8 py-3 rounded-md font-medium transition-colors">
                🏋️‍♀️ Wybierz siłownię
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
