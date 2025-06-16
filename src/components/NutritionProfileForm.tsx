import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';

interface NutritionProfileFormProps {
  onComplete: () => void;
}

const NutritionProfileForm: React.FC<NutritionProfileFormProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    allergies: profile.allergies?.join(', ') || '',
    dietPreferences: profile.dietPreferences || [],
    dailyCalories: profile.dailyCalories || '',
    mealsPerDay: profile.mealsPerDay || 3,
    dislikedIngredients: profile.dislikedIngredients?.join(', ') || '',
    cookingTime: profile.cookingTime || 'medium',
  });

  const handleDietToggle = (diet: string) => {
    const diets = formData.dietPreferences.includes(diet as any)
      ? formData.dietPreferences.filter(d => d !== diet)
      : [...formData.dietPreferences, diet as any];
    setFormData({ ...formData, dietPreferences: diets });
  };

  const calculateBMR = () => {
    if (profile.currentWeight && profile.height && profile.age && profile.gender) {
      let bmr;
      if (profile.gender === 'male') {
        bmr = 88.362 + (13.397 * profile.currentWeight) + (4.799 * profile.height) - (5.677 * profile.age);
      } else {
        bmr = 447.593 + (9.247 * profile.currentWeight) + (3.098 * profile.height) - (4.330 * profile.age);
      }
      
      const activityMultiplier = profile.trainingDays && profile.trainingDays >= 5 ? 1.7 : 
                                 profile.trainingDays && profile.trainingDays >= 3 ? 1.5 : 1.3;
      
      return Math.round(bmr * activityMultiplier);
    }
    return null;
  };

  const suggestedCalories = calculateBMR();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      dietPreferences: formData.dietPreferences,
      dailyCalories: Number(formData.dailyCalories),
      mealsPerDay: formData.mealsPerDay,
      dislikedIngredients: formData.dislikedIngredients ? formData.dislikedIngredients.split(',').map(i => i.trim()) : [],
      cookingTime: formData.cookingTime as 'quick' | 'medium' | 'elaborate',
    });
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🥗 Profil Żywieniowy - Smart Meal Planner
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alergie i nietolerancje (oddziel przecinkami)
          </label>
          <input
            type="text"
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            placeholder="np. gluten, laktoza, orzechy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferencje dietetyczne</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'vegetarian', label: 'Wegetariańska' },
              { value: 'vegan', label: 'Wegańska' },
              { value: 'keto', label: 'Ketogeniczna' },
              { value: 'paleo', label: 'Paleo' },
              { value: 'mediterranean', label: 'Śródziemnomorska' }
            ].map((diet) => (
              <label key={diet.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dietPreferences.includes(diet.value as any)}
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
            onChange={(e) => setFormData({ ...formData, dailyCalories: e.target.value })}
            placeholder={suggestedCalories ? suggestedCalories.toString() : "2000"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {suggestedCalories && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, dailyCalories: suggestedCalories.toString() })}
              className="mt-1 text-sm text-blue-600 hover:text-blue-800"
            >
              Użyj sugerowanej wartości
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liczba posiłków dziennie
          </label>
          <select
            value={formData.mealsPerDay}
            onChange={(e) => setFormData({ ...formData, mealsPerDay: Number(e.target.value) })}
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
            onChange={(e) => setFormData({ ...formData, dislikedIngredients: e.target.value })}
            placeholder="np. brokuły, ryby, grzyby"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Czas na gotowanie</label>
          <div className="flex space-x-4">
            {[
              { value: 'quick', label: 'Szybko (do 20 min)' },
              { value: 'medium', label: 'Średnio (20-45 min)' },
              { value: 'elaborate', label: 'Długo (45+ min)' }
            ].map((time) => (
              <label key={time.value} className="flex items-center">
                <input
                  type="radio"
                  value={time.value}
                  checked={formData.cookingTime === time.value}
                  onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value as 'quick' | 'medium' | 'elaborate' })}
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
          🍽️ Zapisz profil i przejdź do opcji
        </button>
      </form>
    </div>
  );
};

export default NutritionProfileForm;
