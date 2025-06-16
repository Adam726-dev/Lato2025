import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from './Navigation';
import FitnessWizard from './FitnessWizard';
import NutritionWizard from './NutritionWizard';
import ActivityWizard from './ActivityWizard';
import TravelWizard from './TravelWizard';
import MoodEnergyProfileForm from './MoodEnergyProfileForm';
import SocialCompanionForm from './SocialCompanionForm';
import WeatherSmartForm from './WeatherSmartForm';
import ProgressPredictorForm from './ProgressPredictorForm';
import BudgetOptimizerForm from './BudgetOptimizerForm';
import HabitFormationForm from './HabitFormationForm';
import PlanGenerator from './PlanGenerator';
import CateringMatcher from './CateringMatcher';
import TravelPlanGenerator from './TravelPlanGenerator';

interface FormRendererProps {
  formType: string;
  sectionId: string;
  onComplete: () => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ formType, sectionId, onComplete }) => {
  const renderForm = () => {
    switch (formType) {
      case 'fitness':
        return <FitnessWizard onComplete={onComplete} />;
      case 'nutrition':
        return <NutritionWizard onComplete={onComplete} />;
      case 'activity':
        return <ActivityWizard onComplete={onComplete} />;
      case 'travel':
        return <TravelWizard onComplete={onComplete} />;
      case 'mood':
        return <MoodEnergyProfileForm onComplete={onComplete} />;
      case 'social':
        return <SocialCompanionForm onComplete={onComplete} />;
      case 'weather':
        return <WeatherSmartForm onComplete={onComplete} />;
      case 'progress':
        return <ProgressPredictorForm onComplete={onComplete} />;
      case 'budget':
        return <BudgetOptimizerForm onComplete={onComplete} />;
      case 'habits':
        return <HabitFormationForm onComplete={onComplete} />;
      case 'plan-generator':
        return <PlanGenerator />;
      case 'catering-matcher':
        return <CateringMatcher onComplete={onComplete} />;
      default:
        if (sectionId === 'silownia') return <FitnessWizard onComplete={onComplete} />;
        if (sectionId === 'dieta') return <CateringMatcher onComplete={onComplete} />;
        if (sectionId === 'imprezy') return <ActivityWizard onComplete={onComplete} />;
        if (sectionId === 'wakacje') return <TravelWizard onComplete={onComplete} />;
        return null;
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
        </div>
        {renderForm()}
      </main>
    </div>
  );
};

export default FormRenderer;
