
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChefHat, Target } from 'lucide-react';

interface DietPlanViewerProps {
  plan: any;
  onAccept: () => void;
  onBack: () => void;
}

const DietPlanViewer: React.FC<DietPlanViewerProps> = ({ plan, onAccept, onBack }) => {
  if (!plan) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🍽️ Twój Spersonalizowany Plan Żywieniowy
        </h1>
        <p className="text-xl text-gray-600">
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
                <div className="text-2xl font-bold text-green-600">{plan.dailyCalories || 'N/A'}</div>
                <div className="text-sm text-gray-600">kcal dziennie</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{plan.mealsPerDay || 'N/A'}</div>
                <div className="text-sm text-gray-600">posiłki dziennie</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">7</div>
                <div className="text-sm text-gray-600">dni planu</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{plan.weeklyGoal || 'Zdrowe'}</div>
                <div className="text-sm text-gray-600">cel tygodniowy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {plan.weeklyMeals && Object.entries(plan.weeklyMeals).map(([day, meals]: [string, any]) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {day}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {meals.map((meal: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
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
                      <p className="text-sm text-gray-700">{meal.description}</p>
                      {meal.ingredients && (
                        <p className="text-xs text-gray-500 mt-1">
                          Składniki: {meal.ingredients.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

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
