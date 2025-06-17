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
import DefaultSection from '@/components/sections/DefaultSection';

const SectionPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { choices, updateChoice } = usePlan();

  const section = sectionsData.find(s => s.id === sectionId);

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sekcja nie znaleziona</h1>
            <Link to="/">
              <Button>Powróć do strony głównej</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderSectionContent = () => {
    const commonProps = {
      sectionId: sectionId!,
      section,
      choices,
      updateChoice: (sectionId: string, optionId: string) => updateChoice(sectionId as keyof typeof choices, Number(optionId))
    };

    switch (sectionId) {
      case 'silownia':
        return <GymSection {...commonProps} />;
      case 'dieta':
        return <DietSection {...commonProps} hasNutritionProfile={!!choices.dieta} choices={Object.fromEntries(Object.entries(choices).filter(([key, value]) => typeof value === 'number'))} updateChoice={(sectionId, optionId) => updateChoice(sectionId as keyof PlanChoices, Number(optionId))} />;
      case 'wakacje':
        return <TravelSection {...commonProps} />;
      default:
        return <DefaultSection {...commonProps} />;
    }
  };

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
              {section.icon} {section.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {section.description}
            </p>
          </div>
        </div>

        {renderSectionContent()}
      </main>
    </div>
  );
};

export default SectionPage;
