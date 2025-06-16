import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, RadioGroup, RadioGroupItem, Textarea, Badge } from './FormElements';
import { X } from 'lucide-react';

interface HabitFormationFormProps {
  onComplete: () => void;
}

const HabitFormationForm: React.FC<HabitFormationFormProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();

  const [formData, setFormData] = useState({
    currentHabits: profile.currentHabits || [],
    targetHabits: profile.targetHabits || [],
    habitDifficulty: profile.habitDifficulty || '',
    reminderFrequency: profile.reminderFrequency || '',
    motivationStyle: profile.motivationStyle || '',
    habitTrackingMethod: profile.habitTrackingMethod || '',
    consistencyGoal: profile.consistencyGoal || 7,
  });

  const [newCurrentHabit, setNewCurrentHabit] = useState('');
  const [newTargetHabit, setNewTargetHabit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToUpdate: any = {};
    if (formData.currentHabits.length > 0) dataToUpdate.currentHabits = formData.currentHabits;
    if (formData.targetHabits.length > 0) dataToUpdate.targetHabits = formData.targetHabits;
    if (formData.habitDifficulty && formData.habitDifficulty !== '') {
      dataToUpdate.habitDifficulty = formData.habitDifficulty as 'easy' | 'medium' | 'hard';
    }
    if (formData.reminderFrequency && formData.reminderFrequency !== '') {
      dataToUpdate.reminderFrequency = formData.reminderFrequency as 'daily' | 'weekly' | 'custom';
    }
    if (formData.motivationStyle && formData.motivationStyle !== '') {
      dataToUpdate.motivationStyle = formData.motivationStyle as 'achievement_based' | 'streak_based' | 'reward_based' | 'social_pressure';
    }
    if (formData.habitTrackingMethod && formData.habitTrackingMethod !== '') {
      dataToUpdate.habitTrackingMethod = formData.habitTrackingMethod as 'simple' | 'detailed' | 'gamified';
    }
    if (formData.consistencyGoal) dataToUpdate.consistencyGoal = formData.consistencyGoal;

    updateProfile(dataToUpdate);
    onComplete();
  };

  const addCurrentHabit = () => {
    if (newCurrentHabit.trim()) {
      setFormData(prev => ({
        ...prev,
        currentHabits: [...prev.currentHabits, newCurrentHabit.trim()]
      }));
      setNewCurrentHabit('');
    }
  };

  const removeCurrentHabit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      currentHabits: prev.currentHabits.filter((_, i) => i !== index)
    }));
  };

  const addTargetHabit = () => {
    if (newTargetHabit.trim()) {
      setFormData(prev => ({
        ...prev,
        targetHabits: [...prev.targetHabits, newTargetHabit.trim()]
      }));
      setNewTargetHabit('');
    }
  };

  const removeTargetHabit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetHabits: prev.targetHabits.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            🎯 Habit Formation Coach AI
          </CardTitle>
          <p className="text-center text-gray-600">
            Skonfiguruj AI trenera, który pomoże Ci budować pozytywne nawyki i osiągać cele
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Habits */}
            <div>
              <Label>Obecne pozytywne nawyki</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newCurrentHabit}
                  onChange={(e) => setNewCurrentHabit(e.target.value)}
                  placeholder="np. Trening 3x w tygodniu"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCurrentHabit())}
                />
                <Button type="button" onClick={addCurrentHabit} variant="outline">
                  Dodaj
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.currentHabits.map((habit, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {habit}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeCurrentHabit(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Target Habits */}
            <div>
              <Label>Nawyki, które chcesz rozwinąć</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTargetHabit}
                  onChange={(e) => setNewTargetHabit(e.target.value)}
                  placeholder="np. Medytacja codziennie"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetHabit())}
                />
                <Button type="button" onClick={addTargetHabit} variant="outline">
                  Dodaj
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.targetHabits.map((habit, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {habit}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTargetHabit(index)}
                    />
                  </Badge>
                ))}
              </div>
              {formData.targetHabits.length === 0 && (
                <p className="text-sm text-red-500 mt-1">Dodaj przynajmniej jeden nawyk docelowy</p>
              )}
            </div>

            {/* Habit Difficulty */}
            <div>
              <Label>Preferowana trudność wyzwań</Label>
              <RadioGroup 
                value={formData.habitDifficulty} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, habitDifficulty: value as any }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">🟢 Łatwe - małe kroki każdego dnia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">🟡 Średnie - umiarkowane wyzwania</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">🔴 Trudne - ambitne cele i wyzwania</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Reminder Frequency */}
            <div>
              <Label>Częstotliwość przypomnień</Label>
              <RadioGroup 
                value={formData.reminderFrequency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, reminderFrequency: value as any }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">📅 Codziennie</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">📆 Raz w tygodniu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">⚙️ Niestandardowe</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Motivation Style */}
            <div>
              <Label>Styl motywacji</Label>
              <RadioGroup 
                value={formData.motivationStyle} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, motivationStyle: value as any }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="achievement_based" id="achievement_based" />
                  <Label htmlFor="achievement_based">🏆 Osiągnięcia i nagrody</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="streak_based" id="streak_based" />
                  <Label htmlFor="streak_based">🔥 Serie i streaki</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reward_based" id="reward_based" />
                  <Label htmlFor="reward_based">🎁 System nagród</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="social_pressure" id="social_pressure" />
                  <Label htmlFor="social_pressure">👥 Presja społeczna</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Habit Tracking Method */}
            <div>
              <Label>Metoda śledzenia nawyków</Label>
              <RadioGroup 
                value={formData.habitTrackingMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, habitTrackingMethod: value as any }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="simple" id="simple" />
                  <Label htmlFor="simple">✅ Proste - tylko tak/nie</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed" id="detailed" />
                  <Label htmlFor="detailed">📊 Szczegółowe - z metrykami</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gamified" id="gamified" />
                  <Label htmlFor="gamified">🎮 Gamifikowane - punkty i poziomy</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Consistency Goal */}
            <div>
              <Label htmlFor="consistencyGoal">Cel systematyczności (dni z rzędu)</Label>
              <Input
                id="consistencyGoal"
                type="number"
                min="1"
                max="365"
                value={formData.consistencyGoal}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  consistencyGoal: parseInt(e.target.value) || 7
                }))}
                placeholder="7"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={formData.targetHabits.length === 0}
            >
              Aktywuj Habit Formation Coach AI 🎯
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitFormationForm;
