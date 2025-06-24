import React, { useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface TravelProfileFormProps {
  onComplete: () => void;
}

type TravelStyle =
  | ""
  | "luksusowy"
  | "średnia_półka"
  | "budżetowy"
  | "backpacker";
type Accommodation = "" | "hotel" | "airbnb" | "hostel" | "kemping";
type Transport = "" | "samolot" | "samochód" | "pociąg" | "autobus";
type Destination = "plaża" | "góry" | "miasto" | "wieś" | "historyczne";
type Companion = "" | "solo" | "partner" | "przyjaciele" | "rodzina";

const mapDestination = (d: string): Destination | null => {
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

const TravelProfileForm: React.FC<TravelProfileFormProps> = ({
  onComplete,
}) => {
  const { profile, updateProfile } = useUserProfile();

  const [formData, setFormData] = useState<{
    travelBudget: string | number;
    travelStyle: TravelStyle;
    accommodationPreference: Accommodation;
    transportPreference: Transport;
    destinationPreferences: Destination[];
    travelCompanions: Companion;
  }>({
    travelBudget: profile.travelBudget || "",
    travelStyle: (profile.travelStyle as TravelStyle) || "",
    accommodationPreference:
      (profile.accommodationPreference as Accommodation) || "",
    transportPreference: (profile.transportPreference as Transport) || "",
    destinationPreferences: Array.isArray(profile.destinationPreferences)
      ? (profile.destinationPreferences
          .map(mapDestination)
          .filter(Boolean) as Destination[])
      : [],
    travelCompanions: (profile.travelCompanions as Companion) || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: any = {
      destinationPreferences: formData.destinationPreferences,
    };

    if (formData.travelBudget) {
      updateData.travelBudget = Number(formData.travelBudget);
    }
    if (formData.travelStyle) {
      updateData.travelStyle = formData.travelStyle;
    }
    if (formData.accommodationPreference) {
      updateData.accommodationPreference = formData.accommodationPreference;
    }
    if (formData.transportPreference) {
      updateData.transportPreference = formData.transportPreference;
    }
    if (formData.travelCompanions) {
      updateData.travelCompanions = formData.travelCompanions;
    }

    updateProfile(updateData);
    onComplete();
  };

  const handleDestinationChange = (destination: Destination) => {
    setFormData((prev) => ({
      ...prev,
      destinationPreferences: prev.destinationPreferences.includes(destination)
        ? prev.destinationPreferences.filter((d) => d !== destination)
        : [...prev.destinationPreferences, destination],
    }));
  };

  const travelStyles = [
    { value: "luksusowy", label: "Luksusowy - najwyższa jakość" },
    { value: "średnia_półka", label: "Średnia półka - komfort i jakość" },
    { value: "budżetowy", label: "Budżetowy - maksymalne oszczędności" },
    { value: "backpacker", label: "Backpacker - przygoda i minimalizm" },
  ];

  const accommodations = [
    { value: "hotel", label: "Hotel - pełen serwis" },
    { value: "airbnb", label: "Airbnb - lokalne doświadczenie" },
    { value: "hostel", label: "Hostel - spotkania z ludźmi" },
    { value: "kemping", label: "Kemping - blisko natury" },
  ];

  const transports = [
    { value: "samolot", label: "Samolot - szybko i wygodnie" },
    { value: "samochód", label: "Samochód - swoboda podróżowania" },
    { value: "pociąg", label: "Pociąg - komfort i widoki" },
    { value: "autobus", label: "Autobus - ekonomicznie" },
  ];

  const destinations = [
    { value: "plaża", label: "Plaże i wybrzeże" },
    { value: "góry", label: "Góry i przyroda" },
    { value: "miasto", label: "Duże miasta" },
    { value: "wieś", label: "Wieś i natura" },
    { value: "historyczne", label: "Miejsca historyczne" },
  ];

  const companions = [
    { value: "solo", label: "Solo - podróż w pojedynkę" },
    { value: "partner", label: "Z partnerem/partnerką" },
    { value: "przyjaciele", label: "Z przyjaciółmi" },
    { value: "rodzina", label: "Z rodziną" },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✈️</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Travel Route Planner
        </h2>
        <p className="text-gray-600">
          AI zaplanuje idealne wakacje dopasowane do Twoich preferencji
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Budżet na wakacje (zł)
          </label>
          <input
            id="budget"
            type="number"
            value={formData.travelBudget}
            onChange={(e) =>
              setFormData({ ...formData, travelBudget: e.target.value })
            }
            placeholder="np. 3000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Styl podróżowania
          </label>
          <div className="space-y-2">
            {travelStyles.map((style) => (
              <label key={style.value} className="flex items-center">
                <input
                  type="radio"
                  value={style.value}
                  checked={formData.travelStyle === style.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      travelStyle: e.target.value as
                        | "luksusowy"
                        | "średnia_półka"
                        | "budżetowy"
                        | "backpacker",
                    })
                  }
                  className="mr-2"
                />
                {style.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferowany nocleg
          </label>
          <div className="space-y-2">
            {accommodations.map((acc) => (
              <label key={acc.value} className="flex items-center">
                <input
                  type="radio"
                  value={acc.value}
                  checked={formData.accommodationPreference === acc.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accommodationPreference: e.target.value as
                        | "hotel"
                        | "airbnb"
                        | "hostel"
                        | "kemping",
                    })
                  }
                  className="mr-2"
                />
                {acc.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferowany transport
          </label>
          <div className="space-y-2">
            {transports.map((transport) => (
              <label key={transport.value} className="flex items-center">
                <input
                  type="radio"
                  value={transport.value}
                  checked={formData.transportPreference === transport.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transportPreference: e.target.value as
                        | "samolot"
                        | "samochód"
                        | "pociąg"
                        | "autobus",
                    })
                  }
                  className="mr-2"
                />
                {transport.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferowane destynacje (wybierz wszystkie, które Cię interesują)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {destinations.map((dest) => (
              <label key={dest.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.destinationPreferences.includes(
                    dest.value as Destination
                  )}
                  onChange={() =>
                    handleDestinationChange(dest.value as Destination)
                  }
                  className="mr-2"
                />
                {dest.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Z kim podróżujesz?
          </label>
          <div className="space-y-2">
            {companions.map((comp) => (
              <label key={comp.value} className="flex items-center">
                <input
                  type="radio"
                  value={comp.value}
                  checked={formData.travelCompanions === comp.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      travelCompanions: e.target.value as
                        | "solo"
                        | "partner"
                        | "przyjaciele"
                        | "rodzina",
                    })
                  }
                  className="mr-2"
                />
                {comp.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-summer-yellow hover:bg-summer-yellow/90 text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          🗺️ Aktywuj Travel Route Planner
        </button>
      </form>
    </div>
  );
};

export default TravelProfileForm;
