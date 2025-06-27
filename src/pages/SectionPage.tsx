// src/pages/SectionPage.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlan } from '@/context/PlanContext';
import type { PlanChoices } from '@/context/PlanContext';
import { sectionsData } from '@/data/sections';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GymSection from '@/components/sections/GymSection';
import DietSection from '@/components/sections/DietSection';
import TravelSection from '@/components/sections/TravelSection';

const SectionPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: keyof PlanChoices }>();
  const { updateChoice } = usePlan();
  const [travelViewMode, setTravelViewMode] = React.useState<'options' | 'wizard' | 'ai-planner'>('options');

  // Znajdź konfigurację tej sekcji w danych
  const section = sectionsData.find((s) => s.id === sectionId);
  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sekcja nie znaleziona</h1>
            <Link to="/">
              <Button>Powróć do strony głównej</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Funkcja wybierająca odpowiedni komponent po sectionId
  const renderSectionContent = () => {
    // wspólne propsy: sectionId + pełny obiekt sekcji
    const commonProps = {
      sectionId: sectionId as keyof PlanChoices,
      section,
    };

    switch (sectionId) {
      case 'silownia':
        // GymSection oczekuje { sectionId, section: { options: WorkoutOption[] } }
        return <GymSection {...commonProps} />;

      case 'dieta':
        // DietSection używa usePlan() wewnątrz, więc nie musisz przekazywać choices/updateChoice
        return <DietSection {...commonProps} />;

      case 'wakacje': {
        // TravelSectionProps wymaga TravelOption[]:  { id, image, name, description, price:number, rating, features }
        const travelOpts = section.options.map((o) => ({
          id: o.id,
          image: o.image,                                    // emoji ReactNode
          name: o.name,
          description: o.description,
          price: o.price,
          rating: o.rating || 0,
          features: o.features || [],
        }));

        return (
          <TravelSection
            sectionId={sectionId as keyof PlanChoices}
            // Podmieniamy tylko pole options na nową, przetworzoną tablicę
            section={{ ...section, options: travelOpts }}
            viewMode={travelViewMode}
            setViewMode={setTravelViewMode}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={`relative min-h-screen ${sectionId === 'dieta' || sectionId === 'wakacje' ? 'overflow-hidden' : ''} bg-gradient-to-br from-blue-50 via-white to-mint-50`}>
      {/* Tło wideo diet.mp4 dla sekcji Dieta */}
      {sectionId === 'dieta' && (
        <>
          <video
            className="fixed inset-0 w-full h-full object-cover z-0 blur-sm brightness-75"
            src="/videos/diet.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ pointerEvents: 'none', objectFit: 'cover', minHeight: '100%', minWidth: '100%' }}
          />
          <div className="fixed inset-0 bg-black bg-opacity-40 z-10 pointer-events-none" />
        </>
      )}
      {/* Tło wideo travel.mp4 dla sekcji Wakacje */}
      {sectionId === 'wakacje' && (
        <>
          <video
            className="fixed inset-0 w-full h-full object-cover z-0 blur-sm brightness-75"
            src="/videos/travel.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ pointerEvents: 'none', objectFit: 'cover', minHeight: '100%', minWidth: '100%' }}
          />
          <div className="fixed inset-0 bg-black bg-opacity-40 z-10 pointer-events-none" />
        </>
      )}
      <div className={sectionId === 'dieta' || sectionId === 'wakacje' ? 'relative z-20' : ''}>
        <Navigation />
        {sectionId === 'silownia' ? (
          // GymSection renderowany bez wrappera main, aby tło wideo było na całą stronę
          renderSectionContent()
        ) : (
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <Link
                to="/"
                className="flex items-center text-white hover:text-white mb-4 drop-shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2 text-white drop-shadow-lg" />
                Powróć do strony głównej
              </Link>
              {/* Ukryj nagłówek i opis sekcji podczas kreatora podróży i AI-planera */}
              {!(sectionId === 'wakacje' && (travelViewMode === 'wizard' || travelViewMode === 'ai-planner')) && (
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
                    {section.icon} {section.name}
                  </h1>
                  <p className="text-xl text-white drop-shadow-lg">{section.description}</p>
                </div>
              )}
            </div>
            {renderSectionContent()}
          </main>
        )}
      </div>
    </div>
  );
};

export default SectionPage;
