import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { generateTravelPlan } from '@/services/travelAIService';
import { saveTravelPlan, SavedTravelPlan } from '@/services/travelPlansService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, DollarSign, CheckCircle, Package, Calendar, Star, Save, BookOpen } from 'lucide-react';
import SavedTravelPlans from './SavedTravelPlans';

const TravelPlanGenerator = () => {
  const { profile } = useUserProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [travelPlan, setTravelPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [savedPlanInfo, setSavedPlanInfo] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const plan = await generateTravelPlan(profile);
      setTravelPlan(plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = () => {
    if (travelPlan) {
      const savedPlan = saveTravelPlan(travelPlan, profile);
      setSavedPlanInfo(`Plan "${savedPlan.title}" został zapisany!`);
      setTimeout(() => setSavedPlanInfo(null), 3000);
    }
  };

  const handleSelectSavedPlan = (savedPlan: SavedTravelPlan) => {
    setTravelPlan(savedPlan.plan);
    setShowSavedPlans(false);
  };

  if (!profile.travelBudget && !profile.travelStyle) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planer Podróży AI</h2>
            <p className="text-gray-600 mb-6">
              Aby wygenerować spersonalizowany plan podróży, najpierw wypełnij formularz preferencji podróżnych.
            </p>
            <Alert>
              <AlertDescription>
                Przejdź do sekcji profilu podróżnego, aby uzupełnić swoje preferencje.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSavedPlans) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Zapisane Plany Podróży
            </CardTitle>
          </CardHeader>
        </Card>

        <Button
          onClick={() => setShowSavedPlans(false)}
          variant="outline"
          className="mb-6"
        >
          ← Powróć do planera
        </Button>

        <SavedTravelPlans onSelectPlan={handleSelectSavedPlan} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            Planer Podróży AI
          </CardTitle>
          <CardDescription className="text-lg">
            AI wygeneruje spersonalizowany plan podróży na podstawie Twoich preferencji
          </CardDescription>
        </CardHeader>
      </Card>

      {!travelPlan && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Twoje preferencje podróżne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {profile.travelBudget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span><strong>Budżet:</strong> {profile.travelBudget} zł</span>
                  </div>
                )}
                {profile.travelStyle && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span><strong>Styl:</strong> {profile.travelStyle}</span>
                  </div>
                )}
                {profile.accommodationPreference && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span><strong>Nocleg:</strong> {profile.accommodationPreference}</span>
                  </div>
                )}
                {profile.transportPreference && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span><strong>Transport:</strong> {profile.transportPreference}</span>
                  </div>
                )}
                {profile.destinationPreferences && profile.destinationPreferences.length > 0 && (
                  <div className="md:col-span-2">
                    <span><strong>Destynacje:</strong> {profile.destinationPreferences.join(', ')}</span>
                  </div>
                )}
                {profile.travelCompanions && (
                  <div className="md:col-span-2">
                    <span><strong>Towarzystwo:</strong> {profile.travelCompanions}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {savedPlanInfo && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{savedPlanInfo}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generuję plan podróży...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Wygeneruj nowy plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Button
                  onClick={() => setShowSavedPlans(true)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Zobacz zapisane plany
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {travelPlan && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setTravelPlan(null)}
                  variant="outline"
                >
                  Wygeneruj nowy plan
                </Button>
                <Button
                  onClick={handleSavePlan}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Zapisz plan
                </Button>
                <Button
                  onClick={() => setShowSavedPlans(true)}
                  variant="outline"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Zobacz zapisane
                </Button>
              </div>
            </CardContent>
          </Card>

          {savedPlanInfo && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{savedPlanInfo}</AlertDescription>
            </Alert>
          )}

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Plan Podróży
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: travelPlan.itinerary
                    .replace(/\n/g, '<br>')
                    .replace(/##\s*(.*?)(?=\n|$)/g, '<h3 class="text-lg font-semibold mt-4 mb-2 text-blue-700">$1</h3>')
                    .replace(/###\s*(.*?)(?=\n|$)/g, '<h4 class="text-md font-medium mt-3 mb-2 text-blue-600">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*?)(?=\n|$)/g, '<li class="ml-4">$1</li>')
                }} />
              </div>
            </CardContent>
          </Card>

          {/* Budget Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Podział Budżetu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: travelPlan.budgetBreakdown
                    .replace(/\n/g, '<br>')
                    .replace(/##\s*(.*?)(?=\n|$)/g, '<h3 class="text-lg font-semibold mt-4 mb-2 text-green-700">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*?)(?=\n|$)/g, '<li class="ml-4">$1</li>')
                }} />
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-600" />
                Rekomendacje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {travelPlan.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Packing List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Lista Pakowania
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {travelPlan.packingList.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                    <Package className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TravelPlanGenerator;
