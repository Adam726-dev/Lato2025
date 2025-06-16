
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { generateWorkoutPlan } from '@/services/geminiService';
import { saveWorkoutPlan } from '@/services/workoutPlanService';
import { toast } from 'sonner';
import { Input, Label, Button, FormGroup, FormRow, Checkbox } from '@/components/FormElements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as geminiService from '@/services/geminiService';
import * as workoutPlanService from '@/services/workoutPlanService';
import ApiKeyManager from './ApiKeyManager';

const PlanGenerator: React.FC = () => {
  const { profile } = useUserProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [apiKeyExists, setApiKeyExists] = useState(false);
  const [preferences, setPreferences] = useState({
    focusAreas: [],
    equipment: [],
    timePerSession: 60,
  });

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('gemini-api-key');
      setApiKeyExists(!!apiKey);
    };
    
    checkApiKey();
    const interval = setInterval(checkApiKey, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePreferenceToggle = (type: 'focusAreas' | 'equipment', value: string) => {
    setPreferences(prev => {
      const current = prev[type] || [];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const generateWorkoutPlanHandler = async () => {
    const apiKey = localStorage.getItem('gemini-api-key');
    
    if (!apiKey) {
      toast.error('Brak klucza API', {
        description: 'Proszę wprowadzić klucz API Gemini w sekcji konfiguracji powyżej'
      });
      return;
    }

    setIsGenerating(true);
    try {
      const workoutPlan = await geminiService.generateWorkoutPlan(profile, apiKey, {
        focusAreas: preferences.focusAreas,
        equipment: preferences.equipment,
        timePerSession: preferences.timePerSession
      });
      
      workoutPlanService.saveWorkoutPlan(workoutPlan);
      
      setGeneratedPlan(workoutPlan);
      toast.success('Plan treningowy wygenerowany!', {
        description: 'Plan został zapisany i jest dostępny w sekcji treningów'
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast.error('Błąd podczas generowania planu', {
        description: error instanceof Error ? error.message : 'Spróbuj ponownie'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ApiKeyManager />
      
      {apiKeyExists ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">💪 Generator Planu Treningowego</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label>Preferowane obszary do skupienia</Label>
              <FormRow>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.focusAreas.includes('klatka')}
                    onCheckedChange={() => handlePreferenceToggle('focusAreas', 'klatka')}
                  />
                  <span>Klatka piersiowa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.focusAreas.includes('plecy')}
                    onCheckedChange={() => handlePreferenceToggle('focusAreas', 'plecy')}
                  />
                  <span>Plecy</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.focusAreas.includes('nogi')}
                    onCheckedChange={() => handlePreferenceToggle('focusAreas', 'nogi')}
                  />
                  <span>Nogi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.focusAreas.includes('biceps')}
                    onCheckedChange={() => handlePreferenceToggle('focusAreas', 'biceps')}
                  />
                  <span>Biceps</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.focusAreas.includes('triceps')}
                    onCheckedChange={() => handlePreferenceToggle('focusAreas', 'triceps')}
                  />
                  <span>Triceps</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.focusAreas.includes('barki')}
                    onCheckedChange={() => handlePreferenceToggle('focusAreas', 'barki')}
                  />
                  <span>Barki</span>
                </label>
              </FormRow>
            </FormGroup>

            <FormGroup>
              <Label>Dostępny sprzęt</Label>
              <FormRow>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.equipment.includes('sztanga')}
                    onCheckedChange={() => handlePreferenceToggle('equipment', 'sztanga')}
                  />
                  <span>Sztanga</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.equipment.includes('hantle')}
                    onCheckedChange={() => handlePreferenceToggle('equipment', 'hantle')}
                  />
                  <span>Hantle</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.equipment.includes('maszyny')}
                    onCheckedChange={() => handlePreferenceToggle('equipment', 'maszyny')}
                  />
                  <span>Maszyny</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={preferences.equipment.includes('brak')}
                    onCheckedChange={() => handlePreferenceToggle('equipment', 'brak')}
                  />
                  <span>Brak sprzętu (ćwiczenia z własną masą ciała)</span>
                </label>
              </FormRow>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="time-per-session">Czas na trening (minuty)</Label>
              <Input
                type="number"
                id="time-per-session"
                placeholder="np. 60"
                value={preferences.timePerSession}
                onChange={(e) => setPreferences({ ...preferences, timePerSession: Number(e.target.value) })}
              />
            </FormGroup>

            <Button onClick={generateWorkoutPlanHandler} disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generowanie...' : 'Generuj plan treningowy'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">
              Proszę skonfigurować klucz API Gemini powyżej, aby móc generować plany treningowe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanGenerator;
