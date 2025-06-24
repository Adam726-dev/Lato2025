import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '@/context/UserProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, ChevronRight } from 'lucide-react';

interface DietSectionProps {
  sectionId: string;
  section: {
    options: Array<{
      id: number;
      icon?: string;
      name: string;
      description: string;
      features?: string[];
      price?: string;
    }>;
  };
  choices: Record<string, number>;
  updateChoice: (sectionId: string, optionId: string) => void;
}

const DietSection: React.FC<DietSectionProps> = ({
  sectionId,
  section,
  choices,
  updateChoice,
}) => {
  const { profile } = useUserProfile();

  // Profil dietetyczny uznajemy za kompletny jeśli mamy kcal i liczbę posiłków
  const hasNutritionProfile =
    !!profile.dailyCalories && !!profile.mealsPerDay;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {hasNutritionProfile ? (
        <>
          {/* ————————————————————————————————————— AI-panel ————————————————————————————————————— */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Twój Profil Dietetyczny</h2>
            <Link to="/dieta/wizard">
              <Button variant="outline">✏️ Edytuj profil AI</Button>
            </Link>
          </div>

          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-600" />
                Plan Żywieniowy AI
              </CardTitle>
              <p className="text-gray-600">Spersonalizowany plan dopasowany do Twoich potrzeb</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {profile.dailyCalories}
                  </div>
                  <div className="text-sm text-gray-600">kcal dziennie</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.mealsPerDay}
                  </div>
                  <div className="text-sm text-gray-600">posiłki dziennie</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile.dietPreferences?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">preferencje</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {profile.allergies?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">alergie</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Dostępne akcje:</h4>
                <div className="flex gap-4">
                  <Link to="/dieta/plan" className="flex-1">
                    <Button className="w-full flex items-center justify-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Zobacz plan posiłków
                    </Button>
                  </Link>
                  <Link to="/dieta/catering" className="flex-1">
                    <Button variant="outline" className="w-full">
                      📦 Dopasuj catering
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* ————————————————————————————————————— Przycisk otwarcia kreatora ————————————————————————————————————— */}
          <div className="text-center mb-8">
            <Link to="/dieta/wizard">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 text-lg">
                🥗 Stwórz profil dietetyczny AI
              </Button>
            </Link>
            <p className="text-gray-600 mt-2">lub wybierz gotowy catering poniżej</p>
          </div>
        </>
      )}

      {/* ————————————————————————————————————— Grid kafelków ————————————————————————————————————— */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.options.map((opt) => {
          const isSelected = choices[sectionId] === opt.id;
          return (
            <div
              key={opt.id}
              className={`relative bg-white rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 border-2 ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => updateChoice(sectionId, String(opt.id))}
            >
              <div className="p-6 text-center">
                {opt.icon && (
                  <div className="text-4xl mb-4">{opt.icon}</div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {opt.name}
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
                <p className="text-gray-600 text-sm mb-4">
                  {opt.description}
                </p>
                {opt.features && (
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {opt.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-center"
                      >
                        <span className="text-green-500 mr-2">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {opt.price && (
                  <div className="text-lg font-bold text-green-600 mb-2">
                    {opt.price}
                  </div>
                )}
                <div className="flex items-center justify-center text-green-600">
                  <span className="text-sm font-medium">
                    {isSelected ? 'Wybrane' : 'Wybierz'}
                  </span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DietSection;
