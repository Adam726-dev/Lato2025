
import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';

interface SocialCompanionFormProps {
  onComplete: () => void;
}

const SocialCompanionForm: React.FC<SocialCompanionFormProps> = ({ onComplete }) => {
  const { updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    lookingForCompanions: false,
    companionPreferences: [] as ('workout_buddy' | 'party_partner' | 'travel_companion' | 'diet_accountability')[],
    teamChallengeInterest: '',
    socialGoals: [] as ('motivation' | 'accountability' | 'fun' | 'learning')[],
    communicationStyle: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {
      lookingForCompanions: formData.lookingForCompanions,
      companionPreferences: formData.companionPreferences,
      socialGoals: formData.socialGoals,
    };
    
    if (formData.teamChallengeInterest) {
      updateData.teamChallengeInterest = formData.teamChallengeInterest;
    }
    if (formData.communicationStyle) {
      updateData.communicationStyle = formData.communicationStyle;
    }
    
    updateProfile(updateData);
    onComplete();
  };

  const handleCompanionPreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      companionPreferences: prev.companionPreferences.includes(preference as any)
        ? prev.companionPreferences.filter(p => p !== preference)
        : [...prev.companionPreferences, preference as any]
    }));
  };

  const handleSocialGoalChange = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      socialGoals: prev.socialGoals.includes(goal as any)
        ? prev.socialGoals.filter(g => g !== goal)
        : [...prev.socialGoals, goal as any]
    }));
  };

  const companionTypes = [
    { value: 'workout_buddy', label: 'Partner treningowy' },
    { value: 'party_partner', label: 'Kompan do imprez' },
    { value: 'travel_companion', label: 'Towarzysz podróży' },
    { value: 'diet_accountability', label: 'Wsparcie w diecie' }
  ];

  const socialGoals = [
    { value: 'motivation', label: 'Motywacja' },
    { value: 'accountability', label: 'Odpowiedzialność' },
    { value: 'fun', label: 'Zabawa' },
    { value: 'learning', label: 'Nauka' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🤝 Social Companion Matcher
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        AI pomoże Ci znaleźć idealne towarzystwo do realizacji Twoich planów na lato!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Czy szukasz towarzystwa do swoich aktywności?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="true"
                checked={formData.lookingForCompanions === true}
                onChange={() => setFormData(prev => ({ ...prev, lookingForCompanions: true }))}
                className="mr-2"
              />
              Tak, chcę znaleźć towarzystwo
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="false"
                checked={formData.lookingForCompanions === false}
                onChange={() => setFormData(prev => ({ ...prev, lookingForCompanions: false }))}
                className="mr-2"
              />
              Nie, wolę działać solo
            </label>
          </div>
        </div>

        {formData.lookingForCompanions && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jakiego typu towarzystwo Cię interesuje? (możesz wybrać kilka)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {companionTypes.map((type) => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.companionPreferences.includes(type.value as any)}
                      onChange={() => handleCompanionPreferenceChange(type.value)}
                      className="mr-2"
                    />
                    {type.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jak bardzo interesują Cię challenges zespołowe?
              </label>
              <select
                value={formData.teamChallengeInterest}
                onChange={(e) => setFormData(prev => ({ ...prev, teamChallengeInterest: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz poziom zainteresowania</option>
                <option value="high">Wysokie - uwielbiam rywalizację</option>
                <option value="medium">Średnie - czasami lubię challenges</option>
                <option value="low">Niskie - wolę spokojną współpracę</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jakie są Twoje cele społeczne? (możesz wybrać kilka)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {socialGoals.map((goal) => (
                  <label key={goal.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.socialGoals.includes(goal.value as any)}
                      onChange={() => handleSocialGoalChange(goal.value)}
                      className="mr-2"
                    />
                    {goal.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jaki jest Twój styl komunikacji?
              </label>
              <select
                value={formData.communicationStyle}
                onChange={(e) => setFormData(prev => ({ ...prev, communicationStyle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz styl komunikacji</option>
                <option value="direct">Bezpośredni - mówię wprost</option>
                <option value="encouraging">Zachęcający - lubię motywować innych</option>
                <option value="competitive">Konkurencyjny - napędzam rywalizacją</option>
                <option value="supportive">Wspierający - pomagam w trudnych momentach</option>
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          Zapisz preferencje społeczne
        </button>
      </form>
    </div>
  );
};

export default SocialCompanionForm;
