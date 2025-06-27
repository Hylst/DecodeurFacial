import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn, getDifficultyConfig } from '@/lib/utils'
import { Star, Users, Brain, Target } from 'lucide-react'

/**
 * DifficultySelector component for choosing quiz difficulty levels
 * @param {Object} props - Component props
 * @param {number} props.selectedLevel - Currently selected difficulty level
 * @param {Function} props.onLevelSelect - Callback when level is selected
 * @param {Object} props.userProgress - User progress data for recommendations
 * @param {string} props.className - Additional CSS classes
 */
const DifficultySelector = ({
  selectedLevel = 1,
  onLevelSelect,
  userProgress = {},
  className
}) => {
  /**
   * Gets recommendation for difficulty level based on user progress
   * @param {number} level - Difficulty level
   * @returns {string|null} Recommendation text or null
   */
  const getRecommendation = (level) => {
    const { totalQuestions = 0, correctAnswers = 0 } = userProgress
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    
    if (totalQuestions < 10) {
      return level === 1 ? 'Recommandé pour débuter' : null
    }
    
    if (level === 1 && accuracy >= 80) {
      return 'Vous maîtrisez ce niveau !'
    }
    
    if (level === 2 && accuracy >= 70 && accuracy < 90) {
      return 'Parfait pour progresser'
    }
    
    if (level === 3 && accuracy >= 85) {
      return 'Prêt pour le défi !'
    }
    
    return null
  }

  /**
   * Gets the appropriate icon for each difficulty level
   * @param {number} level - Difficulty level
   * @returns {React.Component} Icon component
   */
  const getLevelIcon = (level) => {
    switch (level) {
      case 1:
        return <Star className="h-6 w-6" />
      case 2:
        return <Users className="h-6 w-6" />
      case 3:
        return <Brain className="h-6 w-6" />
      default:
        return <Target className="h-6 w-6" />
    }
  }

  /**
   * Gets estimated completion time for each level
   * @param {number} level - Difficulty level
   * @returns {string} Estimated time
   */
  const getEstimatedTime = (level) => {
    const baseTimes = {
      1: '5-8 minutes',
      2: '8-12 minutes',
      3: '12-15 minutes'
    }
    return baseTimes[level] || '5-10 minutes'
  }

  const levels = [1, 2, 3]

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choisissez votre niveau</h2>
        <p className="text-muted-foreground">
          Sélectionnez le niveau de difficulté adapté à vos compétences
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {levels.map((level) => {
          const config = getDifficultyConfig(level)
          const isSelected = selectedLevel === level
          const recommendation = getRecommendation(level)
          
          return (
            <Card
              key={level}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2 ring-primary ring-offset-2 bg-primary/5"
              )}
              onClick={() => onLevelSelect(level)}
            >
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className={cn(
                    "p-3 rounded-full text-white",
                    config.color
                  )}>
                    {getLevelIcon(level)}
                  </div>
                </div>
                
                <CardTitle className="flex items-center justify-center gap-2">
                  <span>Niveau {level}</span>
                  {recommendation && (
                    <Badge variant="success" className="text-xs">
                      ✨
                    </Badge>
                  )}
                </CardTitle>
                
                <div className="text-lg font-semibold text-primary">
                  {config.name}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {config.description}
                </p>
                
                {/* Emotion examples */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Émotions incluses :</h4>
                  <div className="flex flex-wrap gap-1">
                    {config.emotions.slice(0, 4).map((emotion) => (
                      <Badge key={emotion} variant="outline" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                    {config.emotions.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{config.emotions.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Level details */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Durée estimée :</span>
                    <span className="font-medium">{getEstimatedTime(level)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions :</span>
                    <span className="font-medium">10 questions</span>
                  </div>
                </div>
                
                {/* Recommendation */}
                {recommendation && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-center">
                    <p className="text-xs text-green-700 font-medium">
                      {recommendation}
                    </p>
                  </div>
                )}
                
                {/* Selection button */}
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onLevelSelect(level)
                  }}
                >
                  {isSelected ? 'Niveau sélectionné' : 'Choisir ce niveau'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Additional information */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 text-white rounded-full">
            <Target className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-blue-900">Conseils pour choisir :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Niveau 1 :</strong> Idéal pour découvrir les émotions de base</li>
              <li>• <strong>Niveau 2 :</strong> Pour approfondir avec des émotions plus complexes</li>
              <li>• <strong>Niveau 3 :</strong> Défi avancé avec micro-expressions et nuances</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              💡 Vous pouvez changer de niveau à tout moment selon vos progrès !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DifficultySelector