import React, { useMemo } from "react";
import { getWorkoutSessions } from "../services/workoutPlanService";
import { getWorkoutPlans } from "../services/workoutPlanService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface WorkoutProgressChartProps {
  exerciseId: string;
}

const getExerciseName = (exerciseId: string): string => {
  const plans = getWorkoutPlans();
  for (const plan of plans) {
    for (const day of plan.workoutDays) {
      const exercise = day.exercises.find((ex: any) => ex.id === exerciseId || ex.exerciseId === exerciseId);
      if (exercise) return exercise.name;
    }
  }
  return exerciseId;
};

const WorkoutProgressChart: React.FC<WorkoutProgressChartProps> = ({ exerciseId }) => {
  const sessions = getWorkoutSessions();

  const exerciseName = useMemo(() => getExerciseName(exerciseId), [exerciseId]);

  const data = useMemo(() => {
    return sessions
      .filter(session => session.exercises.some(ex => ex.exerciseId === exerciseId))
      .map(session => {
        const exercise = session.exercises.find(ex => ex.exerciseId === exerciseId);
        const totalVolume = exercise
          ? exercise.sets.filter(s => s.completed).reduce((sum, set) => sum + set.weight * set.reps, 0)
          : 0;
        return {
          date: new Date(session.date).toLocaleDateString("pl-PL"),
          volume: totalVolume,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sessions, exerciseId]);

  if (data.length === 0) {
    return <div className="text-center text-gray-500">Brak danych do wyświetlenia wykresu</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Postęp: {exerciseName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: "Objętość (kg)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WorkoutProgressChart;