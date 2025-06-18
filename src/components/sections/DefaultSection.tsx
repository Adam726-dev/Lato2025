import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface DefaultSectionProps {
  sectionId: string;
  section: any;
  choices: any;
  updateChoice: (sectionId: string, optionId: string) => void;
}

const DefaultSection: React.FC<DefaultSectionProps> = ({ sectionId, section, choices, updateChoice }) => {
  return (
    <div>
      {section.wizardComponent && (
        <div className="mb-8 text-center">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
            <Link to={`/${sectionId}/wizard`}>
              🧙‍♂️ Spersonalizowany kreator
            </Link>
          </Button>
          <p className="text-gray-600 mt-2">lub wybierz gotową opcję poniżej</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.options?.map((option: any) => {
          const isSelected = choices[sectionId] === option.id;
          
          return (
            <div
              key={option.id}
              className={`
                bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 
                hover:shadow-xl hover:scale-105 border-2
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}
              onClick={() => updateChoice(sectionId, option.id.toString())}
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                
                {option.features && (
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {option.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center justify-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                {option.price && (
                  <div className="text-lg font-bold text-blue-600 mb-2">
                    {option.price}
                  </div>
                )}
                
                <div className="flex items-center justify-center text-blue-600">
                  <span className="text-sm font-medium">
                    {isSelected ? 'Wybrane' : 'Wybierz'}
                  </span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DefaultSection;