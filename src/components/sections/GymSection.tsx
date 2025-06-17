// src/components/sections/GymSection.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Dumbbell,
  Play,
  ChevronRight,
  Settings,
  User,
  RefreshCw,
  X,
} from 'lucide-react';
import { getWorkoutPlans } from '@/services/workoutPlanService';
import { WorkoutPlan } from '@/types/workoutPlan';
import WorkoutTracker from '@/components/WorkoutTracker';
import FitnessWizard from '@/components/FitnessWizard';
import { useUserProfile } from '@/context/UserProfileContext';
import { usePlan, PlanChoices } from '@/context/PlanContext';

interface GymSectionProps {
  sectionId: keyof PlanChoices;
  section: { options: any[] };
}

const GymSection: React.FC<GymSectionProps> = ({ sectionId, section }) => {
  const { profile, isProfileComplete } = useUserProfile();
  const { choices, updateChoice, removeChoice } = usePlan();

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [showTracker, setShowTracker] = useState(false);
  const [showFitnessWizard, setShowFitnessWizard] = useState(false);

  // stan dla rozwiniętej kafelki siłowni
  const [modalOption, setModalOption] = useState<any | null>(null);

  useEffect(() => {
    setWorkoutPlans(getWorkoutPlans());
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
  const handleEditProfile = () => setShowFitnessWizard(true);
  const handleWizardComplete = () => {
    setShowFitnessWizard(false);
    setWorkoutPlans(getWorkoutPlans());
  };

  if (showFitnessWizard) return <FitnessWizard onComplete={handleWizardComplete} />;
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
    <div className="space-y-12">
      {/* —————————————————————————————————————————————
           Pasek “Twój Plan Treningowy AI” (zawsze widoczny)
      ————————————————————————————————————————————— */}
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h2 className="text-2xl font-bold">Twój Plan Treningowy AI</h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleEditProfile}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" /> Edytuj profil
          </Button>
          <Link to="/generator-planu">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Wygeneruj nowy plan
            </Button>
          </Link>
        </div>
      </div>

      {/* —————————————————————————————————————————————
           Profil fitness (tylko gdy skonfigurowany)
      ————————————————————————————————————————————— */}
      {isProfileComplete('fitness') && (
        <Card className="max-w-4xl mx-auto bg-blue-50 border-blue-200 mb-6">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Profil Fitness</h4>
                <p className="text-sm text-blue-700">
                  {profile.gender === 'male' ? 'Mężczyzna' : 'Kobieta'},{' '}
                  {profile.age} lat, {profile.currentWeight}kg → {profile.targetWeight}kg, 
                  poziom: {profile.fitnessLevel}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditProfile}
              className="text-blue-600"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* —————————————————————————————————————————————
           Gotowy plan AI (dni treningowe)
      ————————————————————————————————————————————— */}
      {workoutPlans.length > 0 && (
        <Card className="max-w-4xl mx-auto hover:shadow-lg transition-shadow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              {workoutPlans[0].name}
            </CardTitle>
            <p className="text-gray-600">{workoutPlans[0].description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" /> Utworzony:{' '}
              {new Date(workoutPlans[0].createdAt).toLocaleDateString('pl-PL')}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {workoutPlans[0].workoutDays.map((day) => (
              <div
                key={day.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h5 className="font-medium text-gray-900">{day.name}</h5>
                  <p className="text-sm text-gray-600">
                    {day.exercises.length} ćwiczeń
                  </p>
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleStartWorkout(workoutPlans[0], day.id)}
                >
                  <Play className="h-4 w-4" /> Rozpocznij
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/*Siatka kafelków*/}
      <div className="max-w-6xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold">Wybierz Siłownię</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {section.options.map((option) => {
            const isSelected = choices[sectionId] === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setModalOption(option)}
                className={`
                  bg-white rounded-lg shadow-md cursor-pointer
                  border-2 transition-transform transform hover:scale-105
                  ${isSelected
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <h4 className="text-2xl font-semibold mb-1">{option.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                  <div className="text-lg font-bold text-red-600 mb-2">
                    {option.price}
                  </div>
                  <div className="flex items-center justify-center text-red-700 mt-2">
                    <span className="text-sm font-medium">
                      {isSelected ? 'Wybrane' : 'Szczegóły'}
                    </span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* —————————————————————————————————————————————
           Modal z detalami i przyciskami Wybierz/Anuluj
      ————————————————————————————————————————————— */}
      {modalOption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            <button
              onClick={() => setModalOption(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="text-5xl">{modalOption.icon}</div>
                <h4 className="text-2xl font-bold">{modalOption.name}</h4>
                <p className="text-gray-600">{modalOption.description}</p>
              </div>
              <ul className="space-y-2">
                {modalOption.features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="text-center text-3xl font-bold text-red-600">
                {modalOption.price}
              </div>
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-800"
                  onClick={() => {
                    updateChoice(sectionId, modalOption.id);
                    setModalOption(null);
                  }}
                >
                  Wybierz
                </Button>
                {choices[sectionId] === modalOption.id && (
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

export default GymSection;
