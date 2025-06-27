import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Trophy, Target, Clock, TrendingUp, Award, Calendar } from 'lucide-react'
import { cn, formatTime, calculatePercentage } from '@/lib/utils'
import { getEmotionById } from '@/data/emotions'

/**
 * ProgressStats component for displaying comprehensive user progress and statistics
 * @param {Object} props - Component props
 * @param {Object} props.progress - User progress data
 * @param {string} props.variant - Display variant ('full' | 'compact' | 'summary')
 * @param {string} props.className - Additional CSS classes
 */
const ProgressStats = ({ 
  progress, 
  variant = 'full',
  className 
}) => {
  const {
    totalQuestions = 0,
    correctAnswers = 0,
    streakCount = 0,
    bestStreak = 0,
    averageResponseTime = 0,
    emotionStats = {},
    badges = [],
    lastSessionDate
  } = progress

  const accuracyRate = calculatePercentage(correctAnswers, totalQuestions)
  
  /**
   * Gets the top 3 most difficult emotions for the user
   * @returns {Array} Array of emotion objects with difficulty scores
   */
  const getDifficultEmotions = () => {
    return Object.entries(emotionStats)
      .map(([emotionId, stats]) => ({
        emotion: getEmotionById(emotionId),
        accuracy: calculatePercentage(stats.correct, stats.total),
        total: stats.total
      }))
      .filter(item => item.emotion && item.total >= 3) // Only emotions with at least 3 attempts
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
  }

  /**
   * Gets the top 3 best performing emotions
   * @returns {Array} Array of emotion objects with performance scores
   */
  const getBestEmotions = () => {
    return Object.entries(emotionStats)
      .map(([emotionId, stats]) => ({
        emotion: getEmotionById(emotionId),
        accuracy: calculatePercentage(stats.correct, stats.total),
        total: stats.total
      }))
      .filter(item => item.emotion && item.total >= 3)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3)
  }

  /**
   * Gets performance level based on accuracy
   * @param {number} accuracy - Accuracy percentage
   * @returns {Object} Level information
   */
  const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 90) return { level: 'Expert', color: 'bg-purple-500', icon: '🏆' }
    if (accuracy >= 80) return { level: 'Avancé', color: 'bg-blue-500', icon: '⭐' }
    if (accuracy >= 70) return { level: 'Intermédiaire', color: 'bg-green-500', icon: '👍' }
    if (accuracy >= 60) return { level: 'Débutant+', color: 'bg-yellow-500', icon: '📈' }
    return { level: 'Débutant', color: 'bg-gray-500', icon: '🌱' }
  }

  const performanceLevel = getPerformanceLevel(accuracyRate)
  const difficultEmotions = getDifficultEmotions()
  const bestEmotions = getBestEmotions()

  if (variant === 'compact') {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{performanceLevel.icon}</div>
              <div>
                <div className="font-semibold">{performanceLevel.level}</div>
                <div className="text-sm text-muted-foreground">
                  {accuracyRate}% de réussite
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{correctAnswers}/{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'summary') {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{accuracyRate}%</div>
            <div className="text-sm text-muted-foreground">Précision</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{streakCount}</div>
            <div className="text-sm text-muted-foreground">Série actuelle</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{formatTime(averageResponseTime)}</div>
            <div className="text-sm text-muted-foreground">Temps moyen</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Performance Globale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white text-xl",
                performanceLevel.color
              )}>
                {performanceLevel.icon}
              </div>
              <div>
                <div className="text-xl font-bold">{performanceLevel.level}</div>
                <div className="text-muted-foreground">
                  {correctAnswers} bonnes réponses sur {totalQuestions} questions
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{accuracyRate}%</div>
              <div className="text-sm text-muted-foreground">Précision</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progression</span>
              <span>{correctAnswers}/{totalQuestions}</span>
            </div>
            <Progress value={accuracyRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{streakCount}</div>
            <div className="text-sm text-muted-foreground">Série actuelle</div>
            {bestStreak > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Record: {bestStreak}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{formatTime(averageResponseTime)}</div>
            <div className="text-sm text-muted-foreground">Temps moyen</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{badges.length}</div>
            <div className="text-sm text-muted-foreground">Badges</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">
              {lastSessionDate ? new Date(lastSessionDate).toLocaleDateString('fr-FR') : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Dernière session</div>
          </CardContent>
        </Card>
      </div>

      {/* Emotion Performance */}
      {Object.keys(emotionStats).length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Best Emotions */}
          {bestEmotions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Points forts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestEmotions.map((item, index) => (
                    <div key={item.emotion.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{item.emotion.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{item.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">
                          {item.total} questions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Difficult Emotions */}
          {difficultEmotions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-orange-600">À améliorer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {difficultEmotions.map((item, index) => (
                    <div key={item.emotion.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{item.emotion.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">{item.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">
                          {item.total} questions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default ProgressStats