import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Eye, Volume2, Info } from 'lucide-react'

/**
 * EmotionCard component for displaying emotion images/videos with interactive features
 * @param {Object} props - Component props
 * @param {Object} props.emotion - Emotion data object
 * @param {string} props.mode - Display mode ('learning' | 'quiz' | 'preview')
 * @param {Function} props.onSelect - Callback when emotion is selected (quiz mode)
 * @param {boolean} props.showDetails - Whether to show detailed information
 * @param {boolean} props.isSelected - Whether this card is currently selected
 * @param {boolean} props.isCorrect - Whether this is the correct answer (feedback)
 * @param {boolean} props.showFeedback - Whether to show feedback styling
 * @param {string} props.className - Additional CSS classes
 */
const EmotionCard = ({
  emotion,
  mode = 'preview',
  onSelect,
  showDetails = false,
  isSelected = false,
  isCorrect = null,
  showFeedback = false,
  className
}) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)

  /**
   * Handles card selection in quiz mode
   */
  const handleSelect = () => {
    if (mode === 'quiz' && onSelect) {
      onSelect(emotion.id)
    }
  }

  /**
   * Toggles facial cue overlay display
   */
  const toggleOverlay = () => {
    setShowOverlay(!showOverlay)
  }

  /**
   * Handles audio playback for accessibility
   */
  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${emotion.name}. ${emotion.description}`
      )
      utterance.lang = 'fr-FR'
      speechSynthesis.speak(utterance)
    }
  }

  /**
   * Gets card styling based on state
   */
  const getCardStyling = () => {
    let baseClasses = 'transition-all duration-300 cursor-pointer hover:shadow-lg'
    
    if (mode === 'quiz') {
      baseClasses += ' hover:scale-105'
    }
    
    if (isSelected) {
      baseClasses += ' ring-2 ring-primary ring-offset-2'
    }
    
    if (showFeedback) {
      if (isCorrect === true) {
        baseClasses += ' bg-green-50 border-green-500 pulse-success'
      } else if (isCorrect === false) {
        baseClasses += ' bg-red-50 border-red-500 shake-error'
      }
    }
    
    return baseClasses
  }

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300 cursor-pointer group',
        'hover:shadow-lg hover:scale-105 hover:rotate-1',
        'transform-gpu will-change-transform',
        isSelected && 'ring-2 ring-primary scale-105',
        showFeedback && isCorrect === true && 'ring-2 ring-green-500 bg-green-50 pulse-success',
        showFeedback && isCorrect === false && 'ring-2 ring-red-500 bg-red-50 shake-error',
        mode === 'learning' && 'hover:glow-hint',
        className
      )}
      onClick={handleSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {mode !== 'quiz' && emotion.name}
            {mode === 'quiz' && '?'}
          </CardTitle>
          <div className="flex gap-2">
            {mode === 'learning' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOverlay()
                  }}
                  className="h-8 w-8"
                  title="Afficher les indices faciaux"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    playAudio()
                  }}
                  className="h-8 w-8"
                  title="Écouter la description"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {showDetails && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Informations détaillées"
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="relative">
          {/* Enhanced main emotion image/video */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
            {emotion?.imageUrl ? (
              <img
                src={emotion.imageUrl}
                alt={mode === 'quiz' ? 'Expression faciale à identifier' : `Expression de ${emotion.name}`}
                className={cn(
                  'w-full h-full object-cover transition-all duration-500',
                  'group-hover:scale-110 group-hover:brightness-110',
                  'transform-gpu will-change-transform',
                  showFeedback && isCorrect === true && 'brightness-125 saturate-150',
                  showFeedback && isCorrect === false && 'brightness-75 saturate-50'
                )}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.target.src = '/images/placeholder-face.svg'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bounce-in">
                <div className="text-6xl opacity-50 transition-all duration-300 group-hover:scale-110">😊</div>
              </div>
            )}
            
            {/* Facial cue overlay */}
            {showOverlay && mode === 'learning' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg max-w-xs">
                  <h4 className="font-semibold mb-2">Indices faciaux :</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(emotion.facialCues).map(([area, description]) => (
                      <li key={area}>
                        <strong>{area}:</strong> {description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Enhanced difficulty level indicator */}
            <div className="absolute top-2 left-2">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium text-white transition-all duration-300',
                'group-hover:scale-110 group-hover:shadow-md',
                emotion.level === 1 && 'bg-green-500 sparkle-badge',
                emotion.level === 2 && 'bg-yellow-500 slide-up',
                emotion.level === 3 && 'bg-red-500 slide-up'
              )}>
                Niveau {emotion.level}
              </span>
            </div>
            
            {/* Enhanced selection indicator for quiz mode */}
            {mode === 'quiz' && isSelected && (
              <div className="absolute inset-0 bg-primary bg-opacity-20 flex items-center justify-center">
                <div className={cn(
                  'bg-primary text-primary-foreground rounded-full p-2',
                  'bounce-in glow-hint transition-all duration-300'
                )}>
                  ✓
                </div>
              </div>
            )}
          </div>
          
          {/* Emotion details (learning mode) */}
          {mode === 'learning' && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                {emotion.description}
              </p>
              
              {showDetails && (
                <div className="space-y-2">
                  <div>
                    <h5 className="font-medium text-sm">Indices clés :</h5>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {emotion.keyIndicators.map((indicator, index) => (
                        <li key={index}>{indicator}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm">Conseil :</h5>
                    <p className="text-xs text-muted-foreground">{emotion.tips}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Quiz mode selection button */}
          {mode === 'quiz' && (
            <div className="mt-4">
              <Button 
                variant={isSelected ? "default" : "outline"}
                className="w-full"
                onClick={handleSelect}
              >
                {isSelected ? 'Sélectionné' : 'Choisir cette émotion'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default EmotionCard