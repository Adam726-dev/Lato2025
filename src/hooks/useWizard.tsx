
import { useState } from 'react';

interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

export const useWizard = (steps: WizardStep[]) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return {
    currentStep,
    currentStepData: steps[currentStep],
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    progress,
    totalSteps: steps.length
  };
};
