
import React, { useState, useEffect } from 'react';
import { useWizard } from '@/hooks/useWizard';
import { useUserProfile } from '@/context/UserProfileContext';
import WizardLayout from './WizardLayout';
import { Input, Label, RadioGroup, RadioGroupItem, Checkbox } from './FormElements';

interface FitnessWizardProps {
  onComplete: () => void;
}

const FitnessWizard: React.FC<FitnessWizardProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    currentWeight: profile.currentWeight?.toString() || '',
    targetWeight: profile.targetWeight?.toString() || '',
    height: profile.height?.toString() || '',
    age: profile.age?.toString() || '',
    gender: profile.gender || '',
    fitnessLevel: profile.fitnessLevel || '',
    fitnessGoals: profile.fitnessGoals || [],
    injuries: profile.injuries?.join(', ') || '',
    trainingDays: profile.trainingDays || 3,
  });

  const steps = [
    { id: 'basic', title: 'Podstawowe informacje', description: 'Podaj swoje dane podstawowe' },
    { id: 'fitness', title: 'Poziom fitness', description: 'Określ swój obecny poziom' },
    { id: 'goals', title: 'Cele treningowe', description: 'Wybierz swoje cele' },
    { id: 'preferences', title: 'Preferencje', description: 'Dostosuj plan do siebie' }
  ];

  const { currentStep, currentStepData, nextStep, prevStep, isFirstStep, isLastStep, progress } = useWizard(steps);

  const handleGoalToggle = (goal: string) => {
    const goals = formData.fitnessGoals.includes(goal as any)
      ? formData.fitnessGoals.filter(g => g !== goal)
      : [...formData.fitnessGoals, goal as any];
    setFormData({ ...formData, fitnessGoals: goals });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(formData.currentWeight && formData.height && formData.age && formData.gender);
      case 1:
        return !!formData.fitnessLevel;
      case 2:
        return formData.fitnessGoals.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      const updateData: any = {};
      
      if (formData.currentWeight) updateData.currentWeight = Number(formData.currentWeight);
      if (formData.targetWeight) updateData.targetWeight = Number(formData.targetWeight);
      if (formData.height) updateData.height = Number(formData.height);
      if (formData.age) updateData.age = Number(formData.age);
      if (formData.gender) updateData.gender = formData.gender;
      if (formData.fitnessLevel) updateData.fitnessLevel = formData.fitnessLevel;
      
      updateData.fitnessGoals = formData.fitnessGoals;
      updateData.injuries = formData.injuries ? formData.injuries.split(',').map(i => i.trim()) : [];
      updateData.trainingDays = formData.trainingDays;
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currentWeight">Obecna waga (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                  placeholder="np. 70"
                />
              </div>
              
              <div>
                <Label htmlFor="targetWeight">Docelowa waga (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  placeholder="np. 65"
                />
              </div>
              
              <div>
                <Label htmlFor="height">Wzrost (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="np. 170"
                />
              </div>
              
              <div>
                <Label htmlFor="age">Wiek</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="np. 25"
                />
              </div>
            </div>

            <div>
              <Label>Płeć</Label>
              <RadioGroup 
                value={formData.gender} 
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Mężczyzna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Kobieta</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Label>Jaki jest Twój obecny poziom fitness?</Label>
            <RadioGroup 
              value={formData.fitnessLevel} 
              onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="beginner" id="beginner" className="mt-1" />
                <div>
                  <Label htmlFor="beginner" className="font-medium">🌱 Początkujący</Label>
                  <p className="text-sm text-gray-600">Dopiero zaczynam przygodę z aktywnością fizyczną</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="intermediate" id="intermediate" className="mt-1" />
                <div>
                  <Label htmlFor="intermediate" className="font-medium">💪 Średnio zaawansowany</Label>
                  <p className="text-sm text-gray-600">Trenuję regularnie od kilku miesięcy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="advanced" id="advanced" className="mt-1" />
                <div>
                  <Label htmlFor="advanced" className="font-medium">🔥 Zaawansowany</Label>
                  <p className="text-sm text-gray-600">Mam wieloletnie doświadczenie w treningu</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Label>Jakie są Twoje główne cele treningowe?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'weight_loss', label: '🔥 Utrata wagi', desc: 'Chcę schudnąć i spalić tłuszcz' },
                { value: 'muscle_gain', label: '💪 Budowa mięśni', desc: 'Chcę zwiększyć masę mięśniową' },
                { value: 'endurance', label: '🏃 Wytrzymałość', desc: 'Chcę poprawić kondycję fizyczną' },
                { value: 'strength', label: '🏋️ Siła', desc: 'Chcę stać się silniejszy' }
              ].map((goal) => (
                <div key={goal.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={formData.fitnessGoals.includes(goal.value as any)}
                    onCheckedChange={() => handleGoalToggle(goal.value)}
                    id={goal.value}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={goal.value} className="font-medium">{goal.label}</Label>
                    <p className="text-sm text-gray-600">{goal.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="trainingDays">Ile dni w tygodniu chcesz trenować?</Label>
              <div className="mt-4">
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={formData.trainingDays}
                  onChange={(e) => setFormData({ ...formData, trainingDays: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1 dzień</span>
                  <span className="font-medium text-summer-blue">
                    {formData.trainingDays} {formData.trainingDays === 1 ? 'dzień' : 'dni'} w tygodniu
                  </span>
                  <span>7 dni</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="injuries">Kontuzje lub ograniczenia (opcjonalne)</Label>
              <Input
                id="injuries"
                value={formData.injuries}
                onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                placeholder="np. problemy z kolanami, ból pleców"
              />
              <p className="text-sm text-gray-600 mt-1">
                Pomożemy dostosować plan treningowy do Twoich ograniczeń
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <WizardLayout
      title="🏋️‍♀️ Personal Trainer AI"
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

export default FitnessWizard;
