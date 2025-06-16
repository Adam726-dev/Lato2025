import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';

interface ActivityProfileFormProps {
  onComplete: () => void;
}

const ActivityProfileForm: React.FC<ActivityProfileFormProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    personalityType: profile.personalityType || '' as '' | 'introvert' | 'extrovert' | 'ambivert',
    activityPreferences: profile.activityPreferences || [] as ('outdoor' | 'indoor' | 'cultural' | 'sports' | 'social' | 'relaxing')[],
    energyLevel: profile.energyLevel || '' as '' | 'low' | 'medium' | 'high',
    socialPreference: profile.socialPreference || '' as '' | 'alone' | 'small_group' | 'large_group' | 'any',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {
      activityPreferences: formData.activityPreferences,
    };
    
    if (formData.personalityType) {
      updateData.personalityType = formData.personalityType;
    }
    if (formData.energyLevel) {
      updateData.energyLevel = formData.energyLevel;
    }
    if (formData.socialPreference) {
      updateData.socialPreference = formData.socialPreference;
    }
    
    updateProfile(updateData);
    onComplete();
  };

  const handleActivityPreferenceChange = (preference: 'outdoor' | 'indoor' | 'cultural' | 'sports' | 'social' | 'relaxing') => {
    setFormData(prev => ({
      ...prev,
      activityPreferences: prev.activityPreferences.includes(preference)
        ? prev.activityPreferences.filter(p => p !== preference)
        : [...prev.activityPreferences, preference]
    }));
  };

  const personalityTypes = [
    { value: 'introvert', label: 'Introweryk - preferuję spokojne aktywności' },
    { value: 'extrovert', label: 'Ekstrawertyk - uwielbiam towarzyskie imprezy' },
    { value: 'ambivert', label: 'Ambiwertyk - zależy od nastroju' }
  ];

  const activities = [
    { value: 'outdoor', label: 'Aktywności na świeżym powietrzu' },
    { value: 'indoor', label: 'Aktywności w pomieszczeniach' },
    { value: 'cultural', label: 'Wydarzenia kulturalne' },
    { value: 'sports', label: 'Sport i aktywność fizyczna' },
    { value: 'social', label: 'Spotkania towarzyskie' },
    { value: 'relaxing', label: 'Relaks i odpoczynek' }
  ];

  const energyLevels = [
    { value: 'low', label: 'Niska - preferuję spokojne aktywności' },
    { value: 'medium', label: 'Średnia - mix aktywności i relaksu' },
    { value: 'high', label: 'Wysoka - lubię intensywne przeżycia' }
  ];

  const socialPreferences = [
    { value: 'alone', label: 'Solo - lubię być sam/sama' },
    { value: 'small_group', label: 'Mała grupa (2-4 osoby)' },
    { value: 'large_group', label: 'Duża grupa (5+ osób)' },
    { value: 'any', label: 'Bez preferencji' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Weekend Activity Optimizer</h2>
        <p className="text-gray-600">AI dopasuje idealne imprezy do Twojego stylu życia</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Typ osobowości</label>
          <div className="space-y-2">
            {personalityTypes.map((type) => (
              <label key={type.value} className="flex items-center">
                <input
                  type="radio"
                  value={type.value}
                  checked={formData.personalityType === type.value}
                  onChange={(e) => setFormData({ ...formData, personalityType: e.target.value as 'introvert' | 'extrovert' | 'ambivert' })}
                  className="mr-2"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Preferowane aktywności (wybierz wszystkie, które Cię interesują)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activities.map((activity) => (
              <label key={activity.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.activityPreferences.includes(activity.value as 'outdoor' | 'indoor' | 'cultural' | 'sports' | 'social' | 'relaxing')}
                  onChange={() => handleActivityPreferenceChange(activity.value as 'outdoor' | 'indoor' | 'cultural' | 'sports' | 'social' | 'relaxing')}
                  className="mr-2"
                />
                {activity.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Poziom energii w weekendy</label>
          <div className="space-y-2">
            {energyLevels.map((level) => (
              <label key={level.value} className="flex items-center">
                <input
                  type="radio"
                  value={level.value}
                  checked={formData.energyLevel === level.value}
                  onChange={(e) => setFormData({ ...formData, energyLevel: e.target.value as 'low' | 'medium' | 'high' })}
                  className="mr-2"
                />
                {level.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Preferencje społeczne</label>
          <div className="space-y-2">
            {socialPreferences.map((pref) => (
              <label key={pref.value} className="flex items-center">
                <input
                  type="radio"
                  value={pref.value}
                  checked={formData.socialPreference === pref.value}
                  onChange={(e) => setFormData({ ...formData, socialPreference: e.target.value as 'alone' | 'small_group' | 'large_group' | 'any' })}
                  className="mr-2"
                />
                {pref.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-summer-purple hover:bg-summer-purple/90 text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          🎯 Aktywuj Weekend Activity Optimizer
        </button>
      </form>
    </div>
  );
};

export default ActivityProfileForm;
