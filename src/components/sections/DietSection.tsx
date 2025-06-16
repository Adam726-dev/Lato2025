
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '@/context/UserProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, ChevronRight } from 'lucide-react';

interface DietSectionProps {
  sectionId: string;
  section: any;
  choices: any;
  updateChoice: (sectionId: string, optionId: string) => void;
}

const DietSection: React.FC<DietSectionProps> = ({ sectionId, section, choices, updateChoice }) => {
  const { profile } = useUserProfile();
  
  const hasNutritionProfile = profile.dailyCalories && profile.dietPreferences && profile.dietPreferences.length > 0;

  return (
    <div>
      {hasNutritionProfile ? (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Twój Profil Dietetyczny</h2>
            <Link to="/dieta/wizard">
              <Button variant="outline">Edytuj profil</Button>
            </Link>
          </div>
          
          <Card className="hover:shadow-lg transition-shadow mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-600" />
                Plan Żywieniowy AI
              </CardTitle>
              <p className="text-gray-600">Spersonalizowany plan dopasowany do Twoich potrzeb</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{profile.dailyCalories}</div>
                  <div className="text-sm text-gray-600">kcal dziennie</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{profile.mealsPerDay || 3}</div>
                  <div className="text-sm text-gray-600">posiłki dziennie</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{profile.dietPreferences?.length || 0}</div>
                  <div className="text-sm text-gray-600">preferencje</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{profile.allergies?.length || 0}</div>
                  <div className="text-sm text-gray-600">alergie</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Dostępne opcje:</h4>
                <div className="flex gap-4">
                  <Button className="flex-1 flex items-center gap-2" asChild>
                    <Link to="/dieta/plan">
                      <Utensils className="h-4 w-4" />
                      Zobacz plan posiłków
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/dieta/catering">
                      Dopasuj catering
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <div className="mb-8 text-center">
            <Link to="/dieta/wizard">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg">
                🥗 Stwórz profil dietetyczny AI
              </Button>
            </Link>
            <p className="text-gray-600 mt-2">lub wybierz gotowy catering poniżej</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.options?.map((option: any) => {
              const isSelected = choices[sectionId] === option.id;
              
              return (
                <div
                  key={option.id}
                  className={`
                    bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 
                    hover:shadow-xl hover:scale-105 border-2
                    ${isSelected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                    }
                  `}
                  onClick={() => updateChoice(sectionId, option.id.toString())}
                >
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">{option.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{option.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                    
                    {option.features && (
                      <ul className="text-sm text-gray-500 space-y-1 mb-4">
                        {option.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center justify-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {option.price && (
                      <div className="text-lg font-bold text-green-600 mb-2">
                        {option.price}
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
      )}
    </div>
  );
};

export default DietSection;
