import React, { useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface NutritionProfileFormProps {
  onComplete: () => void;
}

const DIET_EN_TO_PL: Record<string, string> = {
  vegetarian: "Wegetariańska",
  vegan: "Wegańska",
  keto: "Ketogeniczna",
  paleo: "Paleo",
  mediterranean: "Śródziemnomorska",
};
const DIET_PL_TO_EN: Record<string, string> = {
  Wegetariańska: "vegetarian",
  Wegańska: "vegan",
  Ketogeniczna: "keto",
  Paleo: "paleo",
  Śródziemnomorska: "mediterranean",
};
const DIET_OPTIONS = [
  { value: "Wegetariańska", label: "Wegetariańska" },
  { value: "Wegańska", label: "Wegańska" },
  { value: "Ketogeniczna", label: "Ketogeniczna" },
  { value: "Paleo", label: "Paleo" },
  { value: "Śródziemnomorska", label: "Śródziemnomorska" },
];
const COOKING_TIME_OPTIONS = [
  { value: "szybko", label: "Szybko (do 20 min)" },
  { value: "średnio", label: "Średnio (20-45 min)" },
  { value: "długo", label: "Długo (45+ min)" },
];

const mapDietToPL = (d: string) => DIET_EN_TO_PL[d] || d;
const mapDietToEN = (d: string) => DIET_PL_TO_EN[d] || d;
const COOKING_TIME_PL_TO_EN: Record<string, string> = {
  szybko: "quick",
  średnio: "medium",
  długo: "elaborate",
};

const NutritionProfileForm: React.FC<NutritionProfileFormProps> = ({
  onComplete,
}) => {
  const { profile, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    allergies: profile.allergies?.join(", ") || "",
    dietPreferences: Array.isArray(profile.dietPreferences)
      ? profile.dietPreferences.map(mapDietToPL)
      : [],
    dailyCalories: profile.dailyCalories || "",
    mealsPerDay: profile.mealsPerDay || 3,
    dislikedIngredients: profile.dislikedIngredients?.join(", ") || "",
    cookingTime: profile.cookingTime || "średnio",
  });

  const handleDietToggle = (diet: string) => {
    const diets = formData.dietPreferences.includes(diet)
      ? formData.dietPreferences.filter((d) => d !== diet)
      : [...formData.dietPreferences, diet];
    setFormData({ ...formData, dietPreferences: diets });
  };

  const calculateBMR = () => {
    if (
      profile.currentWeight &&
      profile.height &&
      profile.age &&
      profile.gender
    ) {
      let bmr;
      if (profile.gender === "male") {
        bmr =
          88.362 +
          13.397 * profile.currentWeight +
          4.799 * profile.height -
          5.677 * profile.age;
      } else {
        bmr =
          447.593 +
          9.247 * profile.currentWeight +
          3.098 * profile.height -
          4.33 * profile.age;
      }

      const activityMultiplier =
        profile.trainingDays && profile.trainingDays >= 5
          ? 1.7
          : profile.trainingDays && profile.trainingDays >= 3
          ? 1.5
          : 1.3;

      return Math.round(bmr * activityMultiplier);
    }
    return null;
  };

  const suggestedCalories = calculateBMR();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      allergies: formData.allergies
        ? formData.allergies.split(",").map((a) => a.trim())
        : [],
      dietPreferences: formData.dietPreferences.map(mapDietToEN) as (
        | "vegetarian"
        | "vegan"
        | "keto"
        | "paleo"
        | "mediterranean"
      )[],
      dailyCalories: Number(formData.dailyCalories),
      mealsPerDay: formData.mealsPerDay,
      dislikedIngredients: formData.dislikedIngredients
        ? formData.dislikedIngredients.split(",").map((i) => i.trim())
        : [],
      cookingTime: (COOKING_TIME_PL_TO_EN[formData.cookingTime] || "medium") as
        | "quick"
        | "medium"
        | "elaborate",
    });
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🥗 Profil żywieniowy – Smart Meal Planner
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alergie i nietolerancje pokarmowe (oddziel przecinkami)
          </label>
          <input
            type="text"
            value={formData.allergies}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            placeholder="np. gluten, laktoza, orzechy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferencje dietetyczne
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DIET_OPTIONS.map((diet) => (
              <label key={diet.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dietPreferences.includes(diet.value)}
                  onChange={() => handleDietToggle(diet.value)}
                  className="mr-2"
                />
                {diet.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dzienna liczba kalorii
            {suggestedCalories && (
              <span className="text-sm text-blue-600 ml-2">
                (sugerowane: {suggestedCalories} kcal)
              </span>
            )}
          </label>
          <input
            type="number"
            value={formData.dailyCalories}
            onChange={(e) =>
              setFormData({ ...formData, dailyCalories: e.target.value })
            }
            placeholder={
              suggestedCalories ? suggestedCalories.toString() : "2000"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {suggestedCalories && (
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  dailyCalories: suggestedCalories.toString(),
                })
              }
              className="mt-1 text-sm text-blue-600 hover:text-blue-800"
            >
              Ustaw sugerowaną wartość
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liczba posiłków dziennie
          </label>
          <select
            value={formData.mealsPerDay}
            onChange={(e) =>
              setFormData({ ...formData, mealsPerDay: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={3}>3 posiłki</option>
            <option value={4}>4 posiłki</option>
            <option value={5}>5 posiłków</option>
            <option value={6}>6 posiłków</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nielubiane składniki (oddziel przecinkami)
          </label>
          <input
            type="text"
            value={formData.dislikedIngredients}
            onChange={(e) =>
              setFormData({ ...formData, dislikedIngredients: e.target.value })
            }
            placeholder="np. brokuły, ryby, grzyby"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Czas na przygotowanie posiłków
          </label>
          <div className="flex space-x-4">
            {COOKING_TIME_OPTIONS.map((time) => (
              <label key={time.value} className="flex items-center">
                <input
                  type="radio"
                  value={time.value}
                  checked={formData.cookingTime === time.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cookingTime: e.target.value,
                    })
                  }
                  className="mr-2"
                />
                {time.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          🍽️ Zapisz profil i przejdź dalej
        </button>
      </form>
    </div>
  );
};

export default NutritionProfileForm;
