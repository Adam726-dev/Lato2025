
export interface SavedTravelPlan {
  id: string;
  title: string;
  destination: string;
  createdAt: Date;
  profile: any;
  plan: {
    itinerary: string;
    budgetBreakdown: string;
    recommendations: string[];
    packingList: string[];
  };
}

const STORAGE_KEY = 'saved-travel-plans';

export const saveTravelPlan = (plan: any, profile: any): SavedTravelPlan => {
  const savedPlan: SavedTravelPlan = {
    id: Date.now().toString(),
    title: extractDestinationFromPlan(plan.itinerary) || 'Plan Podróży',
    destination: extractDestinationFromPlan(plan.itinerary) || 'Nieznana destynacja',
    createdAt: new Date(),
    profile,
    plan
  };

  const existingPlans = getSavedTravelPlans();
  const updatedPlans = [savedPlan, ...existingPlans];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  return savedPlan;
};

export const getSavedTravelPlans = (): SavedTravelPlan[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  
  try {
    const plans = JSON.parse(saved);
    return plans.map((plan: any) => ({
      ...plan,
      createdAt: new Date(plan.createdAt)
    }));
  } catch {
    return [];
  }
};

export const deleteTravelPlan = (id: string): void => {
  const existingPlans = getSavedTravelPlans();
  const updatedPlans = existingPlans.filter(plan => plan.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
};

const extractDestinationFromPlan = (itinerary: string): string => {
  const match = itinerary.match(/na\s+([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż\s]+)/i);
  return match ? match[1].trim() : '';
};
