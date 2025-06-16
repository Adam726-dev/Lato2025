import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useUserProfile } from '@/context/UserProfileContext';
import { generateTravelPlan } from '@/services/travelAIService';
import { saveTravelPlan, SavedTravelPlan } from '@/services/travelPlansService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  MapPin,
  DollarSign,
  CheckCircle,
  Package,
  Calendar,
  Star,
  Save,
  BookOpen,
} from 'lucide-react';
import SavedTravelPlans from './SavedTravelPlans';

const TravelPlanGenerator: React.FC = () => {
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
    if (!travelPlan) return;
    const saved = saveTravelPlan(travelPlan, profile);
    setSavedPlanInfo(`Plan "${saved.title}" został zapisany!`);
    setTimeout(() => setSavedPlanInfo(null), 3000);
  };

  const handleSelectSavedPlan = (savedPlan: SavedTravelPlan) => {
    // zakładam, że savedPlan.plan ma tę samą strukturę co plan z API
    setTravelPlan(savedPlan.plan);
    setShowSavedPlans(false);
  };

  // Jeżeli nie ma w profilu budżetu ani stylu, pokaz alert
  if (!profile.travelBudget && !profile.travelStyle) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Planer Podróży AI</h2>
          <p className="text-gray-600 mb-6">
            Aby wygenerować spersonalizowany plan podróży, najpierw uzupełnij profil.
          </p>
          <Alert>
            <AlertDescription>
              Przejdź do sekcji profilu podróżnego, aby uzupełnić swoje preferencje.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Widok listy zapisanych planów
  if (showSavedPlans) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Zapisane Plany Podróży
            </CardTitle>
          </CardHeader>
        </Card>
        <Button variant="outline" onClick={() => setShowSavedPlans(false)}>
          ← Powróć do planera
        </Button>
        <SavedTravelPlans onSelectPlan={handleSelectSavedPlan} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Nagłówek */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold">
            <MapPin className="h-8 w-8 text-blue-600" />
            Planer Podróży AI
          </CardTitle>
          <CardDescription className="text-lg">
            AI wygeneruje plan podróży na podstawie Twoich preferencji
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sekcja wyboru / generowania */}
      {!travelPlan ? (
        <div className="space-y-6">
          {/* Twoje preferencje */}
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
                {profile.destinationPreferences?.length > 0 && (
                  <div className="md:col-span-2">
                    <span>
                      <strong>Destynacje:</strong> {profile.destinationPreferences.join(', ')}
                    </span>
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
                      Generuję plan...
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
      ) : (
        // Tutaj — zarówno nowy, jak i zapisany plan wyświetlamy OSTYLOWANIE
        <div className="space-y-6">
          {/* Akcje */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setTravelPlan(null)}>
                  Wygeneruj nowy plan
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSavePlan}>
                  <Save className="h-4 w-4 mr-2" />
                  Zapisz plan
                </Button>
                <Button variant="outline" onClick={() => setShowSavedPlans(true)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Zapisane plany
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Plan Podróży
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h3: (p) => <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-700" {...p} />,
                    h4: (p) => <h4 className="text-md font-medium mt-3 mb-1 text-blue-600" {...p} />,
                    li: (p) => <li className="ml-4 list-disc" {...p} />,
                    strong: (p) => <strong className="font-semibold" {...p} />,
                  }}
                >
                  {travelPlan.itinerary}
                </ReactMarkdown>
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
              <div className="prose prose-green max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h3: (p) => <h3 className="text-lg font-semibold mt-4 mb-2 text-green-700" {...p} />,
                    li: (p) => <li className="ml-4 list-disc" {...p} />,
                    strong: (p) => <strong className="font-semibold" {...p} />,
                  }}
                >
                  {travelPlan.budgetBreakdown}
                </ReactMarkdown>
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
                {travelPlan.recommendations.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg prose prose-yellow">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 prose prose-purple">
                {travelPlan.packingList.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
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