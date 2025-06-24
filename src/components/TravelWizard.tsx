import React, { useState } from "react";
import { useWizard } from "@/hooks/useWizard";
import { useUserProfile } from "@/context/UserProfileContext";
import WizardLayout from "./WizardLayout";
import {
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
} from "./FormElements";

interface TravelWizardProps {
  onComplete: () => void;
}

const mapDestination = (d: string): string | null => {
  switch (d) {
    case "beach":
      return "plaża";
    case "mountains":
      return "góry";
    case "cities":
      return "miasto";
    case "countryside":
      return "wieś";
    case "historical":
      return "historyczne";
    case "plaża":
    case "góry":
    case "miasto":
    case "wieś":
    case "historyczne":
      return d;
    default:
      return null;
  }
};

const TravelWizard: React.FC<TravelWizardProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();

  const [formData, setFormData] = useState({
    travelBudget: profile.travelBudget?.toString() || "",
    travelStyle: profile.travelStyle || "",
    accommodationPreference: profile.accommodationPreference || "",
    transportPreference: profile.transportPreference || "",
    destinationPreferences: Array.isArray(profile.destinationPreferences)
      ? profile.destinationPreferences.map(mapDestination).filter(Boolean)
      : [],
    travelCompanions: profile.travelCompanions || "",
  });

  const steps = [
    {
      id: "budget",
      title: "Budżet podróży",
      description: "Określ swój budżet na wakacje",
    },
    {
      id: "style",
      title: "Styl podróżowania",
      description: "Wybierz preferowany styl",
    },
    {
      id: "accommodation",
      title: "Nocleg i transport",
      description: "Wybierz preferowane opcje",
    },
    {
      id: "destinations",
      title: "Destynacje i towarzystwo",
      description: "Określ swoje preferencje",
    },
  ];

  const {
    currentStep,
    currentStepData,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    progress,
  } = useWizard(steps);

  const handleDestinationChange = (destination: string) => {
    const destinations = formData.destinationPreferences.includes(
      destination as any
    )
      ? formData.destinationPreferences.filter((d) => d !== destination)
      : [...formData.destinationPreferences, destination as any];
    setFormData({ ...formData, destinationPreferences: destinations });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!formData.travelBudget;
      case 1:
        return !!formData.travelStyle;
      case 2:
        return !!(
          formData.accommodationPreference && formData.transportPreference
        );
      case 3:
        return !!(
          formData.destinationPreferences.length > 0 &&
          formData.travelCompanions
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      const updateData: any = {
        destinationPreferences: formData.destinationPreferences,
      };

      if (formData.travelBudget)
        updateData.travelBudget = Number(formData.travelBudget);
      if (formData.travelStyle) updateData.travelStyle = formData.travelStyle;
      if (formData.accommodationPreference)
        updateData.accommodationPreference = formData.accommodationPreference;
      if (formData.transportPreference)
        updateData.transportPreference = formData.transportPreference;
      if (formData.travelCompanions)
        updateData.travelCompanions = formData.travelCompanions;

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
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold">
                Jaki jest Twój budżet na wakacje?
              </h3>
            </div>
            <div>
              <Label htmlFor="budget">Budżet na wakacje (zł)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.travelBudget}
                onChange={(e) =>
                  setFormData({ ...formData, travelBudget: e.target.value })
                }
                placeholder="np. 3000"
                className="text-center text-lg"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold">
                Jaki styl podróżowania preferujesz?
              </h3>
            </div>
            <RadioGroup
              value={formData.travelStyle}
              onValueChange={(value) =>
                setFormData({ ...formData, travelStyle: value })
              }
              className="space-y-4"
            >
              {[
                {
                  value: "luksusowy",
                  label: "✨ Luksusowy",
                  desc: "Najwyższa jakość, komfort bez kompromisów",
                },
                {
                  value: "średnia_półka",
                  label: "🏨 Średnia półka",
                  desc: "Dobry stosunek jakości do ceny",
                },
                {
                  value: "budżetowy",
                  label: "💸 Budżetowy",
                  desc: "Maksymalne oszczędności, podstawowe udogodnienia",
                },
                {
                  value: "backpacker",
                  label: "🎒 Backpacker",
                  desc: "Przygoda, minimalizm i autentyczne doświadczenia",
                },
              ].map((style) => (
                <div
                  key={style.value}
                  className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <RadioGroupItem
                    value={style.value}
                    id={style.value}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={style.value} className="font-medium">
                      {style.label}
                    </Label>
                    <p className="text-sm text-gray-600">{style.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏠</div>
                <h3 className="text-lg font-semibold">Preferowany nocleg</h3>
              </div>
              <RadioGroup
                value={formData.accommodationPreference}
                onValueChange={(value) =>
                  setFormData({ ...formData, accommodationPreference: value })
                }
                className="space-y-3"
              >
                {[
                  {
                    value: "hotel",
                    label: "🏨 Hotel",
                    desc: "Pełen serwis i wygoda",
                  },
                  {
                    value: "airbnb",
                    label: "🏡 Airbnb",
                    desc: "Lokalne doświadczenie",
                  },
                  {
                    value: "hostel",
                    label: "🛏️ Hostel",
                    desc: "Spotkania z ludźmi",
                  },
                  {
                    value: "kemping",
                    label: "⛺ Kemping",
                    desc: "Blisko natury",
                  },
                ].map((acc) => (
                  <div
                    key={acc.value}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem value={acc.value} id={acc.value} />
                    <Label htmlFor={acc.value} className="font-medium flex-1">
                      {acc.label}
                    </Label>
                    <span className="text-sm text-gray-600">{acc.desc}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🚗</div>
                <h3 className="text-lg font-semibold">Preferowany transport</h3>
              </div>
              <RadioGroup
                value={formData.transportPreference}
                onValueChange={(value) =>
                  setFormData({ ...formData, transportPreference: value })
                }
                className="space-y-3"
              >
                {[
                  {
                    value: "samolot",
                    label: "✈️ Samolot",
                    desc: "Szybko i wygodnie",
                  },
                  {
                    value: "samochód",
                    label: "🚗 Samochód",
                    desc: "Swoboda podróżowania",
                  },
                  {
                    value: "pociąg",
                    label: "🚆 Pociąg",
                    desc: "Komfort i widoki",
                  },
                  {
                    value: "autobus",
                    label: "🚌 Autobus",
                    desc: "Ekonomicznie",
                  },
                ].map((transport) => (
                  <div
                    key={transport.value}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={transport.value}
                      id={transport.value}
                    />
                    <Label
                      htmlFor={transport.value}
                      className="font-medium flex-1"
                    >
                      {transport.label}
                    </Label>
                    <span className="text-sm text-gray-600">
                      {transport.desc}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🗺️</div>
                <h3 className="text-lg font-semibold">
                  Preferowane destynacje
                </h3>
                <p className="text-sm text-gray-600">
                  Wybierz wszystkie, które Cię interesują
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: "plaża", label: "🏖️ Plaże i wybrzeże" },
                  { value: "góry", label: "⛰️ Góry i przyroda" },
                  { value: "miasto", label: "🏙️ Duże miasta" },
                  { value: "wieś", label: "🌾 Wieś i natura" },
                  { value: "historyczne", label: "🏛️ Miejsca historyczne" },
                ].map((dest) => (
                  <div
                    key={dest.value}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={formData.destinationPreferences.includes(
                        dest.value
                      )}
                      onCheckedChange={() =>
                        handleDestinationChange(dest.value)
                      }
                      id={dest.value}
                    />
                    <Label htmlFor={dest.value} className="font-medium">
                      {dest.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="text-lg font-semibold">Z kim podróżujesz?</h3>
              </div>
              <RadioGroup
                value={formData.travelCompanions}
                onValueChange={(value) =>
                  setFormData({ ...formData, travelCompanions: value })
                }
                className="space-y-3"
              >
                {[
                  {
                    value: "solo",
                    label: "🧳 Sam",
                    desc: "Podróż w pojedynkę",
                  },
                  {
                    value: "partner",
                    label: "💑 Z partnerem/partnerką",
                    desc: "Romantyczna podróż we dwoje",
                  },
                  {
                    value: "przyjaciele",
                    label: "👫 Z przyjaciółmi",
                    desc: "Zabawa w grupie",
                  },
                  {
                    value: "rodzina",
                    label: "👨‍👩‍👧‍👦 Z rodziną",
                    desc: "Czas z rodziną",
                  },
                ].map((comp) => (
                  <div
                    key={comp.value}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={comp.value}
                      id={comp.value}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor={comp.value} className="font-medium">
                        {comp.label}
                      </Label>
                      <p className="text-sm text-gray-600">{comp.desc}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <WizardLayout
      title="✈️ Planer Trasy Podróży"
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

export default TravelWizard;
