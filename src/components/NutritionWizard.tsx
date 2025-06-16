import React, { useState } from 'react';
import { useWizard } from '@/hooks/useWizard';
import { useUserProfile } from '@/context/UserProfileContext';
import { generateNutritionPlan } from '@/services/geminiService';
import WizardLayout from './WizardLayout';
import BMRCalculatorWidget from './BMRCalculatorWidget';
import { Input, Label, RadioGroup, RadioGroupItem, Checkbox } from './FormElements';
import { toast } from 'sonner';

interface NutritionWizardProps {
  onComplete: (plan: any) => void;
}

const NutritionWizard: React.FC<NutritionWizardProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    dailyCalories: profile.dailyCalories?.toString() || '',
    dietPreferences: profile.dietPreferences || [],
    allergies: profile.allergies || [],
    dislikedIngredients: profile.dislikedIngredients || [],
    mealsPerDay: profile.mealsPerDay || 3,
    cookingTime: profile.cookingTime || '',
  });

  const steps = [
    { id: 'calories', title: 'Kalorie i posiłki', description: 'Określ swoje potrzeby kaloryczne' },
    { id: 'diet', title: 'Preferencje dietetyczne', description: 'Wybierz preferowany styl odżywiania' },
    { id: 'restrictions', title: 'Ograniczenia', description: 'Alergie i niechciane składniki' },
    { id: 'cooking', title: 'Gotowanie', description: 'Ile czasu możesz poświęcić na przygotowanie posiłków' }
  ];

  const { currentStep, currentStepData, nextStep, prevStep, isFirstStep, isLastStep, progress } = useWizard(steps);

  const handleCaloriesCalculated = (calories: number) => {
    setFormData({ ...formData, dailyCalories: calories.toString() });
  };

  const handleDietPreferenceChange = (pref: string) => {
    const prefs = formData.dietPreferences.includes(pref as any)
      ? formData.dietPreferences.filter(p => p !== pref)
      : [...formData.dietPreferences, pref as any];
    setFormData({ ...formData, dietPreferences: prefs });
  };

  const handleAllergyChange = (allergy: string) => {
    const allergies = formData.allergies.includes(allergy as any)
      ? formData.allergies.filter(a => a !== allergy)
      : [...formData.allergies, allergy as any];
    setFormData({ ...formData, allergies: allergies });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(formData.dailyCalories && formData.mealsPerDay);
      case 1:
        return formData.dietPreferences.length > 0;
      case 2:
        return true; 
      case 3:
        return !!formData.cookingTime;
      default:
        return true;
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    try {
      const updateData: any = {
        dietPreferences: formData.dietPreferences,
        allergies: formData.allergies,
        dislikedIngredients: formData.dislikedIngredients,
        mealsPerDay: formData.mealsPerDay,
      };
      
      if (formData.dailyCalories) updateData.dailyCalories = Number(formData.dailyCalories);
      if (formData.cookingTime) updateData.cookingTime = formData.cookingTime;
      
      await updateProfile(updateData);

      // Generuj plan żywieniowy
      const plan = await generateNutritionPlan({
        ...profile,
        ...updateData
      });

      toast.success('Plan żywieniowy wygenerowany pomyślnie!');
      onComplete(plan);
    } catch (error: any) {
      console.error('Error generating nutrition plan:', error);
      toast.error(error.message || 'Błąd podczas generowania planu żywieniowego');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      generatePlan();
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <BMRCalculatorWidget onCaloriesCalculated={handleCaloriesCalculated} />
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold">Określ swoje potrzeby żywieniowe</h3>
            </div>
            
            <div>
              <Label htmlFor="calories">Docelowa ilość kalorii dziennie</Label>
              <Input
                id="calories"
                type="number"
                value={formData.dailyCalories}
                onChange={(e) => setFormData({ ...formData, dailyCalories: e.target.value })}
                placeholder="np. 2000"
                className="text-center text-lg"
              />
            </div>

            <div>
              <Label>Ile posiłków dziennie?</Label>
              <div className="mt-4">
                <input
                  type="range"
                  min="3"
                  max="6"
                  value={formData.mealsPerDay}
                  onChange={(e) => setFormData({ ...formData, mealsPerDay: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>3 posiłki</span>
                  <span className="font-medium text-summer-blue">
                    {formData.mealsPerDay} posiłków dziennie
                  </span>
                  <span>6 posiłków</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold">Jakie style odżywiania Cię interesują?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'mediterranean', label: '🫒 Śródziemnomorska', desc: 'Oliwa, ryby, warzywa' },
                { value: 'vegetarian', label: '🌱 Wegetariańska', desc: 'Bez mięsa' },
                { value: 'vegan', label: '🥬 Wegańska', desc: 'Tylko produkty roślinne' },
                { value: 'keto', label: '🥑 Ketogeniczna', desc: 'Nisko węglowodanowa' },
                { value: 'balanced', label: '⚖️ Zbilansowana', desc: 'Wszystkiego po trochu' },
                { value: 'high_protein', label: '💪 Wysokobiałkowa', desc: 'Dużo białka' }
              ].map((diet) => (
                <div key={diet.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={formData.dietPreferences.includes(diet.value as any)}
                    onCheckedChange={() => handleDietPreferenceChange(diet.value)}
                    id={diet.value}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={diet.value} className="font-medium">{diet.label}</Label>
                    <p className="text-sm text-gray-600">{diet.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold">Alergie pokarmowe</h3>
                <p className="text-sm text-gray-600">Zaznacz wszystkie, które Cię dotyczą</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'gluten', label: '🌾 Gluten' },
                  { value: 'lactose', label: '🥛 Laktoza' },
                  { value: 'nuts', label: '🥜 Orzechy' },
                  { value: 'fish', label: '🐟 Ryby' },
                  { value: 'eggs', label: '🥚 Jaja' },
                  { value: 'soy', label: '🌿 Soja' }
                ].map((allergy) => (
                  <div key={allergy.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={formData.allergies.includes(allergy.value as any)}
                      onCheckedChange={() => handleAllergyChange(allergy.value)}
                      id={allergy.value}
                    />
                    <Label htmlFor={allergy.value} className="text-sm">{allergy.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="disliked">Składniki, których nie lubisz (opcjonalne)</Label>
              <Input
                id="disliked"
                value={formData.dislikedIngredients.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  dislikedIngredients: e.target.value.split(',').map(i => i.trim()).filter(i => i)
                })}
                placeholder="np. brukselka, wątróbka, ostry pieprz"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold">Ile czasu możesz poświęcić na gotowanie?</h3>
            </div>
            <RadioGroup 
              value={formData.cookingTime} 
              onValueChange={(value) => setFormData({ ...formData, cookingTime: value })}
              className="space-y-4"
            >
              {[
                { value: 'minimal', label: '⚡ Minimal (15 min)', desc: 'Szybkie i proste posiłki' },
                { value: 'short', label: '⏰ Krótki (30 min)', desc: 'Podstawowe gotowanie' },
                { value: 'medium', label: '🍳 Średni (45-60 min)', desc: 'Lubię gotować od czasu do czasu' },
                { value: 'long', label: '👨‍🍳 Długi (60+ min)', desc: 'Gotowanie to moja pasja' }
              ].map((time) => (
                <div key={time.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={time.value} id={time.value} className="mt-1" />
                  <div>
                    <Label htmlFor={time.value} className="font-medium">{time.label}</Label>
                    <p className="text-sm text-gray-600">{time.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <WizardLayout
      title="🥗 Nutrition Profile AI"
      description={currentStepData.description}
      currentStep={currentStep}
      totalSteps={steps.length}
      progress={progress}
      onNext={handleNext}
      onPrev={prevStep}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      canProceed={canProceed()}
      isLoading={isGenerating}
      loadingText="Generuję spersonalizowany plan żywieniowy..."
    >
      {renderStepContent()}
    </WizardLayout>
  );
};

export default NutritionWizard;
