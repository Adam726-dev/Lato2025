// src/components/sections/DietSection.tsx

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NutritionWizard from '../NutritionWizard';
import type { Section, Option } from '../../data/sections';

interface DietSectionProps {
  sectionId: string;
  section: Section;
  choices: Record<string, number>;
  updateChoice: (sectionId: string, optionId: number) => void;
  hasNutritionProfile: boolean;
  nutritionProfile?: {
    calories: number;
    mealsPerDay: number;
    preferences: string[];
    allergies: string[];
  };
}

const DietSection: React.FC<DietSectionProps> = ({
  section,
  sectionId,
  choices,
  updateChoice,
  hasNutritionProfile,
  nutritionProfile,
}) => {
  const [wizardOpen, setWizardOpen] = useState(false);

  // Gdy wizard jest otwarty, pokazujemy kreatora + własny przycisk “Powrót do diety”
  if (wizardOpen) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setWizardOpen(false)}>
            ← Powrót do diety
          </Button>
        </div>
        <NutritionWizard onComplete={() => setWizardOpen(false)} />
      </div>
    );
  }

  // Główne view sekcji “Dieta”
  return (
    <section id={sectionId} className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        

        {/* 1) Panel z istniejącym planem AI */}
        {hasNutritionProfile && nutritionProfile && (
          <div className="max-w-4xl mx-auto mb-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-semibold mb-4">
              🥗 Twój Plan Żywieniowy AI
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Kcal dziennie</p>
                <p className="text-xl font-bold">
                  {nutritionProfile.calories} kcal
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Posiłki dziennie</p>
                <p className="text-xl font-bold">
                  {nutritionProfile.mealsPerDay}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Preferencje</p>
                <p className="text-xl font-bold">
                  {nutritionProfile.preferences.length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Alergie</p>
                <p className="text-xl font-bold">
                  {nutritionProfile.allergies.length}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => setWizardOpen(true)}>
                🍽️ Zobacz plan posiłków
              </Button>
              <Button variant="outline" onClick={() => setWizardOpen(true)}>
                📦 Dopasuj catering
              </Button>
            </div>
          </div>
        )}

        {/* 2) Przycisk AI-wizarda */}
        <div className="mb-8 text-center">
          <Button
            variant={hasNutritionProfile ? 'outline' : undefined}
            className={
              hasNutritionProfile
                ? ''
                : 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
            }
            onClick={() => setWizardOpen(true)}
          >
            {hasNutritionProfile
              ? '✏️ Edytuj profil dietetyczny AI'
              : '🥗 Stwórz profil dietetyczny AI'}
          </Button>
          <p className="text-gray-600 mt-2">
            lub wybierz gotowy catering poniżej
          </p>
        </div>

        {/* 3) Grid kafelków */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.options.map((option: Option) => (
            <div
              key={option.id}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition hover:shadow-xl ${
                choices[sectionId] === option.id
                  ? 'border-2 border-blue-500 scale-105'
                  : ''
              }`}
              onClick={() => updateChoice(sectionId, option.id)}
            >
              <div className="text-4xl mb-4 text-center">
                {option.image}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {option.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 text-center">
                {option.description}
              </p>
              {option.features && (
                <ul className="text-sm text-gray-500 space-y-1 mb-4">
                  {option.features.map((f, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {option.price && (
                <div className="text-lg font-bold text-green-600 mb-2 text-center">
                  {option.price}
                </div>
              )}
              <div className="flex items-center justify-center text-green-600">
                <span className="text-sm font-medium">
                  {choices[sectionId] === option.id ? 'Wybrane' : 'Wybierz'}
                </span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DietSection;
