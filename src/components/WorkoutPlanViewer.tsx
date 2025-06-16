
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkoutPlan } from '@/types/workoutPlan';
import { getWorkoutPlans } from '@/services/workoutPlanService';
import { Play, Calendar, Dumbbell } from 'lucide-react';
import WorkoutTracker from './WorkoutTracker';

const WorkoutPlanViewer: React.FC = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showTracker, setShowTracker] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string>('');

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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moje Plany Treningowe</h1>
        <p className="text-gray-600">Wybierz plan i rozpocznij trening</p>
      </div>

      {workoutPlans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Brak planów treningowych
            </h3>
            <p className="text-gray-600 mb-4">
              Najpierw wygeneruj plan treningowy w sekcji "Siłownia"
            </p>
            <Button variant="outline">
              Przejdź do generatora planów
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workoutPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600">{plan.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Utworzony: {new Date(plan.createdAt).toLocaleDateString('pl-PL')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Dni treningowe:</h4>
                  {plan.workoutDays.map((day) => (
                    <div key={day.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{day.name}</h5>
                        <p className="text-sm text-gray-600">
                          {day.exercises.length} ćwiczeń
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartWorkout(plan, day.id)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanViewer;
