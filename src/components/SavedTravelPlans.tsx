
import React, { useState, useEffect } from 'react';
import { getSavedTravelPlans, deleteTravelPlan, SavedTravelPlan } from '@/services/travelPlansService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, MapPin, Eye } from 'lucide-react';

interface SavedTravelPlansProps {
  onSelectPlan: (plan: SavedTravelPlan) => void;
}

const SavedTravelPlans: React.FC<SavedTravelPlansProps> = ({ onSelectPlan }) => {
  const [savedPlans, setSavedPlans] = useState<SavedTravelPlan[]>([]);

  useEffect(() => {
    setSavedPlans(getSavedTravelPlans());
  }, []);

  const handleDeletePlan = (id: string) => {
    deleteTravelPlan(id);
    setSavedPlans(getSavedTravelPlans());
  };

  if (savedPlans.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-600">Nie masz jeszcze zapisanych planów podróży.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Zapisane Plany Podróży</h3>
      {savedPlans.map((plan) => (
        <Card key={plan.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {plan.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {plan.createdAt.toLocaleDateString('pl-PL')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectPlan(plan)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Zobacz
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Budżet: {plan.profile.travelBudget} zł
              </Badge>
              <Badge variant="secondary">
                Styl: {plan.profile.travelStyle}
              </Badge>
              <Badge variant="secondary">
                {plan.profile.travelCompanions}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SavedTravelPlans;
