
import React from 'react';

interface AIEnhancementNoticeProps {
  sectionId: string;
  sectionName: string;
  hasSocialProfile: boolean;
  hasWeatherProfile: boolean;
  hasProgressProfile: boolean;
  hasBudgetProfile: boolean;
  hasHabitsProfile: boolean;
}

const AIEnhancementNotice: React.FC<AIEnhancementNoticeProps> = ({
  sectionId,
  sectionName,
  hasSocialProfile,
  hasWeatherProfile,
  hasProgressProfile,
  hasBudgetProfile,
  hasHabitsProfile
}) => {
  const getAIDescription = () => {
    switch (sectionId) {
      case 'silownia':
        return 'Personal Trainer AI przeanalizował Twoje cele i kondycję, aby pokazać najlepsze opcje treningowe.';
      case 'dieta':
        return 'Smart Meal Planner AI uwzględnił Twoje preferencje żywieniowe i cele kaloryczne.';
      case 'imprezy':
        return 'Weekend Activity Optimizer AI dobrał imprezy idealne dla Twojego typu osobowości i poziomu energii.';
      default:
        return 'Travel Route Planner AI zaplanował opcje wakacyjne dopasowane do Twojego budżetu i stylu podróżowania.';
    }
  };

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-lg p-6">
      <h3 className="font-bold text-lg mb-2 text-blue-700">
        🤖 AI dostosowało opcje do Twojego profilu!
      </h3>
      <p className="text-gray-700 mb-3">
        {getAIDescription()}
      </p>
      
      <div className="flex flex-wrap gap-2 text-sm">
        {hasSocialProfile && (
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
            🤝 Social Companion aktywny
          </span>
        )}
        {hasWeatherProfile && (
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
            🌤️ Weather Planner aktywny
          </span>
        )}
        {hasProgressProfile && (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
            📈 Progress Predictor aktywny
          </span>
        )}
        {hasBudgetProfile && (
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
            💰 Budget Optimizer aktywny
          </span>
        )}
        {hasHabitsProfile && (
          <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded">
            🎯 Habit Formation Coach aktywny
          </span>
        )}
      </div>
    </div>
  );
};

export default AIEnhancementNotice;
