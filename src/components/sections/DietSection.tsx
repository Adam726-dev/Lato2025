// src/components/sections/DietSection.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '@/context/UserProfileContext';
import { usePlan, PlanChoices } from '@/context/PlanContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, ChevronRight, X } from 'lucide-react';

interface Option {
  id: number;
  icon?: React.ReactNode;
  name: string;
  description: string;
  features?: string[];
  price?: string;
}

interface DietSectionProps {
  sectionId: keyof PlanChoices;
  section: { options: Option[] };
}

const DietSection: React.FC<DietSectionProps> = ({ sectionId, section }) => {
  const { profile } = useUserProfile();
  const { choices, updateChoice, removeChoice } = usePlan();

  // uznajemy profil za kompletny, jeśli profile.dailyCalories i profile.mealsPerDay są ustawione
  const hasNutritionProfile = !!profile.dailyCalories && !!profile.mealsPerDay;

  // który option jest teraz otwarty w modal?
  const [modalOption, setModalOption] = useState<Option | null>(null);

  // helper: sprawdza czy dany opt.id jest aktualnie w choices[sectionId]
  const isSelected = (opt: Option) => choices[sectionId] === opt.id;

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Usunięto tło wideo diet.mp4 i overlay, bo są teraz w SectionPage */}
      <div className="relative z-20">
        {hasNutritionProfile ? (
          <>
            {/* ——— Pasek “Twój Profil Dietetyczny” ——— */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Twój Profil Dietetyczny</h2>
              <Link to="/dieta/wizard">
                <Button variant="outline" className="mb-2 text-black border-white hover:bg-white/10 hover:text-black">
                  ✏️ Edytuj profil AI
                </Button>
              </Link>
            </div>

            {/* ——— Podgląd planu AI ——— */}
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
            {/* ——— Przycisk otwarcia kreatora ——— */}
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

        {/* ——— Grid kafelków z cateringiem ——— */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.options.map((opt) => (
            <div
              key={opt.id}
              className={`
                relative bg-white rounded-lg shadow-md cursor-pointer
                transition-transform hover:scale-105 border-2
                ${isSelected(opt)
                  ? 'border-green-500 bg-green-50 scale-105 border-4'
                  : 'border-gray-200 hover:border-green-300'}
              `}
              onClick={() => setModalOption(opt)}
            >
              <div className="p-6 text-center">
                {opt.icon && <div className="text-4xl mb-4">{opt.icon}</div>}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{opt.description}</p>
                {opt.features && (
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {opt.features.map((f, i) => (
                      <li key={i} className="flex items-center justify-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {opt.price && (
                  <div className="text-lg font-bold text-green-600 mb-2">{opt.price}</div>
                )}
                <div className="flex items-center justify-center text-green-600">
                  <span className="text-sm font-medium">
                    {isSelected(opt) ? 'Wybrane' : 'Wybierz'}
                  </span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ——— Modal z detalami i akcjami ——— */}
      {modalOption && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative">
            <button
              onClick={() => setModalOption(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-6 space-y-4">
              {/* Nagłówek */}
              <div className="text-center space-y-2">
                {modalOption.icon && <div className="text-5xl">{modalOption.icon}</div>}
                <h2 className="text-3xl font-bold">{modalOption.name}</h2>
                <p className="text-gray-600">{modalOption.description}</p>
              </div>

              {/* Cechy */}
              {modalOption.features && (
                <ul className="space-y-2 text-left">
                  {modalOption.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}

              {/* Cena */}
              {modalOption.price && (
                <div className="text-2xl font-bold text-green-600 text-center">
                  {modalOption.price}
                </div>
              )}

              {/* Akcje */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    updateChoice(sectionId, modalOption.id);
                    setModalOption(null);
                  }}
                >
                  Wybierz
                </Button>

                {isSelected(modalOption) && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      removeChoice(sectionId);
                      setModalOption(null);
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
    </div>
  );
};

export default DietSection;
