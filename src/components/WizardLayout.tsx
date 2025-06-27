import React from 'react';

interface WizardLayoutProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({
  title,
  description,
  currentStep,
  totalSteps,
  progress,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  canProceed,
  isLoading = false,
  loadingText = "Przetwarzanie...",
  children,
}) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Tło wideo tylko dla diety i siłowni */}
      {title === '🥗 Dieta AI' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/videos/diet.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-60 blur-sm"
          style={{ filter: 'brightness(40%) blur(6px)', WebkitFilter: 'brightness(40%) blur(6px)' }}
        />
      )}
      {title === '🏋️‍♀️ Personal Trainer AI' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/videos/gym.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-60 blur-sm"
          style={{ filter: 'brightness(40%) blur(6px)', WebkitFilter: 'brightness(40%) blur(6px)' }}
        />
      )}
      {/* Overlay na tło */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-8 ${title === '🥗 Dieta AI' ? 'mt-12' : ''}${title === '🏋️‍♀️ Personal Trainer AI' ? ' mt-12' : ''}`}>
            {title === '🥗 Nutrition Profile AI' ? (
              <>
                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{title}</h2>
                <p className="text-slate-100 drop-shadow mb-4">{description}</p>
              </>
            ) : title === '🥗 Dieta AI' ? (
              <>
                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{title}</h2>
                <p className="text-slate-100 drop-shadow mb-4">{description}</p>
              </>
            ) : title === '🏋️‍♀️ Personal Trainer AI' ? (
              <>
                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{title}</h2>
                <p className="text-slate-100 drop-shadow mb-4">{description}</p>
              </>
            ) : title === '✈️ Planer Trasy Podróży' ? (
              <>
                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{title}</h2>
                <p className="text-slate-100 drop-shadow mb-4">{description}</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">{title}</h2>
                <p className="text-gray-600 mb-4">{description}</p>
              </>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {children}
          </div>
          <div className="flex justify-between">
            <button
              onClick={onPrev}
              disabled={isFirstStep || isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isFirstStep || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← Poprzedni
            </button>
            <button
              onClick={onNext}
              disabled={!canProceed || isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                !canProceed || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-summer-blue text-white hover:bg-summer-blue/90'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {loadingText}
                </>
              ) : (
                <>
                  {isLastStep ? 'Zapisz profil' : 'Następny'}
                  {!isLastStep && <span>→</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
