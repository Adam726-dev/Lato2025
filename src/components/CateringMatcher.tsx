import React, { useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "./FormElements";

interface CateringMatcherProps {
  dietPlan?: any;
  onComplete: () => void;
  onBack?: () => void;
}

const CateringMatcher: React.FC<CateringMatcherProps> = ({
  dietPlan,
  onComplete,
  onBack,
}) => {
  const { profile } = useUserProfile();
  const [selectedCatering, setSelectedCatering] = useState<string | null>(null);

  const getCateringRecommendations = () => {
    const recommendations = [];

    const dailyCalories = dietPlan?.dailyCalories || profile.dailyCalories;

    if (dailyCalories) {
      if (dailyCalories < 1800) {
        recommendations.push({
          name: "FitCatering Light",
          description: "Niskokaloryczne posiłki dopasowane do Twojego celu",
          calories: "1200-1800 kcal",
          price: "45-55 zł/dzień",
          features: [
            "Kontrola porcji",
            "Niskokaloryczne",
            "5 posiłków dziennie",
          ],
          match: "95%",
        });
      } else if (dailyCalories > 2500) {
        recommendations.push({
          name: "PowerCatering Pro",
          description: "Wysokoenergetyczne posiłki dla aktywnych",
          calories: "2500-3500 kcal",
          price: "65-75 zł/dzień",
          features: ["Wysokobiałkowe", "Duże porcje", "Wsparcie regeneracji"],
          match: "92%",
        });
      } else {
        recommendations.push({
          name: "BalanceCatering Standard",
          description: "Zbilansowane posiłki na każdy dzień",
          calories: "1800-2500 kcal",
          price: "55-65 zł/dzień",
          features: ["Zbilansowana dieta", "Urozmaicone menu", "4-5 posiłków"],
          match: "90%",
        });
      }
    }

    const dietPreferences = profile.dietPreferences || [];

    if (dietPreferences.includes("vegetarian")) {
      recommendations.push({
        name: "VeggieCatering",
        description: "100% roślinne posiłki pełne składników odżywczych",
        calories: "1500-2200 kcal",
        price: "50-60 zł/dzień",
        features: [
          "Wegetariańskie",
          "Ekologiczne składniki",
          "Bogactwo warzyw",
        ],
        match: "96%",
      });
    }

    if (dietPreferences.includes("keto")) {
      recommendations.push({
        name: "KetoCatering",
        description: "Niskowęglowodanowe posiłki w stylu keto",
        calories: "1600-2400 kcal",
        price: "60-70 zł/dzień",
        features: [
          "Keto-friendly",
          "Wysokotłuszczowe",
          "Minimalne węglowodany",
        ],
        match: "94%",
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        name: "HealthyCatering Classic",
        description: "Klasyczne, zdrowe posiłki na każdy dzień",
        calories: "1800-2200 kcal",
        price: "50-60 zł/dzień",
        features: ["Zdrowe składniki", "Tradycyjne smaki", "Elastyczne menu"],
        match: "85%",
      });
    }

    return recommendations.sort(
      (a, b) => parseInt(b.match) - parseInt(a.match)
    );
  };

  const recommendations = getCateringRecommendations();

  const handleSelectCatering = (cateringName: string) => {
    setSelectedCatering(cateringName);
  };

  const handleConfirm = () => {
    if (selectedCatering) {
      console.log("Wybrano catering:", selectedCatering);
    }
    onComplete();
  };

  // Mapowanie preferencji i alergii EN->PL
  const dietPreferenceMap: Record<string, string> = {
    vegetarian: "Wegetariańska",
    vegan: "Wegańska",
    keto: "Keto",
    pescatarian: "Pescowegetariańska",
    glutenFree: "Bezglutenowa",
    lowCarb: "Niskowęglowodanowa",
    highProtein: "Wysokobiałkowa",
    high_protein: "Wysokobiałkowa",
    standard: "Standardowa",
  };
  const allergyMap: Record<string, string> = {
    gluten: "Gluten",
    lactose: "Laktoza",
    laktoza: "Laktoza",
    nuts: "Orzechy",
    eggs: "Jaja",
    soy: "Soja",
    fish: "Ryby",
    shellfish: "Owoce morza",
    sesame: "Sezam",
    mustard: "Gorczyca",
    celery: "Seler",
    peanuts: "Orzeszki ziemne",
    milk: "Mleko",
    wheat: "Pszenica",
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Tło wideo diet.mp4 */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0 blur-sm brightness-75"
        src="/videos/diet.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ pointerEvents: 'none', objectFit: 'cover', minHeight: '100%', minWidth: '100%' }}
      />
      <div className="fixed inset-0 bg-black bg-opacity-40 z-10 pointer-events-none" />
      <div className="relative z-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 text-black">
              🍽️ Catering Matcher AI
            </CardTitle>
            <p className="text-center text-black">
              Na podstawie Twojego planu żywieniowego dopasowujemy idealne cateringi
            </p>
          </CardHeader>
          <CardContent>
            {dietPlan || profile.dailyCalories ? (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {dietPlan
                    ? "Twój wygenerowany plan:"
                    : "Twój profil dietetyczny:"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Kalorie dziennie:</span>
                    <p className="text-blue-700">
                      {dietPlan?.dailyCalories || profile.dailyCalories} kcal
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Posiłki dziennie:</span>
                    <p className="text-blue-700">
                      {dietPlan?.mealsPerDay ||
                        profile.mealsPerDay ||
                        "Nie określono"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Preferencje:</span>
                    <p className="text-blue-700">
                      {profile.dietPreferences &&
                      profile.dietPreferences.length > 0
                        ? profile.dietPreferences
                            .map(
                              (pref: string) => dietPreferenceMap[pref] || pref
                            )
                            .join(", ")
                        : "Standardowa"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Alergie:</span>
                    <p className="text-blue-700">
                      {profile.allergies && profile.allergies.length > 0
                        ? profile.allergies
                            .map((all: string) => allergyMap[all] || all)
                            .join(", ")
                        : "Brak"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700">
                  💡 Wypełnij najpierw profil dietetyczny, aby otrzymać lepsze
                  dopasowanie cateringów
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rekomendowane cateringi dla Ciebie:
              </h3>

              {recommendations.map((catering, index) => (
                <div
                  key={index}
                  className={`p-6 border rounded-lg cursor-pointer transition-all ${
                    selectedCatering === catering.name
                      ? "border-summer-blue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSelectCatering(catering.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {catering.name}
                        </h4>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {catering.match} dopasowanie
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{catering.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="font-medium text-gray-700">
                            Kalorie:
                          </span>
                          <p className="text-gray-900">{catering.calories}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Cena:</span>
                          <p className="text-gray-900">{catering.price}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {catering.features.map((feature, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="ml-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedCatering === catering.name
                            ? "border-summer-blue bg-summer-blue"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedCatering === catering.name && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  ← Wróć do planu
                </Button>
              )}

              <Button
                onClick={handleConfirm}
                disabled={!selectedCatering}
                className="bg-summer-blue hover:bg-summer-blue/90 ml-auto"
              >
                {selectedCatering ? "Potwierdź wybór" : "Wybierz catering"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CateringMatcher;
