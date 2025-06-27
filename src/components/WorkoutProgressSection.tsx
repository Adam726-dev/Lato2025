import React, { useState, useMemo } from "react";
import { getWorkoutSessions, getWorkoutPlans } from "../services/workoutPlanService";
import WorkoutProgressChart from "./WorkoutProgressChart";

const getAllExercises = () => {
  const plans = getWorkoutPlans();
  const exercises: { id: string; name: string }[] = [];
  for (const plan of plans) {
    for (const day of plan.workoutDays) {
      for (const ex of day.exercises) {
  if (!exercises.some(e => e.id === ex.id)) {
    exercises.push({ id: ex.id, name: ex.name });
  }
      }
    }
  }
  return exercises;
};

const WorkoutProgressSection: React.FC = () => {
  const exercises = useMemo(getAllExercises, []);
  const [selectedId, setSelectedId] = useState(exercises[0]?.id || "");

  if (exercises.length === 0) {
    return <div>Brak ćwiczeń do wyświetlenia postępów.</div>;
  }

  return (
    <div>
      <label htmlFor="exercise-select" className="block mb-2 text-white drop-shadow-lg font-semibold text-xl">Wybierz ćwiczenie:</label>
      <select
        id="exercise-select"
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
        className="mb-6 border rounded px-2 py-1"
      >
        {exercises.map(ex => (
          <option key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>
      <WorkoutProgressChart exerciseId={selectedId} />
    </div>
  );
};

export default WorkoutProgressSection;