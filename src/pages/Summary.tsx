// src/components/sections/Summary.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlan, PlanChoices } from '@/context/PlanContext';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { sectionsData } from '@/data/sections';
import type { Section, Option } from '@/data/sections';
import { useToast } from '@/hooks/use-toast';

type Selected = { section: Section; option: Option };

const sectionColors: Record<string, string> = {
  dieta: 'bg-green-500',
  silownia: 'bg-red-400',
  wakacje: 'bg-yellow-500',
};

const Summary: React.FC = () => {
  const { choices, updateChoice, removeChoice } = usePlan();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  // Zbierz wszystkie wybrane pozycje, bez multi-wyboru imprez
  const selectedSections: Selected[] = [];
  for (const [sectionId, raw] of Object.entries(choices)) {
    if (sectionId === 'imprezy') continue;
    const section = sectionsData.find(s => s.id === sectionId);
    if (!section) continue;
    if (typeof raw === 'number') {
      const opt = section.options.find(o => o.id === raw);
      if (opt) selectedSections.push({ section, option: opt });
    }
  }

  const totalCost = selectedSections.reduce(
    (sum, { option }) => sum + Number(option.price.replace(/\D/g, '')),
    0
  );

  const handleAddToCalendar = () => {
    toast("Twój plan został dodany do Google Calendar");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mój Plan na Lato',
        text: `Sprawdź mój plan na lato: ${selectedSections.length} wybranych aktywności!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Możesz teraz udostępnić swój plan znajomym");
    }
  };

  if (selectedSections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-6">📋</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Twój plan jest pusty</h1>
          <p className="text-xl text-gray-600 mb-8">
            Zacznij od wyboru opcji w dowolnej sekcji, aby zobaczyć swój plan!
          </p>
          <Link to="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium">
              🏠 Powróć do strony głównej
            </button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Link to="/" className="inline-flex items-center text-gray-600 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" /> Wróć
        </Link>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Cześć {user?.displayName}!</h1>
          <p className="text-gray-600 mb-4">Oto Twój spersonalizowany plan na lato:</p>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-md"
            title="Informacja o cenach"
          >
            ℹ️
          </button>
          {showInfo && (
            <div className="mt-2 bg-gray-100 text-gray-700 p-4 rounded shadow-md">
              Wszystkie ceny podane na stronie są to ceny brutto.
            </div>
          )}
        </div>

        {/* Karty podsumowania */}
        <div className="space-y-6">
          {selectedSections.map(({ section, option }, idx) => (
            <div key={`${section.id}-${option.id}-${idx}`} className="bg-white rounded-lg shadow border border-gray-200">
              {/* Nagłówek */}
              <div className={`p-6 flex items-center justify-between ${sectionColors[section.id] ?? 'bg-gray-100'}`}>
                <h2 className="text-xl font-semibold flex items-center text-white">
                  <span className="text-2xl mr-3">{section.icon}</span>
                  {section.name}
                </h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Wybrane
                </span>
              </div>
              {/* Treść */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-lg">{option.name}</h4>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{option.price} </div>
                    {'rating' in option && (
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <span className="text-yellow-500">⭐</span>
                        <span className="ml-1">{(option as any).rating}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="space-y-1">
                      {option.features?.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>{f}
                        </div>
                      ))}
                    </div>
                    {/* CTA */}
                    {section.id === 'silownia' && (
                      <Link to="/voucher/silownia">
                        <button className="mt-4 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md w-full">
                          Kup karnet
                        </button>
                      </Link>
                    )}
                    {section.id === 'dieta' && (
                      <Link to="/voucher/dieta">
                        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full">
                          Wykup dietę
                        </button>
                      </Link>
                    )}
                    {section.id === 'wakacje' && (
                      <Link to="/voucher/wakacje">
                        <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full">
                          Zarezerwuj wakacje
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
                {/* Usuń / Zmień */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => removeChoice(section.id as keyof PlanChoices)}
                    className="flex-1 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-100"
                  >
                    Usuń
                  </button>
                  <button
                    onClick={() => navigate(`/${section.id}`)}
                    className="flex-1 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-100"
                  >
                    Zmień
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Całkowity koszt */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">Szacunkowy koszt planu</h3>
          <div className="text-4xl font-bold">{totalCost} </div>
          <p className="mt-2 text-white/90">
            {selectedSections.length} {selectedSections.length === 1 ? 'aktywn.' : 'aktywn.'}
          </p>
        </div>

        {/* Dalsze akcje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleAddToCalendar}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-md flex items-center justify-center"
          >
            <Calendar className="h-5 w-5 mr-2" /> Dodaj do Google Calendar
          </button>
          <button
            onClick={handleShare}
            className="border-2 border-gray-300 bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-md flex items-center justify-center"
          >
            <Share2 className="h-5 w-5 mr-2" /> Udostępnij plan
          </button>
        </div>
      </main>
    </div>
  );
};

export default Summary;
