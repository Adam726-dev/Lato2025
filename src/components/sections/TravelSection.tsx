// src/components/sections/TravelSection.tsx

import React, { useState } from 'react'
import { useUserProfile } from '@/context/UserProfileContext'
import { usePlan, PlanChoices } from '@/context/PlanContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Users,
  Calendar,
  Settings,
  Sparkles,
  DollarSign,
  Plane,
  Star,
  ChevronRight,
  X,
} from 'lucide-react'
import TravelWizard from '@/components/TravelWizard'
import TravelPlanGenerator from '@/components/TravelPlanGenerator'
import { optionCardBase } from '@/components/ui/OptionCard'

interface TravelOption {
  id: number
  image: React.ReactNode
  name: string
  description: string
  price: string
  rating: number
  features: string[]
}

interface TravelSectionProps {
  sectionId: keyof PlanChoices
  section: { options: TravelOption[] }
}

type ViewMode = 'options' | 'wizard' | 'ai-planner' | 'edit-profile'

const TravelSection: React.FC<TravelSectionProps> = ({
  sectionId,
  section,
}) => {
  const { profile } = useUserProfile()
  const { choices, updateChoice, removeChoice } = usePlan()
  const [viewMode, setViewMode] = useState<ViewMode>('options')

  // który kafelek jest rozwinięty w modal
  const [expanded, setExpanded] = useState<TravelOption | null>(null)

  const hasProfile =
    !!profile.travelBudget &&
    !!profile.travelStyle &&
    !!profile.accommodationPreference &&
    !!profile.transportPreference &&
    profile.destinationPreferences?.length! > 0 &&
    !!profile.travelCompanions

  const renderTravelProfileCard = () => (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" /> Twój Profil Podróżny
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <strong>Budżet:</strong> {profile.travelBudget} zł
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <strong>Styl:</strong> {profile.travelStyle}
            </div>
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-blue-600" />
              <strong>Transport:</strong> {profile.transportPreference}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <strong>Nocleg:</strong> {profile.accommodationPreference}
            </div>
            <div className="md:col-span-2">
              <strong>Destynacje:</strong>{' '}
              {profile.destinationPreferences!.join(', ')}
            </div>
            <div className="md:col-span-2">
              <strong>Towarzystwo:</strong> {profile.travelCompanions}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Uzupełnij profil, by móc planować wakacje.
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('wizard')}
            className="cursor-pointer hover:shadow-lg transition"
          >
            <Settings className="h-4 w-4" />{' '}
            {hasProfile ? ' Edytuj profil' : ' Utwórz profil'}
          </Button>
          {hasProfile && (
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setViewMode('ai-planner')}
            >
              <Sparkles className="h-4 w-4" /> Planuj z AI
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderMainOptions = () => (
    <div className="space-y-6">
      {renderTravelProfileCard()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          onClick={() => setViewMode('wizard')}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" /> Kreator Wakacji
            </CardTitle>
            <CardDescription>
              Interaktywny kreator preferencji
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Uruchom kreator</Button>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            hasProfile ? setViewMode('ai-planner') : undefined
          }
          className={`cursor-pointer hover:shadow-lg transition ${
            hasProfile ? '' : 'opacity-50 pointer-events-none'
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" /> Planuj z AI
            </CardTitle>
            <CardDescription>
              Auto-plan na bazie Twojego profilu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!hasProfile}
            >
              Generuj plan AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderReadyTrips = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Gotowe Wycieczki</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {section.options.map((opt) => {
          const isSel = choices[sectionId] === opt.id
          return (
            <div
              key={opt.id}
              onClick={() => setExpanded(opt)}
              className={`
                relative ${isSel ? 'z-20' : 'z-10'} hover:z-30
                ${optionCardBase} +
                ''
                ${isSel
                  ? 'border-2 border-yellow-500 bg-blue-50 transform scale-105'
                  : 'hover:border-yellow-300'}
              `}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">{opt.image}</div>
                <h4 className="text-2xl font-semibold mb-1">{opt.name}</h4>
                <p className="text-gray-600 mb-3">{opt.description}</p>
                <div className="text-xl font-bold text-yellow-600 mb-2">
                  {opt.price}
                </div>
                <div
                  className={`text-sm font-medium flex items-center justify-center gap-1 
                    ${isSel 
                      ? 'text-yellow-700' 
                      : 'text-yellow-600'
                  }`}
                >
                  {isSel ? 'Wybrane' : 'Szczegóły'}{' '}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderExpanded = () =>
    expanded && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden relative">
          <button
            onClick={() => setExpanded(null)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="p-6 text-center">
            <div className="text-5xl mb-2">{expanded.image}</div>
            <h2 className="text-3xl font-bold mb-1">{expanded.name}</h2>
            <p className="text-gray-600 mb-4">{expanded.description}</p>
            <ul className="mb-4 space-y-2 text-left">
              {expanded.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="text-2xl font-bold text-yellow-500 mb-6">
              {expanded.price}
            </div>
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => {
                  updateChoice(sectionId, expanded.id)
                  setExpanded(null)
                }}
              >
                Wybierz
              </Button>
              {choices[sectionId] === expanded.id && (
                <Button
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    removeChoice(sectionId)
                    setExpanded(null)
                  }}
                >
                  Anuluj
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )

  const renderContent = () => {
    switch (viewMode) {
      case 'wizard':
        return (
          <>
            <Button
              variant="outline"
              className="mb-6"
              onClick={() => setViewMode('options')}
            >
              ← Powróć
            </Button>
            <TravelWizard onComplete={() => setViewMode('options')} />
          </>
        )
      case 'ai-planner':
        return (
          <>
            <Button
              variant="outline"
              className="mb-6"
              onClick={() => setViewMode('options')}
            >
              ← Powróć
            </Button>
            <TravelPlanGenerator />
          </>
        )
      case 'edit-profile':
        return (
          <>
            <Button
              variant="outline"
              className="mb-6"
              onClick={() => setViewMode('options')}
            >
              ← Powróć
            </Button>
            {/* tu Twój komponent edycji profilu */}
          </>
        )
      default:
        return (
          <>
            {renderMainOptions()}
            {renderReadyTrips()}
            {renderExpanded()}
          </>
        )
    }
  }

  return <div className="space-y-6">{renderContent()}</div>
}

export default TravelSection
