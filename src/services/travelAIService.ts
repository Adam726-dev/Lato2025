
import { GoogleGenerativeAI } from "@google/generative-ai";

interface TravelPlanResponse {
  itinerary: string;
  recommendations: string[];
  budgetBreakdown: string;
  packingList: string[];
}

export const generateTravelPlan = async (userData: any): Promise<TravelPlanResponse> => {
  const apiKey = localStorage.getItem('gemini-api-key');
  
  if (!apiKey) {
    throw new Error('API Key nie został znaleziony. Proszę dodać klucz API w ustawieniach.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const { 
      travelBudget, 
      travelStyle, 
      accommodationPreference, 
      transportPreference, 
      destinationPreferences, 
      travelCompanions 
    } = userData;
    
    const prompt = `
Jesteś profesjonalnym doradcą podróży i ekspertem od turystyki. Stwórz spersonalizowany plan podróży na podstawie następujących danych:

DANE PODRÓŻNIKA:
- Budżet: ${travelBudget || 'nie podano'} zł
- Styl podróżowania: ${travelStyle || 'nie podano'}
- Preferowany nocleg: ${accommodationPreference || 'nie podano'}
- Preferowany transport: ${transportPreference || 'nie podano'}
- Preferowane destynacje: ${destinationPreferences?.join(', ') || 'nie podano'}
- Towarzystwo podróży: ${travelCompanions || 'nie podano'}

WYMAGANIA:
1. Szczegółowy plan podróży (itinerary) z harmonogramem
2. Podział budżetu na kategorie
3. 5-7 praktycznych rekomendacji
4. Lista rzeczy do spakowania

FORMATO ODPOWIEDZI:
Odpowiedz w formacie JSON:
{
  "itinerary": "szczegółowy plan podróży w markdown z harmonogramem",
  "budgetBreakdown": "podział budżetu w markdown",
  "recommendations": ["rekomendacja 1", "rekomendacja 2", "rekomendacja 3", "rekomendacja 4", "rekomendacja 5"],
  "packingList": ["rzecz 1", "rzecz 2", "rzecz 3", "rzecz 4", "rzecz 5"]
}

Plan ma być praktyczny, realny i dostosowany do podanego budżetu oraz preferencji.
`;

    console.log('Wysyłanie zapytania do Gemini API dla planu podróży...');
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
      itinerary: text.includes('itinerary') ? text : generateFallbackItinerary(userData),
      budgetBreakdown: text.includes('budżet') ? text : generateFallbackBudget(userData),
      recommendations: extractRecommendations(text) || generateFallbackRecommendations(userData),
      packingList: extractPackingList(text) || generateFallbackPackingList(userData)
    };

  } catch (error) {
    console.error('Błąd API Gemini:', error);
    throw new Error('Błąd podczas komunikacji z AI. Sprawdź klucz API i spróbuj ponownie.');
  }
};

const generateFallbackItinerary = (userData: any) => {
  const { destinationPreferences, travelCompanions } = userData;
  
  return `
# Plan Podróży

## Dzień 1 - Przyjazd i pierwsza eksploracja
- Przyjazd do destynacji
- Zameldowanie w ${userData.accommodationPreference || 'wybranym noclegu'}
- Spacer po okolicy i orientacja w terenie

## Dzień 2 - Główne atrakcje
${destinationPreferences?.includes('cities') ? '- Zwiedzanie centrum miasta i głównych zabytków' : ''}
${destinationPreferences?.includes('beach') ? '- Relaks na plaży i aktywności wodne' : ''}
${destinationPreferences?.includes('mountains') ? '- Wycieczka w góry i trekking' : ''}

## Dzień 3 - Lokalne doświadczenia
- Poznawanie lokalnej kultury
- Degustacja regionalnych potraw
- ${travelCompanions === 'solo' ? 'Czas na refleksję' : 'Wspólne aktywności'}

*Plan dostosowany automatycznie*
  `;
};

const generateFallbackBudget = (userData: any) => {
  const budget = userData.travelBudget || 3000;
  
  return `
# Podział Budżetu - ${budget} zł

- **Transport**: ${Math.round(budget * 0.3)} zł (30%)
- **Nocleg**: ${Math.round(budget * 0.35)} zł (35%)
- **Jedzenie**: ${Math.round(budget * 0.25)} zł (25%)
- **Atrakcje i rozrywka**: ${Math.round(budget * 0.1)} zł (10%)

*Podział wygenerowany automatycznie*
  `;
};

const generateFallbackRecommendations = (userData: any) => [
  'Sprawdź prognozę pogody przed wyjazdem',
  'Zrób kopie ważnych dokumentów',
  'Pobierz offline mapy na telefon',
  'Weź uniwersalną ładowarkę',
  'Poznaj podstawowe zwroty w lokalnym języku',
  'Sprawdź lokalne zwyczaje i kulturę'
];

const generateFallbackPackingList = (userData: any) => [
  'Dokumenty (paszport, dowód, ubezpieczenie)',
  'Wygodne buty do chodzenia',
  'Odzież dopasowana do klimatu',
  'Ładowarka do telefonu',
  'Apteczka podróżna',
  'Krem z filtrem UV'
];

const extractRecommendations = (text: string): string[] | null => {
  const lines = text.split('\n');
  const recommendations: string[] = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      recommendations.push(line.trim().substring(1).trim());
    }
  }
  
  return recommendations.length > 0 ? recommendations.slice(0, 6) : null;
};

const extractPackingList = (text: string): string[] | null => {
  const lines = text.split('\n');
  const packingItems: string[] = [];
  
  for (const line of lines) {
    if (line.toLowerCase().includes('pakowanie') || line.toLowerCase().includes('bagaż')) {
      const nextLines = lines.slice(lines.indexOf(line) + 1, lines.indexOf(line) + 10);
      for (const nextLine of nextLines) {
        if (nextLine.trim().startsWith('-') || nextLine.trim().startsWith('•')) {
          packingItems.push(nextLine.trim().substring(1).trim());
        }
      }
      break;
    }
  }
  
  return packingItems.length > 0 ? packingItems : null;
};
