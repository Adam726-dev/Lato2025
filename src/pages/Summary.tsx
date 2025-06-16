import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlan } from '@/context/PlanContext';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { sectionsData } from '@/data/sections';
import type { Section, Option } from '@/data/sections';
import { useToast } from '@/hooks/use-toast';

type Selected = { section: Section; option: Option };

// Mapowanie sekcji na kolory tła
const sectionColors: Record<string, string> = {
  dieta:    'bg-green-400',
  silownia: 'bg-red-400',
  imprezy:  'bg-purple-400',
  wakacje:  'bg-yellow-500',
};

const Summary: React.FC = () => {
  const { choices, removeChoice, clearChoices } = usePlan();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const selectedSections: Selected[] = Object.entries(choices)
    .map(([sectionId, optionId]) => {
      const section = sectionsData.find(s => s.id === sectionId);
      const option = section?.options.find(o => o.id === optionId);
      return section && option ? { section, option } : null;
    })
    .filter((item): item is Selected => item !== null);

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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-6xl mb-6">📋</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Twój plan jest pusty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Zacznij od wyboru opcji w dowolnej sekcji, aby zobaczyć swój plan!
            </p>
            <Link to="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors">
                🏠 Powróć do strony głównej
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-gray-600 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" /> Wróć
        </Link>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Cześć {user?.displayName}!</h1>
            <p className="text-gray-600 mt-2">Oto Twój spersonalizowany plan na lato:</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-6 mb-8">
          {selectedSections.map(({ section, option }) => (
            <div key={section.id} className="bg-white rounded-lg shadow border border-gray-200">
              {/* Nagłówek z kolorowym tłem */}
              <div
                className={`
                  p-6 flex items-center justify-between
                  ${sectionColors[section.id] ?? 'bg-gray-100'}
                `}
              >
                <h2 className="text-xl font-semibold flex items-center text-white">
                  <span className="text-2xl mr-3">{section.icon}</span>
                  {section.name}
                </h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Wybrane
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-lg">{option.name}</h4>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {option.price} zł
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="ml-1 text-sm text-gray-600">{option.rating}</span>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-1">
                      {option.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Przyciski CTA */}
                    {section.id === "silownia" && (
                      <Link to="/voucher/silownia">
                        <button className="mt-4 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md font-medium transition-colors w-full">
                          Kup karnet
                        </button>
                      </Link>
                    )}
                    {section.id === "dieta" && (
                      <Link to="/voucher/dieta">
                        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full">
                          Wykup dietę
                        </button>
                      </Link>
                    )}
                    {section.id === "imprezy" && (
                      <Link to="/voucher/imprezy">
                        <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full">
                          Zarezerwuj bilet
                        </button>
                      </Link>
                    )}
                    {section.id === "wakacje" && (
                      <Link to="/voucher/wakacje">
                        <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition-colors w-full">
                          Zarezerwuj wakacje
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Przyciski Usuń / Zmień */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => removeChoice(section.id as keyof typeof choices)}
                    className="
                      flex-1
                      py-3
                      border-2 border-red-600
                      hover:bg-red-100
                      text-red-600 font-semibold
                      rounded-lg
                      transition
                      focus:outline-none focus:ring-2 focus:ring-red-500
                    "
                  >
                    Usuń wybraną opcję
                  </button>
                  <button
                    onClick={() => navigate(`/${section.id}`)}
                    className="
                      flex-1
                      py-3
                      border-2 border-blue-500
                      text-blue-500 font-semibold
                      rounded-lg
                      transition
                      hover:bg-blue-100
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                    "
                  >
                    Zmień wybraną opcję
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Koszt całego planu */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg mb-8">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Szacunkowy koszt całego planu</h3>
            <div className="text-4xl font-bold">{totalCost} zł</div>
            <p className="mt-2 text-white/90">
              {selectedSections.length}{' '}
              {selectedSections.length === 1 ? 'wybrana aktywność' : 'wybrane aktywności'}
            </p>
          </div>
        </div>

        {/* Dalsze akcje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleAddToCalendar}
            className="bg-green-500 hover:bg-green-600 text-white py-3 font-medium transition-colors flex items-center justify-center"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Dodaj do Google Calendar
          </button>

          <button
            onClick={handleShare}
            className="border-2 border-gray-300 bg-white hover:bg-gray-100 text-gray-800 py-3 font-medium transition-colors flex items-center justify-center"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Udostępnij plan
          </button>
        </div>
      </main>
    </div>
  );
};

export default Summary;
