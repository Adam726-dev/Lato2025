import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronRight, X } from 'lucide-react'

interface Option {
  id: number
  icon: React.ReactNode
  name: string
  description: string
  features?: string[]
  price?: string
}

interface DefaultSectionProps {
  sectionId: string
  section: {
    wizardComponent?: boolean
    options: Option[]
  }
  choices: Record<string, number>
  updateChoice: (sectionId: string, optionId: number) => void
  removeChoice: (sectionId: string) => void
}

const DefaultSection: React.FC<DefaultSectionProps> = ({
  sectionId,
  section,
  choices,
  updateChoice,
  removeChoice,
}) => {
  // multi-wybór
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  // który kafelek rozwinięty
  const [expanded, setExpanded] = useState<Option | null>(null)

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-8">
      {section.wizardComponent && (
        <div className="mb-8 text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-3 text-lg"
          >
            <Link to={`/${sectionId}/wizard`}>🧙‍♂️ Spersonalizowany kreator</Link>
          </Button>
          <p className="text-gray-600 mt-2">lub wybierz gotową opcję poniżej</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {section.options.map((opt) => {
          const isSel = selectedIds.includes(opt.id)
          return (
            <div
              key={opt.id}
              onClick={() => setExpanded(opt)}
              className={`bg-white rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105 border-2
                ${isSel
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">{opt.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{opt.description}</p>

                {opt.features && (
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {opt.features.map((f, i) => (
                      <li key={i} className="flex items-center justify-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {opt.price && (
                  <div className="text-lg font-bold text-purple-800 mb-2">
                    {opt.price}
                  </div>
                )}

                <div
                  className={`flex items-center justify-center text-sm font-medium gap-1
                    ${isSel ? 'text-purple-600' : 'text-purple-500'}
                  `}
                >
                  <span>{isSel ? 'Wybrane' : 'Wybierz'}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {expanded && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden relative">
            {/* Zamknij */}
            <button
              onClick={() => setExpanded(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-6 text-center">
              <div className="text-5xl mb-3">{expanded.icon}</div>
              <h2 className="text-3xl font-bold mb-1">{expanded.name}</h2>
              <p className="text-gray-600 mb-4">{expanded.description}</p>
              {expanded.features && (
                <ul className="mb-4 space-y-2 text-left">
                  {expanded.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              {expanded.price && (
                <div className="text-2xl font-bold text-purple-600 mb-6">
                  {expanded.price}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    toggleSelect(expanded.id)
                    setExpanded(null)
                  }}
                >
                  Wybierz
                </Button>
                {selectedIds.includes(expanded.id) && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      toggleSelect(expanded.id)
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
      )}
    </div>
  )
}

export default DefaultSection