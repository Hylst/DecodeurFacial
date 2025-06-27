import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Lightbulb, Target, Zap } from 'lucide-react'

/**
 * Enhanced emotion highlighting component for learning mode
 * @param {Object} props - Component props
 * @param {Object} props.emotion - Emotion data object
 * @param {boolean} props.showHints - Whether to show facial cue hints
 * @param {Function} props.onToggleHints - Callback when hints are toggled
 * @param {string} props.highlightMode - Highlight mode ('none' | 'subtle' | 'strong')
 * @param {boolean} props.autoHighlight - Whether to auto-highlight key areas
 * @param {string} props.className - Additional CSS classes
 */
const EmotionHighlight = ({
  emotion,
  showHints = false,
  onToggleHints,
  highlightMode = 'subtle',
  autoHighlight = false,
  className
}) => {
  const [activeHint, setActiveHint] = useState(null)
  const [hintSequence, setHintSequence] = useState([])
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  /**
   * Initializes hint sequence based on emotion's facial cues
   */
  useEffect(() => {
    if (emotion?.facialCues) {
      const sequence = Object.keys(emotion.facialCues).map((area, index) => ({
        id: area,
        area,
        description: emotion.facialCues[area],
        order: index,
        position: getHintPosition(area)
      }))
      setHintSequence(sequence)
    }
  }, [emotion])

  /**
   * Auto-plays hint sequence when enabled
   */
  useEffect(() => {
    if (autoHighlight && hintSequence.length > 0 && !isPlaying) {
      playHintSequence()
    }
  }, [autoHighlight, hintSequence])

  /**
   * Gets position coordinates for facial area hints
   * @param {string} area - Facial area name
   * @returns {Object} Position coordinates
   */
  const getHintPosition = (area) => {
    const positions = {
      eyes: { top: '35%', left: '50%', width: '65%', height: '15%' },
      eyebrows: { top: '25%', left: '50%', width: '70%', height: '12%' },
      mouth: { top: '65%', left: '50%', width: '40%', height: '20%' },
      nose: { top: '45%', left: '50%', width: '20%', height: '15%' },
      forehead: { top: '15%', left: '50%', width: '75%', height: '18%' },
      cheeks: { top: '40%', left: '50%', width: '80%', height: '30%' },
      chin: { top: '80%', left: '50%', width: '40%', height: '15%' },
      head: { top: '50%', left: '50%', width: '90%', height: '90%' },
      general: { top: '50%', left: '50%', width: '90%', height: '90%' }
    }
    
    return positions[area] || positions.general
  }

  /**
   * Plays the hint sequence automatically
   */
  const playHintSequence = async () => {
    setIsPlaying(true)
    
    for (let i = 0; i < hintSequence.length; i++) {
      setActiveHint(hintSequence[i])
      setCurrentHintIndex(i)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    setActiveHint(null)
    setIsPlaying(false)
    setCurrentHintIndex(0)
  }

  /**
   * Handles manual hint selection
   * @param {Object} hint - Hint object
   */
  const handleHintSelect = (hint) => {
    if (isPlaying) return
    
    setActiveHint(activeHint?.id === hint.id ? null : hint)
  }

  /**
   * Toggles hint display
   */
  const handleToggleHints = () => {
    if (onToggleHints) {
      onToggleHints(!showHints)
    }
    if (showHints) {
      setActiveHint(null)
      setIsPlaying(false)
    }
  }

  /**
   * Gets highlight overlay styling
   */
  const getHighlightStyle = (hint) => {
    const baseStyle = {
      position: 'absolute',
      top: hint.position.top,
      left: hint.position.left,
      width: hint.position.width,
      height: hint.position.height,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 10
    }

    switch (highlightMode) {
      case 'strong':
        return {
          ...baseStyle,
          border: '3px solid #3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
        }
      case 'subtle':
        return {
          ...baseStyle,
          border: '2px solid #3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
        }
      default:
        return { ...baseStyle, display: 'none' }
    }
  }

  return (
    <div className={cn('relative', className)}>
      {/* Main emotion image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {emotion?.imageUrl ? (
          <img
            src={emotion.imageUrl}
            alt={`Expression de ${emotion.name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder-face.svg'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="text-6xl">😊</div>
          </div>
        )}

quand je         {/* Highlight overlays */}
        {showHints && activeHint && highlightMode !== 'none' && (
          <div
            className="glow-hint transition-all duration-300"
            style={getHighlightStyle(activeHint)}
          />
        )}
        
        {/* General highlight overlay for mode demonstration */}
        {showHints && !activeHint && highlightMode !== 'none' && (
          <div className="absolute inset-0 pointer-events-none z-5">
            <div 
              className={cn(
                'absolute inset-2 rounded-lg transition-all duration-500',
                highlightMode === 'subtle' && 'border-2 border-blue-400 bg-blue-50/20',
                highlightMode === 'strong' && 'border-4 border-blue-500 bg-blue-100/30 shadow-lg shadow-blue-500/50'
              )}
            />
          </div>
        )}

        {/* Hint tooltip */}
        {showHints && activeHint && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-white p-3 rounded-lg shadow-lg border slide-up">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm capitalize">
                    {activeHint.area}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeHint.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator for auto-play */}
        {isPlaying && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="bg-white p-2 rounded-lg shadow-lg border">
              <div className="flex items-center gap-2 text-xs">
                <Zap className="h-3 w-3 text-blue-500" />
                <span>Analyse automatique...</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${((currentHintIndex + 1) / hintSequence.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-3">
        {/* Main controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleHints}
            className="flex items-center gap-2"
          >
            {showHints ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showHints ? 'Masquer' : 'Afficher'} les indices
          </Button>

          {showHints && (
            <Button
              variant="outline"
              size="sm"
              onClick={playHintSequence}
              disabled={isPlaying}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {isPlaying ? 'Analyse...' : 'Analyse guidée'}
            </Button>
          )}
        </div>

        {/* Responsive facial area selector */}
        {showHints && hintSequence.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Zones faciales :</h4>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {hintSequence.map(hint => (
                <Badge
                  key={hint.id}
                  variant={activeHint?.id === hint.id ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all duration-200 text-xs capitalize facial-area-badge',
                    'hover:scale-105 active:scale-95 text-center justify-center',
                    activeHint?.id === hint.id && 'glow-hint scale-105',
                    isPlaying && 'pointer-events-none opacity-50'
                  )}
                  onClick={() => handleHintSelect(hint)}
                >
                  {hint.area}
                </Badge>
              ))}
            </div>
            
            {/* Hint for mobile users */}
            <div className="block sm:hidden text-xs text-muted-foreground text-center p-2 bg-muted/30 rounded">
              Touchez une zone pour voir les détails
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmotionHighlight