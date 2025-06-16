
import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';

interface ProgressPredictorFormProps {
  onComplete: () => void;
}

const ProgressPredictorForm: React.FC<ProgressPredictorFormProps> = ({ onComplete }) => {
  const { updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    trackingGoals: [] as ('weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility')[],
    commitmentLevel: '',
    motivationType: '',
    timelineGoals: {
      oneMonth: '',
      twoMonths: '',
      summer: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {
      trackingGoals: formData.trackingGoals,
      timelineGoals: formData.timelineGoals,
    };
    
    if (formData.commitmentLevel) {
      updateData.commitmentLevel = formData.commitmentLevel;
    }
    if (formData.motivationType) {
      updateData.motivationType = formData.motivationType;
    }
    
    updateProfile(updateData);
    onComplete();
  };

  const handleTrackingGoalChange = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      trackingGoals: prev.trackingGoals.includes(goal as any)
        ? prev.trackingGoals.filter(g => g !== goal)
        : [...prev.trackingGoals, goal as any]
    }));
  };

  const trackingGoals = [
    { value: 'weight_loss', label: 'Utrata wagi' },
    { value: 'muscle_gain', label: 'Przyrost mięśni' },
    { value: 'endurance', label: 'Wytrzymałość' },
    { value: 'strength', label: 'Siła' },
    { value: 'flexibility', label: 'Elastyczność' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        📈 Progress Predictor
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        AI przewidzi Twoje rezultaty i pokaże scenariusze rozwoju na kolejne miesiące!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Które aspekty chcesz śledzić? (możesz wybrać kilka)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {trackingGoals.map((goal) => (
              <label key={goal.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.trackingGoals.includes(goal.value as any)}
                  onChange={() => handleTrackingGoalChange(goal.value)}
                  className="mr-2"
                />
                {goal.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jaki jest Twój poziom zaangażowania?
          </label>
          <select
            value={formData.commitmentLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, commitmentLevel: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wybierz poziom zaangażowania</option>
            <option value="low">Niski - 1-2 razy w tygodniu</option>
            <option value="medium">Średni - 3-4 razy w tygodniu</option>
            <option value="high">Wysoki - 5-6 razy w tygodniu</option>
            <option value="extreme">Ekstremalny - codziennie</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Co Cię najbardziej motywuje?
          </label>
          <select
            value={formData.motivationType}
            onChange={(e) => setFormData(prev => ({ ...prev, motivationType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wybierz typ motywacji</option>
            <option value="visual_progress">Wizualny postęp - zdjęcia, pomiary</option>
            <option value="data_driven">Dane - wykresy, statystyki</option>
            <option value="social_validation">Uznanie społeczne - lajki, komentarze</option>
            <option value="personal_satisfaction">Osobista satysfakcja - samopoczucie</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Wyznacz swoje cele czasowe:</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cel na 1 miesiąc:
            </label>
            <input
              type="text"
              value={formData.timelineGoals.oneMonth}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                timelineGoals: { ...prev.timelineGoals, oneMonth: e.target.value }
              }))}
              placeholder="np. schudnąć 3 kg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cel na 2 miesiące:
            </label>
            <input
              type="text"
              value={formData.timelineGoals.twoMonths}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                timelineGoals: { ...prev.timelineGoals, twoMonths: e.target.value }
              }))}
              placeholder="np. przebiec 10 km bez przerwy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cel na całe lato:
            </label>
            <input
              type="text"
              value={formData.timelineGoals.summer}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                timelineGoals: { ...prev.timelineGoals, summer: e.target.value }
              }))}
              placeholder="np. mieć wymarzoną sylwetkę na wakacje"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          Zapisz cele i preferencje śledzenia
        </button>
      </form>
    </div>
  );
};

export default ProgressPredictorForm;
