
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const AIHelper: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState('');
  const [goal, setGoal] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !goal || !lifestyle) {
      toast("Proszę wypełnić wszystkie pola");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const mockRecommendation = `🤖 Na podstawie Twojego budżetu ${budget} zł i celu "${goal}":

🥗 **Dieta**: Polecam BeachBody Catering - idealnie wpasowuje się w Twój budżet i aktywny styl życia.

🏋️ **Siłownia**: PowerZone Gym będzie perfekcyjny dla Ciebie - dostaniesz prawdziwy hardcore trening.

🎉 **Imprezy**: Beach Party Series - świetna relacja jakości do ceny, idealne na relaks po treningach.

✈️ **Wakacje**: Bałtycki Roadtrip - pozwoli Ci odkryć piękno Polski w ramach budżetu.

💡 **Dodatkowe wskazówki**: 
- Zaplanuj treningi na 3-4 dni w tygodniu
- Wybieraj imprezy w weekendy dla lepszego work-life balance
- Wakacje zaplanuj na koniec lata jako nagrodę za wysiłek!`;

      setRecommendation(mockRecommendation);
      setIsLoading(false);
      
      toast("AI przygotowało Twoje spersonalizowane rekomendacje");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="text-2xl mr-3">🤖</span>
          AI Asystent Planowania
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budżet na cały plan (zł)</label>
              <input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="np. 2000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">Główny cel na lato</label>
              <select 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Wybierz cel</option>
                <option value="schudnac">Schudnąć</option>
                <option value="nabudowac-mase">Nabudować masę</option>
                <option value="byc-fit">Być fit i zdrowym</option>
                <option value="relaks">Maksymalny relaks</option>
                <option value="przygoda">Przygoda i nowe doświadczenia</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 mb-1">Opisz swój styl życia</label>
            <textarea
              id="lifestyle"
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value)}
              placeholder="np. Pracuję zdalnie, mam dużo czasu, lubię aktywny wypoczynek..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            {isLoading ? '🤔 AI myśli...' : '✨ Wygeneruj plan z AI'}
          </button>
        </form>
        
        {recommendation && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 text-blue-700">
              🎯 Twoje spersonalizowane rekomendacje:
            </h3>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHelper;
