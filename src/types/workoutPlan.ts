
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: string;
  description?: string;
  muscleGroups: string[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  userId?: string;
  workoutDays: WorkoutDay[];
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  date: string;
  notes?: string;
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId: string;
  workoutDayId: string;
  date: string;
  exercises: ExerciseLog[];
  duration?: number;
  notes?: string;
}
