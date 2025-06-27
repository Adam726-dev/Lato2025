import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import NutritionWizard from '@/components/NutritionWizard';
import DietPlanViewer from '@/components/DietPlanViewer';
import CateringMatcher from '@/components/CateringMatcher';
import ProgressPredictor from '@/components/ProgressPredictor';
import { useUserProfile } from '@/context/UserProfileContext';

type DietWizardStep = 'wizard' | 'plan' | 'catering' | 'progress';

const DietWizardPage = () => {
  const [currentStep, setCurrentStep] = useState<DietWizardStep>('wizard');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const handleWizardComplete = (plan: any) => {
    setGeneratedPlan(plan);
    setCurrentStep('plan');
  };

  const handlePlanAccepted = () => {
    setCurrentStep('catering');
  };

  const handleCateringSelected = () => {
    setCurrentStep('progress');
  };

  const handleComplete = () => {
    navigate('/dieta');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'wizard':
        return <NutritionWizard onComplete={handleWizardComplete} />;
      case 'plan':
        return (
          <DietPlanViewer 
            plan={generatedPlan} 
            onAccept={handlePlanAccepted}
            onBack={() => setCurrentStep('wizard')}
          />
        );
      case 'catering':
        return (
          <CateringMatcher 
            dietPlan={generatedPlan}
            onComplete={handleCateringSelected}
            onBack={() => setCurrentStep('plan')}
          />
        );
      case 'progress':
        return (
          <ProgressPredictor 
            dietPlan={generatedPlan}
            profile={profile}
            onComplete={handleComplete}
            onBack={() => setCurrentStep('catering')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Tło wideo diet.mp4 */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0 blur-sm brightness-75"
        src="/videos/diet.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ pointerEvents: 'none', objectFit: 'cover', minHeight: '100%', minWidth: '100%' }}
      />
      <div className="fixed inset-0 bg-black bg-opacity-40 z-10 pointer-events-none" />
      <div className="relative z-20">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentStep()}
        </main>
      </div>
    </div>
  );
};

export default DietWizardPage;
