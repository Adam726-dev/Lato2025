
import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';

interface WeatherSmartFormProps {
  onComplete: () => void;
}

const WeatherSmartForm: React.FC<WeatherSmartFormProps> = ({ onComplete }) => {
  const { updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    weatherSensitivity: '',
    indoorAlternatives: [] as ('gym' | 'yoga_studio' | 'mall_walking' | 'home_workout')[],
    outdoorPreferences: [] as ('running' | 'cycling' | 'hiking' | 'beach_sports' | 'park_activities')[],
    temperaturePreference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {
      indoorAlternatives: formData.indoorAlternatives,
      outdoorPreferences: formData.outdoorPreferences,
    };
    
    if (formData.weatherSensitivity) {
      updateData.weatherSensitivity = formData.weatherSensitivity;
    }
    if (formData.temperaturePreference) {
      updateData.temperaturePreference = formData.temperaturePreference;
    }
    
    updateProfile(updateData);
    onComplete();
  };

  const handleIndoorChange = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      indoorAlternatives: prev.indoorAlternatives.includes(activity as any)
        ? prev.indoorAlternatives.filter(a => a !== activity)
        : [...prev.indoorAlternatives, activity as any]
    }));
  };

  const handleOutdoorChange = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      outdoorPreferences: prev.outdoorPreferences.includes(activity as any)
        ? prev.outdoorPreferences.filter(a => a !== activity)
        : [...prev.outdoorPreferences, activity as any]
    }));
  };

  const indoorActivities = [
    { value: 'gym', label: 'Siłownia' },
    { value: 'yoga_studio', label: 'Studio jogi' },
    { value: 'mall_walking', label: 'Spacery w galerii' },
    { value: 'home_workout', label: 'Trening w domu' }
  ];

  const outdoorActivities = [
    { value: 'running', label: 'Bieganie' },
    { value: 'cycling', label: 'Jazda na rowerze' },
    { value: 'hiking', label: 'Hiking/wędrówki' },
    { value: 'beach_sports', label: 'Sporty plażowe' },
    { value: 'park_activities', label: 'Aktywności w parku' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🌤️ Weather-Smart Planner
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        AI będzie dostosowywać Twój plan do aktualnej pogody i Twoich preferencji!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jak bardzo pogoda wpływa na Twoje plany?
          </label>
          <select
            value={formData.weatherSensitivity}
            onChange={(e) => setFormData(prev => ({ ...prev, weatherSensitivity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wybierz wrażliwość na pogodę</option>
            <option value="high">Wysoka - pogoda bardzo wpływa na moje plany</option>
            <option value="medium">Średnia - dostosowuję się do pogody</option>
            <option value="low">Niska - pogoda mnie nie powstrzyma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Jakie aktywności indoor preferujesz w złą pogodę? (możesz wybrać kilka)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {indoorActivities.map((activity) => (
              <label key={activity.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.indoorAlternatives.includes(activity.value as any)}
                  onChange={() => handleIndoorChange(activity.value)}
                  className="mr-2"
                />
                {activity.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Jakie aktywności outdoor lubisz w dobrej pogodzie? (możesz wybrać kilka)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {outdoorActivities.map((activity) => (
              <label key={activity.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.outdoorPreferences.includes(activity.value as any)}
                  onChange={() => handleOutdoorChange(activity.value)}
                  className="mr-2"
                />
                {activity.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jaką temperaturę preferujesz do aktywności?
          </label>
          <select
            value={formData.temperaturePreference}
            onChange={(e) => setFormData(prev => ({ ...prev, temperaturePreference: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wybierz preferencje temperaturowe</option>
            <option value="hot">Gorąco (25°C+) - uwielbiam upał</option>
            <option value="mild">Łagodnie (18-25°C) - idealna temperatura</option>
            <option value="cool">Chłodno (10-18°C) - lepiej mi się ćwiczy</option>
            <option value="any">Wszystko jedno - dostosowuję się</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          Zapisz preferencje pogodowe
        </button>
      </form>
    </div>
  );
};

export default WeatherSmartForm;
