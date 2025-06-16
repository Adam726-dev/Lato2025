
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BMRCalculatorWidgetProps {
  onCaloriesCalculated: (calories: number) => void;
}

const BMRCalculatorWidget: React.FC<BMRCalculatorWidgetProps> = ({ onCaloriesCalculated }) => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male' as 'male' | 'female',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  });
  const [result, setResult] = useState<number | null>(null);

  const calculateBMR = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (!age || !weight || !height) return;

    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9
    };

    const dailyCalories = Math.round(bmr * activityMultipliers[formData.activityLevel]);
    setResult(dailyCalories);
  };

  const useCalculatedCalories = () => {
    if (result) {
      onCaloriesCalculated(result);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Kalkulator BMR - Oblicz swoje zapotrzebowanie kaloryczne
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="age">Wiek (lata)</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="25"
            />
          </div>
          <div>
            <Label htmlFor="gender">Płeć</Label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
            </select>
          </div>
          <div>
            <Label htmlFor="weight">Waga (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              placeholder="70"
            />
          </div>
          <div>
            <Label htmlFor="height">Wzrost (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              placeholder="175"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="activity">Poziom aktywności</Label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData({...formData, activityLevel: e.target.value as any})}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="sedentary">Siedzący tryb życia</option>
            <option value="light">Lekko aktywny (1-3 dni w tygodniu)</option>
            <option value="moderate">Umiarkowanie aktywny (3-5 dni w tygodniu)</option>
            <option value="active">Bardzo aktywny (6-7 dni w tygodniu)</option>
            <option value="very-active">Ekstremalnie aktywny (2x dziennie, intensywne treningi)</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <Button onClick={calculateBMR}>
            Oblicz zapotrzebowanie kaloryczne
          </Button>
          
          {result && (
            <div className="flex items-center gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result}</div>
                <div className="text-sm text-gray-600">kcal/dzień</div>
              </div>
              <Button variant="outline" onClick={useCalculatedCalories}>
                Użyj tej wartości
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BMRCalculatorWidget;
