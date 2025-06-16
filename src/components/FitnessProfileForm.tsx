
import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { UserProfile } from '@/types/userProfile';

interface FitnessProfileFormProps {
  onComplete: () => void;
}

const FitnessProfileForm: React.FC<FitnessProfileFormProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    currentWeight: profile.currentWeight || '',
    targetWeight: profile.targetWeight || '',
    height: profile.height || '',
    age: profile.age || '',
    gender: profile.gender || '',
    fitnessLevel: profile.fitnessLevel || '',
    fitnessGoals: profile.fitnessGoals || [],
    injuries: profile.injuries?.join(', ') || '',
    trainingDays: profile.trainingDays || 3,
  });

  const handleGoalToggle = (goal: string) => {
    const goals = formData.fitnessGoals.includes(goal as any)
      ? formData.fitnessGoals.filter(g => g !== goal)
      : [...formData.fitnessGoals, goal as any];
    setFormData({ ...formData, fitnessGoals: goals });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      currentWeight: Number(formData.currentWeight),
      targetWeight: Number(formData.targetWeight),
      height: Number(formData.height),
      age: Number(formData.age),
      gender: formData.gender as 'male' | 'female',
      fitnessLevel: formData.fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
      fitnessGoals: formData.fitnessGoals,
      injuries: formData.injuries ? formData.injuries.split(',').map(i => i.trim()) : [],
      trainingDays: formData.trainingDays,
    });
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🏋️‍♀️ Profil Fitness - Personal Trainer AI
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obecna waga (kg)
            </label>
            <input
              type="number"
              value={formData.currentWeight}
              onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Docelowa waga (kg)
            </label>
            <input
              type="number"
              value={formData.targetWeight}
              onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wzrost (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wiek
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Płeć</label>
          <div className="flex space-x-4">
            {['male', 'female'].map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  type="radio"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mr-2"
                  required
                />
                {gender === 'male' ? 'Mężczyzna' : 'Kobieta'}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poziom zaawansowania</label>
          <select
            value={formData.fitnessLevel}
            onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Wybierz poziom</option>
            <option value="beginner">Początkujący</option>
            <option value="intermediate">Średnio zaawansowany</option>
            <option value="advanced">Zaawansowany</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cele treningowe (wybierz wszystkie)</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'weight_loss', label: 'Utrata wagi' },
              { value: 'muscle_gain', label: 'Budowa mięśni' },
              { value: 'endurance', label: 'Wytrzymałość' },
              { value: 'strength', label: 'Siła' }
            ].map((goal) => (
              <label key={goal.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.fitnessGoals.includes(goal.value as any)}
                  onChange={() => handleGoalToggle(goal.value)}
                  className="mr-2"
                />
                {goal.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kontuzje/ograniczenia (opcjonalne)
          </label>
          <input
            type="text"
            value={formData.injuries}
            onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
            placeholder="np. problemy z kolanami, ból pleców"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ile dni w tygodniu chcesz trenować?
          </label>
          <input
            type="range"
            min="1"
            max="7"
            value={formData.trainingDays}
            onChange={(e) => setFormData({ ...formData, trainingDays: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 mt-1">
            {formData.trainingDays} {formData.trainingDays === 1 ? 'dzień' : 'dni'} w tygodniu
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          💪 Zapisz profil i przejdź do opcji
        </button>
      </form>
    </div>
  );
};

export default FitnessProfileForm;
