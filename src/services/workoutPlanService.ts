
import { WorkoutPlan, WorkoutSession, ExerciseLog } from '@/types/workoutPlan';

const WORKOUT_PLANS_KEY = 'workout-plans';
const WORKOUT_SESSIONS_KEY = 'workout-sessions';

export const saveWorkoutPlan = (plan: WorkoutPlan): void => {
  const existingPlans = getWorkoutPlans();
  const updatedPlans = existingPlans.filter(p => p.id !== plan.id);
  updatedPlans.push(plan);
  localStorage.setItem(WORKOUT_PLANS_KEY, JSON.stringify(updatedPlans));
};


export const getWorkoutPlans = (): WorkoutPlan[] => {
  const plans = localStorage.getItem(WORKOUT_PLANS_KEY);
  return plans ? JSON.parse(plans) : [];
};

export const getWorkoutPlan = (planId: string): WorkoutPlan | null => {
  const plans = getWorkoutPlans();
  return plans.find(p => p.id === planId) || null;
};

export const deleteWorkoutPlan = (planId: string): void => {
  const plans = getWorkoutPlans();
  const filteredPlans = plans.filter(p => p.id !== planId);
  localStorage.setItem(WORKOUT_PLANS_KEY, JSON.stringify(filteredPlans));
};

export const saveWorkoutSession = (session: WorkoutSession): void => {
  const existingSessions = getWorkoutSessions();
  const updatedSessions = existingSessions.filter(s => s.id !== session.id);
  updatedSessions.push(session);
  localStorage.setItem(WORKOUT_SESSIONS_KEY, JSON.stringify(updatedSessions));
};

export const getWorkoutSessions = (): WorkoutSession[] => {
  const sessions = localStorage.getItem(WORKOUT_SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const getWorkoutSessionsForPlan = (planId: string): WorkoutSession[] => {
  const sessions = getWorkoutSessions();
  return sessions.filter(s => s.workoutPlanId === planId);
};

export const generateWorkoutPlanId = (): string => {
  return `workout-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
