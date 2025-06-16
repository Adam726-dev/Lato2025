
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WorkoutPlan, WorkoutSession, ExerciseLog, SetLog } from '@/types/workoutPlan';
import { saveWorkoutSession, generateSessionId, getWorkoutSessions } from '@/services/workoutPlanService';
import { ArrowLeft, Check, Plus, Minus, Timer, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutTrackerProps {
  workoutPlan: WorkoutPlan;
  workoutDayId: string;
  onBack: () => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ 
  workoutPlan, 
  workoutDayId, 
  onBack 
}) => {
  const workoutDay = workoutPlan.workoutDays.find(day => day.id === workoutDayId);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [startTime] = useState(Date.now());
  const [previousSessions, setPreviousSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    const sessions = getWorkoutSessions();
    const planSessions = sessions.filter(s => s.workoutPlanId === workoutPlan.id);
    setPreviousSessions(planSessions);
  }, [workoutPlan.id]);

  if (!workoutDay) {
    return (
      <div className="text-center py-8">
        <p>Nie znaleziono dnia treningowego</p>
        <Button onClick={onBack} className="mt-4">
          Powróć do planów
        </Button>
      </div>
    );
  }

  const currentExercise = workoutDay.exercises[currentExerciseIndex];
  const currentLog = exerciseLogs.find(log => log.exerciseId === currentExercise?.id);

  const getLastExerciseData = (exerciseId: string) => {
    const sessionsWithExercise = previousSessions
      .filter(session => session.exercises.some(ex => ex.exerciseId === exerciseId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sessionsWithExercise.length === 0) return null;
    
    const lastSession = sessionsWithExercise[0];
    const exerciseData = lastSession.exercises.find(ex => ex.exerciseId === exerciseId);
    return exerciseData;
  };

  const calculateProgress = (currentSets: SetLog[], previousSets: SetLog[]) => {
    if (!previousSets || previousSets.length === 0) return null;

    const currentVolume = currentSets
      .filter(set => set.completed)
      .reduce((sum, set) => sum + (set.weight * set.reps), 0);
    
    const previousVolume = previousSets
      .filter(set => set.completed)
      .reduce((sum, set) => sum + (set.weight * set.reps), 0);

    if (previousVolume === 0) return null;

    const improvement = ((currentVolume - previousVolume) / previousVolume) * 100;
    return improvement;
  };

  const lastExerciseData = currentExercise ? getLastExerciseData(currentExercise.id) : null;

  const initializeExerciseLog = (exerciseId: string, exerciseName: string) => {
    if (!exerciseLogs.find(log => log.exerciseId === exerciseId)) {
      const newLog: ExerciseLog = {
        exerciseId,
        exerciseName,
        sets: [],
        date: new Date().toISOString(),
      };
      setExerciseLogs(prev => [...prev, newLog]);
    }
  };

  const addSet = () => {
    if (!currentExercise) return;
    
    initializeExerciseLog(currentExercise.id, currentExercise.name);
    
    setExerciseLogs(prev => prev.map(log => 
      log.exerciseId === currentExercise.id 
        ? {
            ...log,
            sets: [...log.sets, {
              setNumber: log.sets.length + 1,
              weight: 0,
              reps: 0,
              completed: false
            }]
          }
        : log
    ));
  };

  const updateSet = (setIndex: number, field: 'weight' | 'reps', value: number) => {
    if (!currentExercise) return;
    
    setExerciseLogs(prev => prev.map(log => 
      log.exerciseId === currentExercise.id 
        ? {
            ...log,
            sets: log.sets.map((set, idx) => 
              idx === setIndex ? { ...set, [field]: value } : set
            )
          }
        : log
    ));
  };

  const toggleSetCompletion = (setIndex: number) => {
    if (!currentExercise) return;
    
    setExerciseLogs(prev => prev.map(log => 
      log.exerciseId === currentExercise.id 
        ? {
            ...log,
            sets: log.sets.map((set, idx) => 
              idx === setIndex ? { ...set, completed: !set.completed } : set
            )
          }
        : log
    ));
  };

  const removeSet = (setIndex: number) => {
    if (!currentExercise) return;
    
    setExerciseLogs(prev => prev.map(log => 
      log.exerciseId === currentExercise.id 
        ? {
            ...log,
            sets: log.sets.filter((_, idx) => idx !== setIndex)
          }
        : log
    ));
  };

  const nextExercise = () => {
    if (currentExerciseIndex < workoutDay.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const finishWorkout = () => {
    const duration = Math.round((Date.now() - startTime) / 1000 / 60); // minuty
    
    const session: WorkoutSession = {
      id: generateSessionId(),
      workoutPlanId: workoutPlan.id,
      workoutDayId: workoutDay.id,
      date: new Date().toISOString(),
      exercises: exerciseLogs,
      duration,
      notes: sessionNotes
    };

    saveWorkoutSession(session);
    toast.success('Trening zapisany!', {
      description: `Ukończono trening w ${duration} minut`
    });
    onBack();
  };

  if (!currentExercise) {
    return (
      <div className="text-center py-8">
        <p>Brak ćwiczeń w tym dniu</p>
        <Button onClick={onBack} className="mt-4">
          Powróć do planów
        </Button>
      </div>
    );
  }

  const currentProgress = currentLog && lastExerciseData 
    ? calculateProgress(currentLog.sets, lastExerciseData.sets) 
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Powróć do planów
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workoutDay.name}</h1>
            <p className="text-gray-600">
              Ćwiczenie {currentExerciseIndex + 1} z {workoutDay.exercises.length}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Timer className="h-4 w-4" />
            Trening w toku
          </div>
        </div>
      </div>

      {/* Postępy z poprzedniego treningu */}
      {lastExerciseData && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              📊 Poprzedni trening - {currentExercise.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Data:</span>
                <p className="font-medium">{new Date(lastExerciseData.date).toLocaleDateString('pl-PL')}</p>
              </div>
              <div>
                <span className="text-gray-600">Serie:</span>
                <p className="font-medium">{lastExerciseData.sets.filter(s => s.completed).length} ukończonych</p>
              </div>
              <div>
                <span className="text-gray-600">Najlepszy ciężar:</span>
                <p className="font-medium">
                  {Math.max(...lastExerciseData.sets.filter(s => s.completed).map(s => s.weight), 0)} kg
                </p>
              </div>
              <div>
                <span className="text-gray-600">Całkowity volume:</span>
                <p className="font-medium">
                  {lastExerciseData.sets
                    .filter(s => s.completed)
                    .reduce((sum, set) => sum + (set.weight * set.reps), 0)} kg
                </p>
              </div>
            </div>
            
            {currentProgress !== null && (
              <div className="mt-4 flex items-center gap-2">
                {currentProgress > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">
                      +{currentProgress.toFixed(1)}% postęp objętościowy!
                    </span>
                  </>
                ) : currentProgress < 0 ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 font-medium">
                      {currentProgress.toFixed(1)}% względem poprzedniego
                    </span>
                  </>
                ) : (
                  <span className="text-gray-600">Taki sam wynik jak poprzednio</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentExercise.name}</CardTitle>
          {currentExercise.description && (
            <p className="text-gray-600">{currentExercise.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <span className="text-sm font-medium text-gray-700">Serie:</span>
              <p className="text-lg font-semibold">{currentExercise.sets}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Powtórzenia:</span>
              <p className="text-lg font-semibold">{currentExercise.reps}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Odpoczynek:</span>
              <p className="text-lg font-semibold">{currentExercise.restTime}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Partie mięśni:</span>
              <p className="text-sm">{currentExercise.muscleGroups.join(', ')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Twoje serie:</h3>
              <Button onClick={addSet} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Dodaj serię
              </Button>
            </div>

            {currentLog?.sets.map((set, index) => {
              const previousSet = lastExerciseData?.sets[index];
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium w-12">Seria {set.setNumber}</span>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Ciężar (kg):</label>
                    <Input
                      type="number"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(index, 'weight', Number(e.target.value))}
                      className="w-20"
                      min="0"
                      step="0.5"
                    />
                    {previousSet && previousSet.completed && (
                      <span className="text-xs text-gray-500">
                        (poprz: {previousSet.weight}kg)
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Powtórzenia:</label>
                    <Input
                      type="number"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(index, 'reps', Number(e.target.value))}
                      className="w-20"
                      min="0"
                    />
                    {previousSet && previousSet.completed && (
                      <span className="text-xs text-gray-500">
                        (poprz: {previousSet.reps})
                      </span>
                    )}
                  </div>
                  
                  <Button
                    variant={set.completed ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSetCompletion(index)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSet(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}

            {(!currentLog || currentLog.sets.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                Dodaj pierwszą serię, aby rozpocząć śledzenie
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={previousExercise}
          disabled={currentExerciseIndex === 0}
        >
          Poprzednie ćwiczenie
        </Button>
        
        <span className="text-sm text-gray-600">
          {currentExerciseIndex + 1} / {workoutDay.exercises.length}
        </span>
        
        {currentExerciseIndex === workoutDay.exercises.length - 1 ? (
          <Button onClick={finishWorkout} className="bg-green-600 hover:bg-green-700">
            Zakończ trening
          </Button>
        ) : (
          <Button onClick={nextExercise}>
            Następne ćwiczenie
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notatki z treningu</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Dodaj notatki z treningu..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTracker;
