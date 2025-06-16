
import React from 'react';

interface ProfileEditButtonsProps {
  sectionId: string;
  hasProfiles: {
    social: boolean;
    weather: boolean;
    progress: boolean;
    budget: boolean;
    habits: boolean;
  };
  onShowForm: (formType: string) => void;
}

const ProfileEditButtons: React.FC<ProfileEditButtonsProps> = ({
  sectionId,
  hasProfiles,
  onShowForm
}) => {
  const getProfileLabel = () => {
    switch (sectionId) {
      case 'silownia': return 'fitness';
      case 'dieta': return 'żywieniowy';
      case 'imprezy': return 'aktywności';
      default: return 'podróży';
    }
  };

  return (
    <div className="text-center flex flex-wrap gap-2 justify-center mb-4">
          <button
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-3 py-1 rounded transition-colors text-sm"
            onClick={() => onShowForm('fitness')}
          >
            🏋️‍♂️ Edytuj profil fitness
          </button>
          <button
            className="bg-green-100 hover:bg-green-200 text-green-800 font-medium px-3 py-1 rounded transition-colors text-sm"
            onClick={() => onShowForm('weather')}
          >
            🌦️ Aktualizuj nastrój i energię
          </button>
          <button
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium px-3 py-1 rounded transition-colors text-sm"
            onClick={() => onShowForm('social')}
          >
            🧑‍🤝‍🧑 Edytuj Social Companion
          </button>
          <button
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-medium px-3 py-1 rounded transition-colors text-sm"
            onClick={() => onShowForm('weather')}
          >
            ☀️ Edytuj Weather Planner
          </button>
          <button
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium px-3 py-1 rounded transition-colors text-sm"
            onClick={() => onShowForm('progress')}
          >
            📈 Skonfiguruj Progress Predictor
          </button>
          <button
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-3 py-1 rounded transition-colors text-sm"
            onClick={() => onShowForm('budget')}
          >
            🪙 Skonfiguruj Budget Optimizer
          </button>
          <button
            className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-medium px-3 py-1 rounded transition-colors text-sm"
            onClick={() => onShowForm('habits')}
          >
            💡 Edytuj Habit Formation Coach
          </button>
        </div>
  );
};

export default ProfileEditButtons;
