import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlan } from '@/context/PlanContext';
import { sectionsData } from '@/data/sections';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GymSection from '@/components/sections/GymSection';
import DietSection from '@/components/sections/DietSection';
import TravelSection from '@/components/sections/TravelSection';
import DefaultSection from '@/components/sections/DefaultSection';

const SectionPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { choices, updateChoice } = usePlan();

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

  const commonProps = {
    sectionId: sectionId!,
    section,
    choices,
    updateChoice: (sid: string, oid: string) =>
      updateChoice(sid as keyof typeof choices, Number(oid)),
  };

  let Content;
  switch (sectionId) {
    case 'silownia':
      Content = <GymSection {...commonProps} />;
      break;
    case 'dieta':
      Content = <DietSection {...commonProps} />;
      break;
    case 'wakacje':
      Content = <TravelSection {...commonProps} />;
      break;
    default:
      Content = <DefaultSection {...commonProps} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powróć do strony głównej
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              {section.icon} {section.name}
            </h1>
            <p className="text-xl text-gray-600">{section.description}</p>
          </div>
        </div>
        {Content}
      </main>
    </div>
  );
};

export default SectionPage;
