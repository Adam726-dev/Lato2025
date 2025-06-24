// src/components/sections/DietSection.tsx

import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NutritionWizard from '../NutritionWizard';
import type { Section, Option } from '../../data/sections';
import { usePlan, PlanChoices } from '@/context/PlanContext'
import { optionCardBase } from '@/components/ui/OptionCard'

interface DietSectionProps {
  sectionId: keyof PlanChoices
  section: Section;
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
  hasNutritionProfile,
  nutritionProfile,
}) => {
  const { choices, updateChoice, removeChoice } = usePlan();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [expanded, setExpanded] = useState<Option | null>(null);

  // 1) kreator
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

  // 2) główny widok + kafelki + modal
  return (
    <section id={sectionId} className="py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* AI-panel */}
        {hasNutritionProfile && nutritionProfile && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-2xl font-semibold">🥗 Twój Plan Żywieniowy AI</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Kcal/dzień</p>
                <p className="text-xl font-bold">{nutritionProfile.calories} kcal</p>
              </div>
              <div className="bg-blue-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Posiłki/dzień</p>
                <p className="text-xl font-bold">{nutritionProfile.mealsPerDay}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Preferencje</p>
                <p className="text-xl font-bold">{nutritionProfile.preferences.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded text-center">
                <p className="text-sm text-gray-500">Alergie</p>
                <p className="text-xl font-bold">{nutritionProfile.allergies.length}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setWizardOpen(true)}>🍽️ Zobacz plan posiłków</Button>
              <Button variant="outline" onClick={() => setWizardOpen(true)}>
                📦 Dopasuj catering
              </Button>
            </div>
          </div>
        )}

        {/* przycisk AI-wizarda */}
        <div className="text-center">
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
          <p className="text-gray-600 mt-2">lub wybierz gotowy catering poniżej</p>
        </div>

        {/* grid kafelków */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.options.map(option => {
            const isSel = choices[sectionId] === option.id;
            return (
              <div
                key={option.id}
                className={
                  optionCardBase +
                  'p-8 ' +
                  (isSel
                    ? 'border-2 border-green-600 transform scale-105'
                    : 'hover:border-green-300')
                }
                onClick={() => setExpanded(option)}
              >
                <div className="text-4xl mb-4 text-center">{option.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  {option.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 text-center">{option.description}</p>
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
                {option.price != null && (
                  <div className="text-lg font-bold text-green-600 mb-2 text-center">
                    {option.price} zł/dzień
                  </div>
                )}
                <div className="flex items-center justify-center text-green-600">
                  <span className="text-sm font-medium">
                    {isSel ? 'Wybrane' : 'Wybierz'}
                  </span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {expanded && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative">
            {/* krzyżyk */}
            <button
              onClick={() => setExpanded(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-6 space-y-4">
              {/* treść */}
              <div className="text-center space-y-2">
                <div className="text-5xl">{expanded.image}</div>
                <h2 className="text-3xl font-bold">{expanded.name}</h2>
                <p className="text-gray-600">{expanded.description}</p>
              </div>

              {/* lista cech */}
              <ul className="space-y-2 text-left">
                {expanded.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> {feat}
                  </li>
                ))}
              </ul>

              {/* cena */}
              <div className="text-2xl font-bold text-green-600 text-center">
                {expanded.price} zł/dzień
              </div>

              {/* akcje */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    updateChoice(sectionId, expanded.id);
                    setExpanded(null);
                  }}
                >
                  Wybierz
                </Button>

                {choices[sectionId] === expanded.id && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      removeChoice(sectionId);
                      setExpanded(null);
                    }}
                  >
                    Anuluj
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DietSection;
