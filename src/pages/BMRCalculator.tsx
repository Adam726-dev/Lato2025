import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CalorieForecast from '@/components/CalorieForecast';
import { ArrowLeft, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BMRData {
  age: string;
  weight: string;
  height: string;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'weight-loss' | 'muscle-gain' | 'maintenance';
  targetWeight: string;
}

interface CateringOption { id: number; name: string; calories: number; price: number; type: string }
interface WorkoutOption   { id: number; name: string; caloriesBurn: number; sessions: number; type: string }

interface CalorieResult {
  bmr: number;
  dailyCalories: number;
  intake: number;
  recommendedCatering: CateringOption;
  recommendedWorkout: WorkoutOption;
  weightDifference: number;
}

const cateringOptions: CateringOption[] = [
  { id: 1, name: 'BeachBody Catering', calories: 1800, price: 45, type: 'Aktywny' },
  { id: 2, name: 'Summer Fresh', calories: 1500, price: 38, type: 'Lekki' },
  { id: 3, name: 'FitMeals Pro', calories: 2200, price: 52, type: 'Sportowy' },
  { id: 4, name: 'Mediterranean Style', calories: 1900, price: 42, type: 'Zrównoważony' },
];

const workoutOptions: WorkoutOption[] = [
  { id: 1, name: 'PowerZone Gym - Siła', caloriesBurn: 300, sessions: 4, type: 'Hardcore' },
  { id: 2, name: 'YogaFit Studio - Pilates', caloriesBurn: 200, sessions: 5, type: 'Spokojny' },
  { id: 3, name: 'GymMax Premium - Cardio', caloriesBurn: 400, sessions: 3, type: 'Intensywny' },
  { id: 4, name: 'AquaFit Center - Aqua', caloriesBurn: 250, sessions: 4, type: 'Wodny' },
];

const calculateBMR = (data: { age: number; weight: number; height: number; gender: 'male' | 'female' }) =>
  data.gender === 'male'
    ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
    : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

const getActivityMultiplier = (level: BMRData['activityLevel']) => ({
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
}[level]);

const findBestCatering = (targetCalories: number) =>
  cateringOptions.reduce((best, curr) =>
    Math.abs(curr.calories - targetCalories) < Math.abs(best.calories - targetCalories)
      ? curr
      : best
  , cateringOptions[0]);

const findBestWorkout = (goal: BMRData['goal']) => {
  if (goal === 'weight-loss') return workoutOptions[2];
  if (goal === 'muscle-gain') return workoutOptions[0];
  return workoutOptions[1];
};

const BMRCalculator: React.FC = () => {
  const [formData, setFormData] = useState<BMRData>({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintenance',
    targetWeight: '',
  });
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Jeśli cel zmienia się na "maintenance", czyścimy docelową wagę
  useEffect(() => {
    if (formData.goal === 'maintenance' && formData.targetWeight) {
      setFormData(f => ({ ...f, targetWeight: '' }));
    }
  }, [formData.goal]);

  const handleTargetChange = (raw: string) => {
    setFormData(f => ({ ...f, targetWeight: raw }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age, 10);
    const weightNum = parseFloat(formData.weight);
    const heightNum = parseFloat(formData.height);
    const targetNum = parseFloat(formData.targetWeight);

    // Walidacja wszystkich niezbędnych pól
    if (
      isNaN(ageNum) ||
      isNaN(weightNum) ||
      isNaN(heightNum) ||
      (formData.goal !== 'maintenance' && isNaN(targetNum)) ||
      !formData.activityLevel
    ) {
      toast('Proszę uzupełnić wszystkie pola');
      return;
    }

    // Walidacja relacji wagi w zależności od celu
    if (formData.goal === 'weight-loss' && targetNum >= weightNum) {
      toast('Docelowa waga musi być mniejsza od obecnej');
      return;
    }
    if (formData.goal === 'muscle-gain' && targetNum <= weightNum) {
      toast('Docelowa waga musi być większa od obecnej');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const bmr = calculateBMR({
        age: ageNum,
        weight: weightNum,
        height: heightNum,
        gender: formData.gender,
      });
      const dailyCalories = bmr * getActivityMultiplier(formData.activityLevel);

      let intake = dailyCalories;
      if (formData.goal === 'weight-loss') intake -= 500;
      if (formData.goal === 'muscle-gain') intake += 300;

      const recommendedCatering = findBestCatering(intake);
      const recommendedWorkout = findBestWorkout(formData.goal);
      const weightDifference =
        formData.goal === 'maintenance' ? 0 : Math.abs(weightNum - targetNum);

      setResult({
        bmr,
        dailyCalories,
        intake,
        recommendedCatering,
        recommendedWorkout,
        weightDifference,
      });
      setIsLoading(false);
      toast('Plan wygenerowany');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto p-6">
        <Link to="/" className="inline-block text-gray-600 hover:underline mb-4">
          ← Powróć do strony głównej
        </Link>

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div className="text-center">
            <Calculator className="mx-auto h-10 w-10 text-blue-500 mb-2" />
            <h1 className="text-2xl font-bold">Kalkulator BMR</h1>
            <p className="text-gray-500">Oblicz zapotrzebowanie i dobierz plan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wiek (lata)</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData(f => ({ ...f, age: e.target.value }))}
                placeholder="25"
                className="w-full border rounded-md p-2 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Płeć</label>
              <select
                value={formData.gender}
                onChange={e => setFormData(f => ({ ...f, gender: e.target.value as any }))}
                className="w-full border rounded-md p-2"
              >
                <option value="male">Mężczyzna</option>
                <option value="female">Kobieta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aktualna waga (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={e => setFormData(f => ({ ...f, weight: e.target.value }))}
                placeholder="70"
                className="w-full border rounded-md p-2 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wzrost (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={e => setFormData(f => ({ ...f, height: e.target.value }))}
                placeholder="175"
                className="w-full border rounded-md p-2 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cel</label>
              <select
                value={formData.goal}
                onChange={e => setFormData(f => ({ ...f, goal: e.target.value as any }))}
                className="w-full border rounded-md p-2"
              >
                <option value="weight-loss">Utrata wagi</option>
                <option value="muscle-gain">Przyrost masy</option>
                <option value="maintenance">Utrzymanie wagi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poziom aktywności</label>
              <select
                value={formData.activityLevel}
                onChange={e => setFormData(f => ({ ...f, activityLevel: e.target.value as any }))}
                className="w-full border rounded-md p-2"
              >
                <option value="sedentary">Siedzący (spacer do lodówki)</option>
                <option value="light">Lekko aktywny (1-2 dni w tygodniu)</option>
                <option value="moderate">Umiarkowany (3-4 dni w tygodniu)</option>
                <option value="active">Bardzo aktywny (5-6 dni w tygodniu)</option>
                <option value="very-active">Ekstremalnie aktywny (nie zatrzymujesz się!)</option>
              </select>
            </div>
            {formData.goal !== 'maintenance' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Docelowa waga (kg)</label>
                <input
                  type="number"
                  value={formData.targetWeight}
                  onChange={e => handleTargetChange(e.target.value)}
                  placeholder="65"
                  className="w-full border rounded-md p-2 placeholder-gray-400"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition"
          >
            {isLoading ? 'Obliczam...' : 'Oblicz i dobierz plan'}
          </button>
        </form>

        {result && (
          <section className="space-y-6">
            {/* Wyniki metaboliczne */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Twoje wyniki metaboliczne</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-4">
                {[
                  { label: 'BMR', value: result.bmr, color: 'text-blue-600' },
                  { label: 'TDEE', value: result.dailyCalories, color: 'text-orange-600' },
                  { label: 'Plan kcal', value: result.intake, color: 'text-green-600' },
                ].map((it, i) => (
                  <div key={i}>
                    <div className={`text-2xl font-bold ${it.color}`}>{Math.round(it.value)}</div>
                    <div className="text-sm text-gray-500">{it.label} (kcal/dzień)</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catering & trening */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-2">🥗 Rekomendowany catering</h3>
                <p className="text-xl font-bold">{result.recommendedCatering.name}</p>
                <p className="text-gray-600">{result.recommendedCatering.calories} kcal/dzień</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {result.recommendedCatering.type}
                </span>
                <div className="mt-4 text-2xl font-extrabold text-blue-600">
                  {result.recommendedCatering.price} zł/dzień
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-2">🏋️‍♀️ Rekomendowany trening</h3>
                <p className="text-xl font-bold">{result.recommendedWorkout.name}</p>
                <p className="text-gray-600">
                  {result.recommendedWorkout.caloriesBurn} kcal × {result.recommendedWorkout.sessions} sesji/tydzień
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs">
                  {result.recommendedWorkout.type}
                </span>
                <div className="mt-4 text-2xl font-extrabold text-orange-600">
                  {result.recommendedWorkout.caloriesBurn * result.recommendedWorkout.sessions} kcal/tydz.
                </div>
              </div>
            </div>

            {/* Prognoza zmiany masy */}
            <div className={`rounded-lg shadow p-6 text-white ${result.intake >= result.dailyCalories ? 'bg-green-500' : 'bg-orange-500'}`}>
              <h3 className="font-semibold mb-2">
                {result.intake >= result.dailyCalories ? 'Nadwyżka' : 'Deficyt'}:{' '}
                <span className="font-bold">{Math.abs(result.intake - result.dailyCalories)} kcal/dzień</span>
              </h3>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                  <div className="text-3xl font-extrabold">
                    {Math.abs(((result.intake - result.dailyCalories) * 7) / 7000).toFixed(1)} kg/tydzień
                  </div>
                  <div className="text-sm">{result.intake >= result.dailyCalories ? 'Przyrost masy' : 'Utrata masy'}</div>
                </div>
                <div className="text-sm">
                  Osiągniesz cel (~{result.weightDifference} kg) w ok.{' '}
                  <span className="font-semibold">
                    {result.intake === result.dailyCalories
                      ? '∞'
                      : Math.ceil(result.weightDifference / (Math.abs((result.intake - result.dailyCalories) * 7) / 7000))}
                  </span>{' '}
                  tygodni
                </div>
              </div>
            </div>

            {/* Akcje */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/dieta">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold">
                  🥗 Zamów catering
                </button>
              </Link>
              <Link to="/silownia">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold">
                  🏋️‍♀️ Wybierz siłownię
                </button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BMRCalculator;
