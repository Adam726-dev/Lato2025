
import React, { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, RadioGroup, RadioGroupItem, Checkbox, Switch } from './FormElements';

interface BudgetOptimizerFormProps {
  onComplete: () => void;
}

const BudgetOptimizerForm: React.FC<BudgetOptimizerFormProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useUserProfile();

  const [formData, setFormData] = useState({
    monthlyBudget: profile.monthlyBudget || 0,
    budgetPriorities: profile.budgetPriorities || [],
    savingsGoal: profile.savingsGoal || 0,
    spendingStyle: profile.spendingStyle || '',
    dealPreferences: profile.dealPreferences || [],
    budgetAlerts: profile.budgetAlerts || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToUpdate: any = {};
    if (formData.monthlyBudget) dataToUpdate.monthlyBudget = formData.monthlyBudget;
    if (formData.budgetPriorities) dataToUpdate.budgetPriorities = formData.budgetPriorities;
    if (formData.savingsGoal) dataToUpdate.savingsGoal = formData.savingsGoal;
    if (formData.spendingStyle && formData.spendingStyle !== '') {
      dataToUpdate.spendingStyle = formData.spendingStyle as 'conservative' | 'moderate' | 'flexible';
    }
    if (formData.dealPreferences) dataToUpdate.dealPreferences = formData.dealPreferences;
    if (formData.budgetAlerts !== undefined) dataToUpdate.budgetAlerts = formData.budgetAlerts;

    updateProfile(dataToUpdate);
    onComplete();
  };

  const handlePriorityToggle = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      budgetPriorities: prev.budgetPriorities.includes(priority as any)
        ? prev.budgetPriorities.filter(p => p !== priority)
        : [...prev.budgetPriorities, priority as 'fitness' | 'food' | 'entertainment' | 'travel']
    }));
  };

  const handleDealToggle = (deal: string) => {
    setFormData(prev => ({
      ...prev,
      dealPreferences: prev.dealPreferences.includes(deal as any)
        ? prev.dealPreferences.filter(d => d !== deal)
        : [...prev.dealPreferences, deal as 'discounts' | 'bundles' | 'loyalty_programs' | 'early_bird']
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            💰 Budget Optimizer AI
          </CardTitle>
          <p className="text-center text-gray-600">
            Skonfiguruj AI, które pomoże Ci optymalizować wydatki i znajdować najlepsze promocje
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="monthlyBudget">Miesięczny budżet na rozrywkę (zł)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                min="0"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  monthlyBudget: parseInt(e.target.value) || 0
                }))}
                placeholder="np. 1500"
                required
              />
            </div>

            <div>
              <Label htmlFor="savingsGoal">Cel oszczędnościowy miesięcznie (zł)</Label>
              <Input
                id="savingsGoal"
                type="number"
                min="0"
                value={formData.savingsGoal}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  savingsGoal: parseInt(e.target.value) || 0
                }))}
                placeholder="np. 500"
              />
            </div>

            <div>
              <Label>Priorytety budżetowe (wybierz wszystkie ważne)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { id: 'fitness', label: '💪 Fitness i sport' },
                  { id: 'food', label: '🍕 Jedzenie i restauracje' },
                  { id: 'entertainment', label: '🎉 Rozrywka i imprezy' },
                  { id: 'travel', label: '✈️ Podróże i wakacje' }
                ].map((priority) => (
                  <div key={priority.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={priority.id}
                      checked={formData.budgetPriorities.includes(priority.id as any)}
                      onCheckedChange={() => handlePriorityToggle(priority.id)}
                    />
                    <Label htmlFor={priority.id}>{priority.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Styl wydawania pieniędzy</Label>
              <RadioGroup 
                value={formData.spendingStyle} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, spendingStyle: value as any }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative">🛡️ Konserwatywny - zawsze sprawdzam ceny</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">⚖️ Umiarkowany - balans między ceną a jakością</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible">💸 Elastyczny - jakość ważniejsza niż cena</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Preferowane typy promocji</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { id: 'discounts', label: '🏷️ Zniżki i kupony' },
                  { id: 'bundles', label: '📦 Pakiety usług' },
                  { id: 'loyalty_programs', label: '⭐ Programy lojalnościowe' },
                  { id: 'early_bird', label: '🐦 Oferty early bird' }
                ].map((deal) => (
                  <div key={deal.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={deal.id}
                      checked={formData.dealPreferences.includes(deal.id as any)}
                      onCheckedChange={() => handleDealToggle(deal.id)}
                    />
                    <Label htmlFor={deal.id}>{deal.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="budgetAlerts"
                checked={formData.budgetAlerts}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, budgetAlerts: checked }))}
              />
              <Label htmlFor="budgetAlerts">
                🔔 Otrzymuj powiadomienia o przekraczaniu budżetu
              </Label>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Aktywuj Budget Optimizer AI 💰
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetOptimizerForm;
