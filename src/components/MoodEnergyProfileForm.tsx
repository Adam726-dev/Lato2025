import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';

interface MoodEnergyProfileFormProps {
  onComplete: () => void;
}

const MoodEnergyProfileForm: React.FC<MoodEnergyProfileFormProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    sleepHours: profile.sleepHours || '',
    stressLevel: profile.stressLevel || '' as '' | 'low' | 'medium' | 'high',
    workLifeBalance: profile.workLifeBalance || '' as '' | 'poor' | 'okay' | 'good' | 'excellent',
    currentMood: profile.currentMood || '' as '' | 'energetic' | 'tired' | 'stressed' | 'happy' | 'neutral',
    restDaysPreference: profile.restDaysPreference || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {};
    
    if (formData.sleepHours) {
      updateData.sleepHours = Number(formData.sleepHours);
    }
    if (formData.restDaysPreference) {
      updateData.restDaysPreference = Number(formData.restDaysPreference);
    }
    if (formData.stressLevel) {
      updateData.stressLevel = formData.stressLevel;
    }
    if (formData.workLifeBalance) {
      updateData.workLifeBalance = formData.workLifeBalance;
    }
    if (formData.currentMood) {
      updateData.currentMood = formData.currentMood;
    }
    
    updateProfile(updateData);
    onComplete();
  };

  const stressLevels = [
    { value: 'low', label: 'Niski - czuję się zrelaksowany/a' },
    { value: 'medium', label: 'Średni - czasem się stresuję' },
    { value: 'high', label: 'Wysoki - często jestem pod presją' }
  ];

  const workLifeBalances = [
    { value: 'poor', label: 'Słaby - praca dominuje moje życie' },
    { value: 'okay', label: 'W porządku - staram się balansować' },
    { value: 'good', label: 'Dobry - mam czas na siebie' },
    { value: 'excellent', label: 'Doskonały - świetnie balansuję' }
  ];

  const moods = [
    { value: 'energetic', label: 'Pełen/na energii' },
    { value: 'happy', label: 'Szczęśliwy/wa' },
    { value: 'neutral', label: 'Neutralny/na' },
    { value: 'tired', label: 'Zmęczony/na' },
    { value: 'stressed', label: 'Zestresowany/na' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mood & Energy Tracker</h2>
        <p className="text-gray-600">AI będzie dostosowywać Twój plan do codziennego samopoczucia</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="sleep" className="block text-sm font-medium text-gray-700 mb-1">Ile godzin śpisz średnio na noc?</label>
          <input
            id="sleep"
            type="number"
            min="4"
            max="12"
            value={formData.sleepHours}
            onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
            placeholder="np. 7"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Obecny poziom stresu</label>
          <div className="space-y-2">
            {stressLevels.map((level) => (
              <label key={level.value} className="flex items-center">
                <input
                  type="radio"
                  value={level.value}
                  checked={formData.stressLevel === level.value}
                  onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value as 'low' | 'medium' | 'high' })}
                  className="mr-2"
                />
                {level.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Work-life balance</label>
          <div className="space-y-2">
            {workLifeBalances.map((balance) => (
              <label key={balance.value} className="flex items-center">
                <input
                  type="radio"
                  value={balance.value}
                  checked={formData.workLifeBalance === balance.value}
                  onChange={(e) => setFormData({ ...formData, workLifeBalance: e.target.value as 'poor' | 'okay' | 'good' | 'excellent' })}
                  className="mr-2"
                />
                {balance.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Jak się dziś czujesz?</label>
          <div className="space-y-2">
            {moods.map((mood) => (
              <label key={mood.value} className="flex items-center">
                <input
                  type="radio"
                  value={mood.value}
                  checked={formData.currentMood === mood.value}
                  onChange={(e) => setFormData({ ...formData, currentMood: e.target.value as 'energetic' | 'tired' | 'stressed' | 'happy' | 'neutral' })}
                  className="mr-2"
                />
                {mood.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="restDays" className="block text-sm font-medium text-gray-700 mb-1">Ile dni odpoczynku w tygodniu preferujesz?</label>
          <input
            id="restDays"
            type="number"
            min="0"
            max="7"
            value={formData.restDaysPreference}
            onChange={(e) => setFormData({ ...formData, restDaysPreference: e.target.value })}
            placeholder="np. 2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-summer-blue to-summer-mint text-white py-3 px-4 rounded-md font-medium transition-colors hover:from-summer-blue/90 hover:to-summer-mint/90"
        >
          📊 Aktywuj Mood & Energy Tracker
        </button>
      </form>
    </div>
  );
};

export default MoodEnergyProfileForm;
