
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dumbbell, Play, ChevronRight, Settings, User, RefreshCw } from 'lucide-react';
import { getWorkoutPlans } from '@/services/workoutPlanService';
import { WorkoutPlan } from '@/types/workoutPlan';
import WorkoutTracker from '@/components/WorkoutTracker';
import FitnessWizard from '@/components/FitnessWizard';
import { useUserProfile } from '@/context/UserProfileContext';

interface GymSectionProps {
  sectionId: string;
  section: any;
  choices: any;
  updateChoice: (sectionId: string, optionId: string) => void;
}

const GymSection: React.FC<GymSectionProps> = ({ sectionId, section, choices, updateChoice }) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showTracker, setShowTracker] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [showFitnessWizard, setShowFitnessWizard] = useState(false);
  const { profile, isProfileComplete } = useUserProfile();

  useEffect(() => {
    const plans = getWorkoutPlans();
    setWorkoutPlans(plans);
  }, []);

  const handleStartWorkout = (plan: WorkoutPlan, dayId: string) => {
    setSelectedPlan(plan);
    setSelectedDayId(dayId);
    setShowTracker(true);
  };

  const handleBackToPlans = () => {
    setShowTracker(false);
    setSelectedPlan(null);
    setSelectedDayId('');
  };

  const handleEditProfile = () => {
    setShowFitnessWizard(true);
  };

  const handleWizardComplete = () => {
    setShowFitnessWizard(false);
    // Odśwież plany po aktualizacji profilu
    const updatedPlans = getWorkoutPlans();
    setWorkoutPlans(updatedPlans);
  };

  if (showFitnessWizard) {
    return <FitnessWizard onComplete={handleWizardComplete} />;
  }

  if (showTracker && selectedPlan) {
    return (
      <WorkoutTracker
        workoutPlan={selectedPlan}
        workoutDayId={selectedDayId}
        onBack={handleBackToPlans}
      />
    );
  }

  return (
    <div>
      {workoutPlans.length > 0 ? (
        <div>
          {/* Sekcja z wygenerowanym planem treningowym */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Twój Plan Treningowy AI</h2>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Edytuj profil
                </Button>
                <Link to="/generator-planu">
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Wygeneruj nowy plan
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Informacje o profilu */}
            {isProfileComplete('fitness') && (
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-blue-900">Profil Fitness</h4>
                        <p className="text-sm text-blue-700">
                          {profile.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}, {profile.age} lat, 
                          {profile.currentWeight}kg → {profile.targetWeight}kg, 
                          poziom: {profile.fitnessLevel}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleEditProfile}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                  {workoutPlans[0].name}
                </CardTitle>
                <p className="text-gray-600">{workoutPlans[0].description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Utworzony: {new Date(workoutPlans[0].createdAt).toLocaleDateString('pl-PL')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Dni treningowe:</h4>
                  {workoutPlans[0].workoutDays.map((day) => (
                    <div key={day.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{day.name}</h5>
                        <p className="text-sm text-gray-600">
                          {day.exercises.length} ćwiczeń
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartWorkout(workoutPlans[0], day.id)}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Rozpocznij
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sekcja z dostępnymi siłowniami */}
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Wybierz siłownię dla swojego planu</h2>
              <p className="text-gray-600">Znajdź najlepszą siłownię w Twojej okolicy, aby realizować swój plan treningowy</p>
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
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
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
                        <div className="text-lg font-bold text-blue-600 mb-2">
                          {option.price}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center text-blue-600">
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
        </div>
      ) : (
        <div>
          <div className="mb-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/generator-planu">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  🤖 Wygeneruj plan treningowy AI
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-6 py-3"
              >
                <User className="h-5 w-5" />
                {isProfileComplete('fitness') ? 'Edytuj profil fitness' : 'Skonfiguruj profil fitness'}
              </Button>
            </div>
            <p className="text-gray-600 mt-2">lub wybierz gotową siłownię poniżej</p>
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
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
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
                      <div className="text-lg font-bold text-blue-600 mb-2">
                        {option.price}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center text-blue-600">
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

export default GymSection;
