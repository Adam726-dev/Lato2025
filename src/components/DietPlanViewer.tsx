import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChefHat, Target } from "lucide-react";

interface DietPlanViewerProps {
  plan: any;
  onAccept: () => void;
  onBack: () => void;
}

const DIET_EN_TO_PL: Record<string, string> = {
  vegetarian: "Wegetariańska",
  vegan: "Wegańska",
  keto: "Ketogeniczna",
  paleo: "Paleo",
  mediterranean: "Śródziemnomorska",
};

const renderDiet = (diet: string) => DIET_EN_TO_PL[diet] || diet;

const DAYS_PL = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];
const DAYS_EN_TO_PL: Record<string, string> = {
  Monday: "Poniedziałek",
  Tuesday: "Wtorek",
  Wednesday: "Środa",
  Thursday: "Czwartek",
  Friday: "Piątek",
  Saturday: "Sobota",
  Sunday: "Niedziela",
};

const DietPlanViewer: React.FC<DietPlanViewerProps> = ({
  plan,
  onAccept,
  onBack,
}) => {
  if (!plan) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          🍽️ Twój Spersonalizowany Plan Żywieniowy
        </h1>
        <p className="text-xl text-gray-200">
          Plan stworzony przez AI na podstawie Twoich potrzeb i preferencji
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Podsumowanie Planu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {plan.dailyCalories || "N/A"}
                </div>
                <div className="text-sm text-gray-600">kcal dziennie</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {plan.mealsPerDay || "N/A"}
                </div>
                <div className="text-sm text-gray-600">posiłki dziennie</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">7</div>
                <div className="text-sm text-gray-600">dni planu</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {plan.weeklyGoal || "Zdrowe"}
                </div>
                <div className="text-sm text-gray-600">cel tygodniowy</div>
              </div>
            </div>
            {plan.dietPreferences && plan.dietPreferences.length > 0 && (
              <div className="mt-4 text-center">
                <span className="font-semibold text-gray-700">
                  Preferencje dietetyczne:{" "}
                </span>
                {plan.dietPreferences.map((diet: string, idx: number) => (
                  <span key={diet}>
                    {renderDiet(diet)}
                    {idx < plan.dietPreferences.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {DAYS_PL.map((dayPl) => {
          // Pobierz posiłki zarówno po polskim, jak i angielskim kluczu
          const dayEn = Object.keys(DAYS_EN_TO_PL).find(
            (en) => DAYS_EN_TO_PL[en] === dayPl
          );
          let meals = null;
          if (plan.weeklyMeals) {
            meals = plan.weeklyMeals[dayPl] || plan.weeklyMeals[dayEn] || [];
          }
          return (
            <Card key={dayPl}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {dayPl}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {meals && meals.length > 0 ? (
                    meals.map((meal: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ChefHat className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{meal.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{meal.time}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {meal.calories} kcal
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            {meal.description}
                          </p>
                          {meal.ingredients && (
                            <p className="text-xs text-gray-500 mt-1">
                              Składniki: {meal.ingredients.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 italic text-center py-4">
                      Brak zaplanowanych posiłków na ten dzień
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {plan.recommendations && (
          <Card>
            <CardHeader>
              <CardTitle>💡 Rekomendacje AI</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Wróć do kreatora
        </Button>
        <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
          Akceptuj plan i przejdź dalej →
        </Button>
      </div>
    </div>
  );
};

export default DietPlanViewer;
