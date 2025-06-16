
import React, { useState } from 'react';
import { useWizard } from '@/hooks/useWizard';
import { useUserProfile } from '@/context/UserProfileContext';
import WizardLayout from './WizardLayout';
import { Input, Label, RadioGroup, RadioGroupItem, Checkbox } from './FormElements';

interface ActivityWizardProps {
  onComplete: () => void;
}

const ActivityWizard: React.FC<ActivityWizardProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    personalityType: profile.personalityType || '',
    energyLevel: profile.energyLevel || '',
    socialPreference: profile.socialPreference || '',
    activityPreferences: profile.activityPreferences || [],
    budgetRange: '',
    timePreference: '',
  });

  const steps = [
    { id: 'personality', title: 'Typ osobowości', description: 'Jak opisałbyś swoją osobowość?' },
    { id: 'energy', title: 'Poziom energii', description: 'Jaki masz poziom energii i aktywności?' },
    { id: 'social', title: 'Preferencje społeczne', description: 'Jak lubisz spędzać czas z innymi?' },
    { id: 'activities', title: 'Rodzaje aktywności', description: 'Jakie aktywności Cię interesują?' }
  ];

  const { currentStep, currentStepData, nextStep, prevStep, isFirstStep, isLastStep, progress } = useWizard(steps);

  const handleActivityChange = (activity: string) => {
    const activities = formData.activityPreferences.includes(activity as any)
      ? formData.activityPreferences.filter(a => a !== activity)
      : [...formData.activityPreferences, activity as any];
    setFormData({ ...formData, activityPreferences: activities });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!formData.personalityType;
      case 1:
        return !!formData.energyLevel;
      case 2:
        return !!formData.socialPreference;
      case 3:
        return formData.activityPreferences.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      const updateData: any = {
        activityPreferences: formData.activityPreferences,
      };
      
      if (formData.personalityType) updateData.personalityType = formData.personalityType;
      if (formData.energyLevel) updateData.energyLevel = formData.energyLevel;
      if (formData.socialPreference) updateData.socialPreference = formData.socialPreference;
      
      updateProfile(updateData);
      onComplete();
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold">Jaki jest Twój typ osobowości?</h3>
            </div>
            <RadioGroup 
              value={formData.personalityType} 
              onValueChange={(value) => setFormData({ ...formData, personalityType: value })}
              className="space-y-4"
            >
              {[
                { value: 'extrovert', label: '🌟 Ekstrawertyk', desc: 'Czerpię energię z kontaktu z ludźmi' },
                { value: 'introvert', label: '📚 Introwertyk', desc: 'Potrzebuję czasu dla siebie żeby się zregenerować' },
                { value: 'ambivert', label: '⚖️ Ambivert', desc: 'Zależy od sytuacji i nastroju' }
              ].map((type) => (
                <div key={type.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                  <div>
                    <Label htmlFor={type.value} className="font-medium">{type.label}</Label>
                    <p className="text-sm text-gray-600">{type.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold">Jaki masz poziom energii?</h3>
            </div>
            <RadioGroup 
              value={formData.energyLevel} 
              onValueChange={(value) => setFormData({ ...formData, energyLevel: value })}
              className="space-y-4"
            >
              {[
                { value: 'high', label: '🚀 Wysoka energia', desc: 'Zawsze gotowy na action i nowe wyzwania' },
                { value: 'medium', label: '🌤️ Średnia energia', desc: 'Aktywny, ale lubię też odpoczynek' },
                { value: 'low', label: '🌙 Niska energia', desc: 'Preferuję spokojne i relaksujące aktywności' }
              ].map((level) => (
                <div key={level.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                  <div>
                    <Label htmlFor={level.value} className="font-medium">{level.label}</Label>
                    <p className="text-sm text-gray-600">{level.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold">Jak lubisz spędzać czas?</h3>
            </div>
            <RadioGroup 
              value={formData.socialPreference} 
              onValueChange={(value) => setFormData({ ...formData, socialPreference: value })}
              className="space-y-4"
            >
              {[
                { value: 'large_groups', label: '🎪 Duże grupy', desc: 'Im więcej ludzi, tym lepiej!' },
                { value: 'small_groups', label: '👫 Małe grupy', desc: 'Lubię kameralne spotkania' },
                { value: 'couples', label: '💑 We dwoje', desc: 'Najlepiej z jedną bliską osobą' },
                { value: 'alone', label: '🧘 Sam/sama', desc: 'Cenię czas spędzony w pojedynkę' }
              ].map((pref) => (
                <div key={pref.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={pref.value} id={pref.value} className="mt-1" />
                  <div>
                    <Label htmlFor={pref.value} className="font-medium">{pref.label}</Label>
                    <p className="text-sm text-gray-600">{pref.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold">Jakie aktywności Cię interesują?</h3>
              <p className="text-sm text-gray-600">Wybierz wszystkie, które Ci odpowiadają</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'outdoor', label: '🌲 Outdoor', desc: 'Aktywności na świeżym powietrzu' },
                { value: 'indoor', label: '🏠 Indoor', desc: 'Aktywności w pomieszczeniach' },
                { value: 'cultural', label: '🎭 Kultura', desc: 'Teatr, muzea, koncerty' },
                { value: 'sports', label: '⚽ Sport', desc: 'Aktywność fizyczna i sport' },
                { value: 'nightlife', label: '🌃 Życie nocne', desc: 'Kluby, bary, imprezy' },
                { value: 'food', label: '🍴 Kulinaria', desc: 'Restauracje, degustacje' },
                { value: 'adventure', label: '🏔️ Przygoda', desc: 'Ekstremalne sporty, wyzwania' },
                { value: 'relaxation', label: '🧘‍♀️ Relaks', desc: 'SPA, medytacja, odpoczynek' }
              ].map((activity) => (
                <div key={activity.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={formData.activityPreferences.includes(activity.value as any)}
                    onCheckedChange={() => handleActivityChange(activity.value)}
                    id={activity.value}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={activity.value} className="font-medium">{activity.label}</Label>
                    <p className="text-sm text-gray-600">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <WizardLayout
      title="🎉 Activity Profile AI"
      description={currentStepData.description}
      currentStep={currentStep}
      totalSteps={steps.length}
      progress={progress}
      onNext={handleNext}
      onPrev={prevStep}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      canProceed={canProceed()}
    >
      {renderStepContent()}
    </WizardLayout>
  );
};

export default ActivityWizard;
