import React, { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { Trophy, Star, Target, Zap, Award, Medal } from 'lucide-react'

/**
 * Enhanced progress indicator component with animations and badges
 * @param {Object} props - Component props
 * @param {number} props.current - Current progress value
 * @param {number} props.total - Total progress value
 * @param {string} props.label - Progress label
 * @param {string} props.type - Progress type ('level' | 'emotion' | 'accuracy' | 'streak')
 * @param {boolean} props.showBadges - Whether to show achievement badges
 * @param {Array} props.achievements - Array of achievement objects
 * @param {boolean} props.animated - Whether to animate progress changes
 * @param {string} props.className - Additional CSS classes
 */
const ProgressIndicator = ({
  current = 0,
  total = 100,
  label = 'Progress',
  type = 'level',
  showBadges = true,
  achievements = [],
  animated = true,
  className
}) => {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [newAchievements, setNewAchievements] = useState([])

  const percentage = Math.min((current / total) * 100, 100)

  /**
   * Animates progress bar fill
   */
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayProgress(percentage)
    }
  }, [percentage, animated])

  /**
   * Handles new achievement notifications
   */
  useEffect(() => {
    const recentAchievements = achievements.filter(achievement => 
      achievement.isNew && !newAchievements.includes(achievement.id)
    )
    
    if (recentAchievements.length > 0) {
      setNewAchievements(prev => [...prev, ...recentAchievements.map(a => a.id)])
      
      // Remove new status after animation
      setTimeout(() => {
        setNewAchievements(prev => 
          prev.filter(id => !recentAchievements.map(a => a.id).includes(id))
        )
      }, 3000)
    }
  }, [achievements, newAchievements])

  /**
   * Gets icon based on progress type
   */
  const getTypeIcon = () => {
    switch (type) {
      case 'level': return <Target className="h-4 w-4" />
      case 'emotion': return <Star className="h-4 w-4" />
      case 'accuracy': return <Trophy className="h-4 w-4" />
      case 'streak': return <Zap className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  /**
   * Gets progress bar color based on type and percentage
   */
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 70) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  /**
   * Gets achievement badge icon
   */
  const getAchievementIcon = (achievement) => {
    switch (achievement.type) {
      case 'mastery': return <Trophy className="h-3 w-3" />
      case 'streak': return <Zap className="h-3 w-3" />
      case 'accuracy': return <Target className="h-3 w-3" />
      case 'completion': return <Award className="h-3 w-3" />
      default: return <Medal className="h-3 w-3" />
    }
  }

  return (
    <Card className={cn('overflow-hidden progress-indicator', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Responsive Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {getTypeIcon()}
              <span className="font-medium text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <span className="text-sm font-semibold">
                {current}/{total}
              </span>
              <Badge variant="outline" className="text-xs achievement-badge">
                {Math.round(percentage)}%
              </Badge>
            </div>
          </div>

          {/* Responsive progress bar */}
          <div className="space-y-2 progress-bars">
            <div className="w-full bg-secondary rounded-full h-3 sm:h-2 overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-1000 ease-out',
                  getProgressColor(),
                  'progress-fill'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            {/* Responsive milestones */}
            {type === 'mastery' && (
              <div className="hidden sm:flex justify-between text-xs text-muted-foreground">
                <span>Débutant</span>
                <span>Intermédiaire</span>
                <span>Expert</span>
              </div>
            )}
            
            {/* Mobile milestone indicator */}
            {type === 'mastery' && (
              <div className="block sm:hidden text-center text-xs text-muted-foreground">
                {percentage < 33 ? 'Débutant' : percentage < 66 ? 'Intermédiaire' : 'Expert'}
              </div>
            )}
          </div>

          {/* Achievement Badges */}
          {showBadges && achievements.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {achievements.slice(0, 5).map(achievement => (
                <Badge
                  key={achievement.id}
                  variant={achievement.unlocked ? 'default' : 'outline'}
                  className={cn(
                    'text-xs flex items-center gap-1 transition-all duration-300',
                    achievement.unlocked && 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
                    newAchievements.includes(achievement.id) && 'bounce-in badge-new'
                  )}
                  title={achievement.description}
                >
                  {getAchievementIcon(achievement)}
                  {achievement.name}
                </Badge>
              ))}
              
              {achievements.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{achievements.length - 5}
                </Badge>
              )}
            </div>
          )}

          {/* Level up notification */}
          {percentage === 100 && (
            <div className="text-center p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-medium">Niveau complété !</span>
                <Trophy className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgressIndicator