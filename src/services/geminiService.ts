
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile } from "@/types/userProfile";

interface GeminiResponse {
  trainingPlan: string;
  dietPlan: string;
  recommendations: string[];
}

export const generatePersonalizedPlan = async (userData: any): Promise<GeminiResponse> => {
  const apiKey = localStorage.getItem('gemini-api-key') || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key nie został znaleziony. Proszę dodać klucz API w ustawieniach.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { currentWeight, targetWeight, height, age, gender, fitnessLevel, fitnessGoals, trainingDays, injuries } = userData;
    
    const prompt = `
Jesteś profesjonalnym trenerem personalnym i dietetykiem. Stwórz spersonalizowany plan treningowy i dietetyczny na podstawie następujących danych:

DANE UŻYTKOWNIKA:
- Obecna waga: ${currentWeight} kg
- Docelowa waga: ${targetWeight || 'nie podano'} kg
- Wzrost: ${height} cm
- Wiek: ${age} lat
- Płeć: ${gender === 'male' ? 'mężczyzna' : 'kobieta'}
- Poziom fitness: ${fitnessLevel}
- Cele treningowe: ${fitnessGoals?.join(', ') || 'nie podano'}
- Dni treningowe w tygodniu: ${trainingDays}
- Kontuzje/ograniczenia: ${injuries || 'brak'}

WYMAGANIA:
1. Plan treningowy dostosowany do poziomu i celów
2. Plan dietetyczny z wyliczeniem kalorii
3. 5-7 praktycznych rekomendacji

FORMATO ODPOWIEDZI:
Odpowiedz w formacie JSON:
{
  "trainingPlan": "szczegółowy plan treningowy w markdown",
  "dietPlan": "szczegółowy plan dietetyczny w markdown", 
  "recommendations": ["rekomendacja 1", "rekomendacja 2", "rekomendacja 3", "rekomendacja 4", "rekomendacja 5"]
}

Plan ma być profesjonalny, praktyczny i bezpieczny. Uwzględnij wszystkie podane dane użytkownika.
`;

    console.log('Wysyłanie zapytania do Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Otrzymano odpowiedź z Gemini:', text);

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return parsedResponse;
      }
    } catch (parseError) {
      console.warn('Błąd parsowania JSON, używam fallback:', parseError);
    }

    return {
      trainingPlan: text.includes('Plan treningowy') ? text : generateFallbackTrainingPlan(userData),
      dietPlan: text.includes('Plan dietetyczny') ? text : generateFallbackDietPlan(userData),
      recommendations: extractRecommendations(text) || generateFallbackRecommendations(userData)
    };

  } catch (error) {
    console.error('Błąd API Gemini:', error);
    throw new Error('Błąd podczas komunikacji z AI. Sprawdź klucz API i spróbuj ponownie.');
  }
};

const generateFallbackTrainingPlan = (userData: any) => {
  const { fitnessLevel, trainingDays, fitnessGoals } = userData;
  
  return `
# Plan Treningowy (${trainingDays} dni w tygodniu)

## Poziom: ${fitnessLevel}
## Cele: ${fitnessGoals?.join(', ') || 'Ogólna sprawność'}

### Dzień 1 - Górna część ciała:
- Pompki: 3 serie x 8-12 powtórzeń
- Podciąganie: 3 serie x 5-8 powtórzeń
- Wyciskanie hantelek: 3 serie x 10-12 powtórzeń

### Dzień 2 - Dolna część ciała:
- Przysiady: 3 serie x 12-15 powtórzeń
- Martwy ciąg: 3 serie x 8-10 powtórzeń
- Wypady: 3 serie x 10 na każdą nogę

${trainingDays >= 3 ? `
### Dzień 3 - Cardio i core:
- Bieganie: 30 minut
- Plank: 3 serie x 45 sekund
- Brzuszki: 3 serie x 15 powtórzeń
` : ''}

*Plan dostosowany automatycznie*
  `;
};

const generateFallbackDietPlan = (userData: any) => {
  const { currentWeight, height, age, gender } = userData;
  
  const bmr = gender === 'male' 
    ? 88.362 + (13.397 * currentWeight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * currentWeight) + (3.098 * height) - (4.330 * age);

  const dailyCalories = Math.round(bmr * 1.5);

  return `
# Plan Dietetyczny

## Dzienne zapotrzebowanie: ${dailyCalories} kcal

### Śniadanie (25% - ${Math.round(dailyCalories * 0.25)} kcal):
- Owsianka z owocami
- Jogurt naturalny
- Herbata zielona

### II Śniadanie (10% - ${Math.round(dailyCalories * 0.10)} kcal):
- Owoce sezonowe
- Garść orzechów

### Obiad (35% - ${Math.round(dailyCalories * 0.35)} kcal):
- Pierś z kurczaka (150g)
- Brązowy ryż (100g)
- Surówka z kapusty

### Podwieczorek (10% - ${Math.round(dailyCalories * 0.10)} kcal):
- Smoothie z bananem

### Kolacja (20% - ${Math.round(dailyCalories * 0.20)} kcal):
- Grillowane ryby
- Warzywa na parze
- Sałatka zielona

*Plan wygenerowany automatycznie*
  `;
};

const generateFallbackRecommendations = (userData: any) => [
  'Pij minimum 2.5L wody dziennie',
  'Śpij 7-8 godzin każdej nocy',
  'Rób rozgrzewkę przed treningiem',
  'Monitoruj postępy co tydzień',
  'Jedz regularnie co 3-4 godziny',
  'Włącz aktywność cardio 2-3 razy w tygodniu'
];

const extractRecommendations = (text: string): string[] | null => {
  const lines = text.split('\n');
  const recommendations: string[] = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      recommendations.push(line.trim().substring(1).trim());
    }
  }
  
  return recommendations.length > 0 ? recommendations : null;
};

export const generateWorkoutPlan = async (
  profile: UserProfile,
  apiKey: string,
  preferences?: {
    focusAreas?: string[];
    equipment?: string[];
    timePerSession?: number;
  }
): Promise<any> => {
  if (!apiKey) {
    throw new Error('Klucz API Gemini jest wymagany');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Jesteś doświadczonym personal trainerem. Na podstawie poniższego profilu użytkownika, stwórz szczegółowy plan treningowy.

PROFIL UŻYTKOWNIKA:
- Wiek: ${profile.age} lat
- Płeć: ${profile.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}
- Wzrost: ${profile.height} cm
- Obecna waga: ${profile.currentWeight} kg
- Poziom zaawansowania: ${profile.fitnessLevel}
- Cele treningowe: ${profile.fitnessGoals?.join(', ')}
- Dni treningowe w tygodniu: ${profile.trainingDays}
- Kontuzje/ograniczenia: ${profile.injuries?.join(', ') || 'Brak'}
${preferences?.focusAreas ? `- Obszary do skupienia: ${preferences.focusAreas.join(', ')}` : ''}
${preferences?.equipment ? `- Dostępny sprzęt: ${preferences.equipment.join(', ')}` : ''}
${preferences?.timePerSession ? `- Czas na trening: ${preferences.timePerSession} minut` : ''}

WAŻNE: Odpowiedź MUSI być w formacie czystego JSON bez znaczników markdown. Nie używaj \`\`\`json ani innych formatowań.

{
  "name": "Nazwa planu treningowego",
  "description": "Krótki opis planu",
  "workoutDays": [
    {
      "name": "Nazwa dnia treningowego (np. Dzień 1 - Klatka i triceps)",
      "exercises": [
        {
          "name": "Nazwa ćwiczenia",
          "sets": liczba_serii,
          "reps": "zakres_powtórzeń (np. 8-12)",
          "restTime": "czas_odpoczynku (np. 60-90s)",
          "description": "Krótki opis wykonania ćwiczenia",
          "muscleGroups": ["grupa_mięśniowa1", "grupa_mięśniowa2"]
        }
      ]
    }
  ],
  "tips": [
    "Praktyczna rada 1",
    "Praktyczna rada 2"
  ],
  "progressionAdvice": "Jak zwiększać intensywność treningu"
}
`;

    console.log('Generowanie planu treningowego...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Odpowiedź Gemini (surowa):', text);
    
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    console.log('Oczyszczony tekst do parsowania:', cleanedText);
    
    try {
      const workoutPlan = JSON.parse(cleanedText);
      
      const planWithIds = {
        ...workoutPlan,
        id: `workout-plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        workoutDays: workoutPlan.workoutDays.map((day: any, dayIndex: number) => ({
          ...day,
          id: `day-${dayIndex + 1}`,
          exercises: day.exercises.map((exercise: any, exerciseIndex: number) => ({
            ...exercise,
            id: `exercise-${dayIndex + 1}-${exerciseIndex + 1}`
          }))
        }))
      };
      
      console.log('Plan treningowy wygenerowany pomyślnie:', planWithIds);
      return planWithIds;
    } catch (parseError) {
      console.error('Błąd parsowania JSON:', parseError);
      console.error('Tekst do parsowania:', cleanedText);
      throw new Error('API zwróciło nieprawidłowy format danych. Spróbuj ponownie.');
    }
  } catch (error) {
    console.error('Błąd podczas generowania planu treningowego:', error);
    throw new Error(error instanceof Error ? error.message : 'Nieoczekiwany błąd podczas generowania planu');
  }
};

export const generateNutritionPlan = async (profileData: any): Promise<any> => {
  const apiKey = localStorage.getItem('gemini-api-key');
  
  if (!apiKey) {
    throw new Error('API Key nie został znaleziony. Proszę dodać klucz API w ustawieniach.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Jesteś profesjonalnym dietetykiem. Stwórz spersonalizowany plan żywieniowy na tydzień na podstawie następujących danych:

DANE UŻYTKOWNIKA:
- Dzienne kalorie: ${profileData.dailyCalories} kcal
- Posiłki dziennie: ${profileData.mealsPerDay}
- Preferencje dietetyczne: ${profileData.dietPreferences?.join(', ') || 'standardowa'}
- Alergie: ${profileData.allergies?.join(', ') || 'brak'}
- Nielubiane składniki: ${profileData.dislikedIngredients?.join(', ') || 'brak'}
- Czas na gotowanie: ${profileData.cookingTime || 'średni'}
- Waga: ${profileData.currentWeight || 'nie podano'} kg
- Wzrost: ${profileData.height || 'nie podano'} cm
- Wiek: ${profileData.age || 'nie podano'} lat
- Cel: ${profileData.targetWeight ? 'osiągnięcie ' + profileData.targetWeight + ' kg' : 'utrzymanie wagi'}

WYMAGANIA:
1. Plan na 7 dni (poniedziałek-niedziela)
2. Każdy dzień ma ${profileData.mealsPerDay} posiłków
3. Każdy posiłek z nazwą, opisem, składnikami, kaloriami i czasem
4. Uwzględnij wszystkie preferencje i ograniczenia
5. Rekomendacje żywieniowe

FORMAT ODPOWIEDZI (MUSI być w czystym JSON):
{
  "dailyCalories": ${profileData.dailyCalories},
  "mealsPerDay": ${profileData.mealsPerDay},
  "weeklyGoal": "cel tygodniowy",
  "weeklyMeals": {
    "Poniedziałek": [
      {
        "name": "Nazwa posiłku",
        "time": "07:00",
        "calories": 400,
        "description": "Opis posiłku",
        "ingredients": ["składnik1", "składnik2"]
      }
    ],
    "Wtorek": [...],
    "Środa": [...],
    "Czwartek": [...],
    "Piątek": [...],
    "Sobota": [...],
    "Niedziela": [...]
  },
  "recommendations": [
    "Rekomendacja 1",
    "Rekomendacja 2"
  ],
  "nutritionTips": [
    "Rada 1",
    "Rada 2"
  ]
}

Plan ma być zdrowy, zbilansowany i dopasowany do potrzeb użytkownika.
`;

    console.log('Generowanie planu żywieniowego...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Odpowiedź Gemini (surowa):', text);
    
    let cleanedText = text.trim();
    
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    cleanedText = cleanedText.replace(/'/g, '"');
    cleanedText = cleanedText.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    
    console.log('Oczyszczony tekst do parsowania:', cleanedText);
    
    try {
      const nutritionPlan = JSON.parse(cleanedText);
      
      if (!nutritionPlan.weeklyMeals || typeof nutritionPlan.weeklyMeals !== 'object') {
        throw new Error('Brak prawidłowej struktury weeklyMeals');
      }
      
      const planWithMeta = {
        ...nutritionPlan,
        id: `nutrition-plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        profileSnapshot: profileData
      };
      
      console.log('Plan żywieniowy wygenerowany pomyślnie:', planWithMeta);
      return planWithMeta;
    } catch (parseError) {
      console.error('Błąd parsowania JSON:', parseError);
      console.error('Tekst do parsowania:', cleanedText);
      
      const fallbackPlan = {
        id: `nutrition-plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        dailyCalories: profileData.dailyCalories,
        mealsPerDay: profileData.mealsPerDay,
        weeklyGoal: 'Zbilansowane odżywianie',
        weeklyMeals: {
          'Poniedziałek': [
            {
              name: 'Śniadanie',
              time: '07:00',
              calories: Math.round(profileData.dailyCalories * 0.25),
              description: 'Owsianka z owocami i orzechami',
              ingredients: ['płatki owsiane', 'mleko', 'banan', 'orzechy']
            }
          ]
        },
        recommendations: ['Pij dużo wody', 'Jedz regularnie'],
        nutritionTips: ['Włącz więcej warzyw', 'Ogranicz cukier'],
        profileSnapshot: profileData
      };
      
      return fallbackPlan;
    }
  } catch (error) {
    console.error('Błąd podczas generowania planu żywieniowego:', error);
    throw new Error(error instanceof Error ? error.message : 'Nieoczekiwany błąd podczas generowania planu');
  }
};
