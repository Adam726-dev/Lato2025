// src/context/PlanContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PlanChoices {
  dieta?: number;
  silownia?: number;
  imprezy?: number[];  // teraz tablica dla sekcji "imprezy"
  wakacje?: number;
}

interface PlanContextType {
  choices: PlanChoices;
  updateChoice: (section: keyof PlanChoices, optionId: number) => void;
  removeChoice: (section: keyof PlanChoices) => void;
  clearChoices: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [choices, setChoices] = useState<PlanChoices>({});

  // Przy starcie wczytujemy z localStorage
  useEffect(() => {
    const saved = localStorage.getItem('summer-plan-choices');
    if (saved) {
      setChoices(JSON.parse(saved));
    }
  }, []);

  // Helper do zapisu
  const persist = (newChoices: PlanChoices) => {
    setChoices(newChoices);
    localStorage.setItem('summer-plan-choices', JSON.stringify(newChoices));
  };

  const updateChoice = (section: keyof PlanChoices, optionId: number) => {
    let newChoices: PlanChoices;

    if (section === 'imprezy') {
      // toggle w tablicy
      const prev: number[] = Array.isArray(choices.imprezy) ? choices.imprezy : [];
      const next = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId];
      newChoices = { ...choices, imprezy: next };
    } else {
      // pojedynczy wybór
      newChoices = { ...choices, [section]: optionId };
    }

    persist(newChoices);
  };

  const removeChoice = (section: keyof PlanChoices) => {
    // usuwa cały klucz (dla imprez wyczyści całą tablicę)
    const newChoices = { ...choices };
    delete newChoices[section];
    persist(newChoices);
  };

  const clearChoices = () => {
    setChoices({});
    localStorage.removeItem('summer-plan-choices');
  };

  return (
    <PlanContext.Provider value={{ choices, updateChoice, removeChoice, clearChoices }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within a PlanProvider');
  return ctx;
};
