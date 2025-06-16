
import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plane, Calendar, Settings, Sparkles, Users, DollarSign, Star } from 'lucide-react';
import TravelWizard from '@/components/TravelWizard';
import TravelPlanGenerator from '@/components/TravelPlanGenerator';

interface TravelSectionProps {
  sectionId: string;
  section: any;
  choices: any;
  updateChoice: (sectionId: string, optionId: string) => void;
}

type ViewMode = 'options' | 'wizard' | 'ai-planner' | 'edit-profile';

const TravelSection: React.FC<TravelSectionProps> = ({ 
  sectionId, 
  section, 
  choices, 
  updateChoice 
}) => {
  const { profile } = useUserProfile();
  const [viewMode, setViewMode] = useState<ViewMode>('options');

  const hasCompleteTravelProfile = profile.travelBudget && profile.travelStyle && 
    profile.accommodationPreference && profile.transportPreference && 
    profile.destinationPreferences && profile.destinationPreferences.length > 0 && 
    profile.travelCompanions;

  const renderTravelProfileCard = () => (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Twój Profil Podróżny
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasCompleteTravelProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span><strong>Budżet:</strong> {profile.travelBudget} zł</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span><strong>Styl:</strong> {profile.travelStyle}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span><strong>Nocleg:</strong> {profile.accommodationPreference}</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-blue-600" />
              <span><strong>Transport:</strong> {profile.transportPreference}</span>
            </div>
            <div className="md:col-span-2">
              <span><strong>Destynacje:</strong> {profile.destinationPreferences?.join(', ')}</span>
            </div>
            <div className="md:col-span-2">
              <span><strong>Towarzystwo:</strong> {profile.travelCompanions}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Uzupełnij swój profil podróżny, aby uzyskać spersonalizowane rekomendacje.</p>
        )}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => setViewMode('edit-profile')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {hasCompleteTravelProfile ? 'Edytuj profil' : 'Utwórz profil'}
          </Button>
          {hasCompleteTravelProfile && (
            <Button
              onClick={() => setViewMode('ai-planner')}
              size="sm"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              Planuj z AI
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderMainOptions = () => (
    <div className="space-y-6">
      {renderTravelProfileCard()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => setViewMode('wizard')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Kreator Wakacji
            </CardTitle>
            <CardDescription>
              Przejdź przez interaktywny kreator, aby zdefiniować swoje preferencje podróżne
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Uruchom kreator
            </Button>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-lg transition-shadow ${hasCompleteTravelProfile ? 'cursor-pointer' : 'opacity-50'}`}
              onClick={hasCompleteTravelProfile ? () => setViewMode('ai-planner') : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Planuj z AI
            </CardTitle>
            <CardDescription>
              Pozwól AI zaplanować idealne wakacje na podstawie Twojego profilu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              disabled={!hasCompleteTravelProfile}
            >
              {hasCompleteTravelProfile ? 'Generuj plan AI' : 'Wymaga profilu'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Gotowe Wycieczki
          </CardTitle>
          <CardDescription>
            Wybierz spośród dostępnych opcji wakacyjnych
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.options.map((option: any) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  choices[sectionId] === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateChoice(sectionId, option.id.toString())}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{option.image}</div>
                      <div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(option.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              {option.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {option.price}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'wizard':
      case 'edit-profile':
        return (
          <div>
            <Button
              onClick={() => setViewMode('options')}
              variant="outline"
              className="mb-6"
            >
              ← Powróć do opcji
            </Button>
            <TravelWizard onComplete={() => setViewMode('options')} />
          </div>
        );
      case 'ai-planner':
        return (
          <div>
            <Button
              onClick={() => setViewMode('options')}
              variant="outline"
              className="mb-6"
            >
              ← Powróć do opcji
            </Button>
            <TravelPlanGenerator />
          </div>
        );
      default:
        return renderMainOptions();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default TravelSection;
