import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { usePlan, PlanChoices } from '@/context/PlanContext';
import { optionCardBase } from '@/components/ui/OptionCard'

interface Option {
  id: number;
  icon: React.ReactNode;
  name: string;
  description: string;
  features?: string[];
  price?: string;
}

interface DefaultSectionProps {
  sectionId: keyof PlanChoices;
  section: {
    options: Option[];
    wizardComponent?: React.ReactNode;
  };
}

const DefaultSection: React.FC<DefaultSectionProps> = ({ sectionId, section }) => {
  const { choices, updateChoice } = usePlan();
  const [modalOption, setModalOption] = useState<Option | null>(null);

  // dla imprez choices.imprezy to number[], dla pozostałych number|undefined
  const raw = choices[sectionId];
  const selectedIds: number[] = Array.isArray(raw) ? raw : (typeof raw === 'number' ? [raw] : []);

  return (
    <div>
      {section.wizardComponent && (
        <div className="mb-8 text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            <Link to={`/${sectionId}/wizard`}>🧙‍♂️ Spersonalizowany kreator</Link>
          </Button>
          <p className="text-gray-600 mt-2">lub wybierz gotową opcję poniżej</p>
        </div>
      )}

      {/* GRID KAFELKÓW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.options.map(option => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <div
              key={option.id}
              onClick={() => setModalOption(option)}
              className={`
                ${optionCardBase} + ''
                ${isSelected
                  ? 'border-2 border-purple-500 bg-purple-50 p-6'
                  : 'hover:border-purple-300 p-6'}
              `}
            >
              <div className="text-4xl mb-4 text-center">{option.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {option.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 text-center">
                {option.description}
              </p>
              {option.features && (
                <ul className="text-sm text-gray-500 space-y-1 mb-4">
                  {option.features.map((f, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {option.price && (
                <div className="text-lg font-bold text-purple-600 mb-2 text-center">
                  {option.price}
                </div>
              )}
              <div className="flex items-center justify-center text-purple-700">
                <span className="text-sm font-medium">
                  {isSelected ? 'Wybrane' : 'Wybierz'}
                </span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL ZE SZCZEGÓŁAMI */}
      {modalOption && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative">
            <button
              onClick={() => setModalOption(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-6 space-y-4">
              {/* HEADER */}
              <div className="text-center space-y-2">
                <div className="text-5xl">{modalOption.icon}</div>
                <h2 className="text-3xl font-bold">{modalOption.name}</h2>
                <p className="text-gray-600">{modalOption.description}</p>
              </div>

              {/* FEATURES */}
              {modalOption.features && (
                <ul className="space-y-2 text-left">
                  {modalOption.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}

              {/* PRICE */}
              {modalOption.price && (
                <div className="text-2xl font-bold text-purple-600 text-center">
                  {modalOption.price}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    updateChoice(sectionId, modalOption.id);  // toggle on
                    setModalOption(null);
                  }}
                >
                  Wybierz
                </Button>

                {selectedIds.includes(modalOption.id) && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      updateChoice(sectionId, modalOption.id); // toggle off
                      setModalOption(null);
                    }}
                  >
                    Anuluj
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultSection;
