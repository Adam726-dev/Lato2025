
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingDown, Calendar, Target, Zap } from 'lucide-react';

interface ProgressPredictorProps {
  dietPlan: any;
  profile: any;
  onComplete: () => void;
  onBack: () => void;
}

const ProgressPredictor: React.FC<ProgressPredictorProps> = ({ 
  dietPlan, 
  profile, 
  onComplete, 
  onBack 
}) => {
  const calculateProgress = () => {
    const currentWeight = profile.currentWeight || 70;
    const targetWeight = profile.targetWeight || currentWeight - 5;
    const dailyCalories = profile.dailyCalories || 2000;
    const bmr = calculateBMR();
    
    const weeklyDeficit = (bmr * 7) - (dailyCalories * 7);
    const weeklyWeightLoss = weeklyDeficit / 7700;
    
    const totalWeightToLose = Math.abs(currentWeight - targetWeight);
    const weeksToGoal = Math.ceil(totalWeightToLose / Math.abs(weeklyWeightLoss));
    
    return {
      weeklyWeightLoss: Math.abs(weeklyWeightLoss),
      monthlyWeightLoss: Math.abs(weeklyWeightLoss) * 4,
      weeksToGoal,
      targetDate: new Date(Date.now() + weeksToGoal * 7 * 24 * 60 * 60 * 1000)
    };
  };

  const calculateBMR = () => {
    const { currentWeight = 70, height = 170, age = 30, gender = 'male' } = profile;
    
    if (gender === 'male') {
      return 88.362 + (13.397 * currentWeight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * currentWeight) + (3.098 * height) - (4.330 * age);
    }
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          📈 Prognoza Twojego Postępu
        </h1>
        <p className="text-xl text-white">
          Przewidywane rezultaty na podstawie Twojego planu dietetycznego i treningowego
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Twoje Cele
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{profile.currentWeight || 'N/A'} kg</div>
                <div className="text-sm text-gray-600">Obecna waga</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{profile.targetWeight || 'N/A'} kg</div>
                <div className="text-sm text-gray-600">Cel wagowy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{profile.dailyCalories || 'N/A'}</div>
                <div className="text-sm text-gray-600">kcal dziennie</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Przewidywany Postęp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {progress.weeklyWeightLoss.toFixed(1)} kg
                </div>
                <div className="text-sm text-gray-600">tygodniowo</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {progress.monthlyWeightLoss.toFixed(1)} kg
                </div>
                <div className="text-sm text-gray-600">miesięcznie</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {progress.weeksToGoal}
                </div>
                <div className="text-sm text-gray-600">tygodni do celu</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Przewidywana data osiągnięcia celu
              </h3>
              <p className="text-xl font-bold text-green-600">
                {progress.targetDate.toLocaleDateString('pl-PL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Kluczowe Czynniki Sukcesu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <h4 className="font-medium">Konsekwencja w diecie</h4>
                  <p className="text-sm text-gray-600">
                    Trzymanie się planu {profile.dailyCalories || 2000} kcal dziennie
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <h4 className="font-medium">Regularna aktywność</h4>
                  <p className="text-sm text-gray-600">
                    {profile.trainingDays || 3} treningi w tygodniu zgodnie z planem
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <h4 className="font-medium">Monitoring postępów</h4>
                  <p className="text-sm text-gray-600">
                    Cotygodniowe ważenie i pomiary
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <h4 className="font-medium">Odpoczynek</h4>
                  <p className="text-sm text-gray-600">
                    7-8 godzin snu i dni odpoczynku
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Wróć do cateringu
        </Button>
        <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
          Zakończ kreator →
        </Button>
      </div>
    </div>
  );
};

export default ProgressPredictor;
