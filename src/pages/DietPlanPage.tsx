import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/context/UserProfileContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChefHat, Target, ArrowLeft } from "lucide-react";

export function generateDefaultWeeklyMeals(
  inputWeeklyMeals?: Record<string, any[]>
): Record<string, any[]> {
  // Unikalne przykładowe posiłki na każdy dzień tygodnia
  const weekDefaults: Record<string, any[]> = {
    Poniedziałek: [
      {
        name: "Śniadanie",
        time: "08:00",
        calories: 400,
        description: "Owsianka z owocami i orzechami",
        ingredients: ["płatki owsiane", "mleko", "banany", "orzechy włoskie"],
      },
      {
        name: "Obiad",
        time: "13:00",
        calories: 600,
        description: "Grillowany kurczak z warzywami",
        ingredients: [
          "pierś z kurczaka",
          "brokuły",
          "marchewka",
          "ryż brązowy",
        ],
      },
      {
        name: "Kolacja",
        time: "19:00",
        calories: 500,
        description: "Sałatka z łososiem",
        ingredients: [
          "łosoś wędzony",
          "mix sałat",
          "awokado",
          "pomidorki cherry",
        ],
      },
    ],
    Wtorek: [
      {
        name: "Śniadanie",
        time: "08:00",
        calories: 410,
        description: "Jajecznica z pomidorami",
        ingredients: [
          "jajka",
          "pomidory",
          "szczypiorek",
          "chleb pełnoziarnisty",
        ],
      },
      {
        name: "Obiad",
        time: "13:00",
        calories: 620,
        description: "Gulasz wołowy z kaszą",
        ingredients: ["wołowina", "kasza gryczana", "papryka", "cebula"],
      },
      {
        name: "Kolacja",
        time: "19:00",
        calories: 480,
        description: "Kanapki z pastą z tuńczyka",
        ingredients: ["tuńczyk", "jogurt naturalny", "ogórek", "pieczywo"],
      },
    ],
    Środa: [
      {
        name: "Śniadanie",
        time: "08:00",
        calories: 390,
        description: "Twaróg z rzodkiewką i szczypiorkiem",
        ingredients: ["twaróg", "rzodkiewka", "szczypiorek", "chleb żytni"],
      },
      {
        name: "Obiad",
        time: "13:00",
        calories: 630,
        description: "Pieczony dorsz z ziemniakami",
        ingredients: ["dorsz", "ziemniaki", "fasolka szparagowa", "cytryna"],
      },
      {
        name: "Kolacja",
        time: "19:00",
        calories: 470,
        description: "Sałatka grecka",
        ingredients: ["ser feta", "ogórek", "pomidor", "oliwki", "cebula"],
      },
    ],
    Czwartek: [
      {
        name: "Śniadanie",
        time: "08:00",
        calories: 420,
        description: "Omlet z warzywami",
        ingredients: ["jajka", "papryka", "szpinak", "ser żółty"],
      },
      {
        name: "Obiad",
        time: "13:00",
        calories: 610,
        description: "Kurczak curry z ryżem",
        ingredients: ["kurczak", "ryż", "mleko kokosowe", "przyprawy curry"],
      },
      {
        name: "Kolacja",
        time: "19:00",
        calories: 490,
        description: "Tosty z awokado",
        ingredients: ["awokado", "chleb pełnoziarnisty", "jajko", "rukola"],
      },
    ],
    Piątek: [
      {
        name: "Śniadanie",
        time: "08:00",
        calories: 400,
        description: "Musli z jogurtem i owocami",
        ingredients: ["musli", "jogurt naturalny", "truskawki", "borówki"],
      },
      {
        name: "Obiad",
        time: "13:00",
        calories: 650,
        description: "Spaghetti z sosem pomidorowym",
        ingredients: [
          "makaron pełnoziarnisty",
          "pomidory",
          "czosnek",
          "bazylia",
        ],
      },
      {
        name: "Kolacja",
        time: "19:00",
        calories: 480,
        description: "Sałatka z kurczakiem",
        ingredients: ["kurczak", "mix sałat", "papryka", "kukurydza"],
      },
    ],
    Sobota: [
      {
        name: "Śniadanie",
        time: "08:00",
        calories: 430,
        description: "Placuszki bananowe",
        ingredients: ["banan", "jajko", "mąka owsiana", "jogurt"],
      },
      {
        name: "Obiad",
        time: "13:00",
        calories: 670,
        description: "Łosoś pieczony z warzywami",
        ingredients: ["łosoś", "cukinia", "papryka", "ziemniaki"],
      },
      {
        name: "Kolacja",
        time: "19:00",
        calories: 500,
        description: "Wrap z hummusem",
        ingredients: ["tortilla", "hummus", "marchewka", "ogórek"],
      },
    ],
    Niedziela: [
      {
        name: "Śniadanie",
        time: "08:00",
        calories: 420,
        description: "Jajka na miękko z pieczywem",
        ingredients: ["jajka", "chleb", "masło", "szczypiorek"],
      },
      {
        name: "Obiad",
        time: "13:00",
        calories: 660,
        description: "Schab pieczony z ziemniakami",
        ingredients: ["schab", "ziemniaki", "marchewka", "pietruszka"],
      },
      {
        name: "Kolacja",
        time: "19:00",
        calories: 490,
        description: "Sałatka z tuńczykiem",
        ingredients: ["tuńczyk", "jajko", "sałata", "kukurydza"],
      },
    ],
  };
  const result: Record<string, any[]> = {};
  Object.keys(weekDefaults).forEach((day) => {
    if (
      inputWeeklyMeals &&
      inputWeeklyMeals[day] &&
      inputWeeklyMeals[day].length > 0
    ) {
      result[day] = inputWeeklyMeals[day];
    } else {
      result[day] = weekDefaults[day];
    }
  });
  return result;
}

const DietPlanPage = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const handleBack = () => {
    navigate("/dieta");
  };

  const mockPlan = {
    dailyCalories: profile.dailyCalories || 2000,
    mealsPerDay: profile.mealsPerDay || 3,
    weeklyGoal: "Zdrowe odżywianie",
    weeklyMeals: generateDefaultWeeklyMeals(),
    recommendations: [
      "Pij dużo wody - minimum 2 litry dziennie",
      "Jedz regularnie co 3-4 godziny",
      "Unikaj słodkich napojów",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Wróć do sekcji diety
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🍽️ Twój Plan Żywieniowy
            </h1>
            <p className="text-xl text-gray-600">
              Plan dopasowany do Twoich potrzeb
            </p>
          </div>
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
                    {mockPlan.dailyCalories}
                  </div>
                  <div className="text-sm text-gray-600">kcal dziennie</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockPlan.mealsPerDay}
                  </div>
                  <div className="text-sm text-gray-600">posiłki dziennie</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-sm text-gray-600">dni planu</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {mockPlan.weeklyGoal}
                  </div>
                  <div className="text-sm text-gray-600">cel tygodniowy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(mockPlan.weeklyMeals).map(
            ([day, meals]: [string, any]) => (
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}

          <Card>
            <CardHeader>
              <CardTitle>💡 Rekomendacje</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockPlan.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate("/dieta/catering")}>
            Znajdź catering
          </Button>
          <Button onClick={() => navigate("/dieta/wizard")}>
            Stwórz nowy plan
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DietPlanPage;
