import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import ProgressStats from '../components/ProgressStats'
import useAppStore from '../store/useAppStore'
import { getAllEmotions, getEmotionById } from '../data/emotions'
import { getDifficultyConfig } from '@/lib/utils'
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BarChart3,
  Calendar,
  Zap,
  Brain,
  Eye,
  RotateCcw
} from 'lucide-react'

/**
 * Statistics page component for displaying user progress and analytics
 */
const Stats = () => {
  const navigate = useNavigate()
  const { progress, user, resetProgress } = useAppStore()
  const [selectedPeriod, setSelectedPeriod] = useState('all') // 'week' | 'month' | 'all'
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
  const allEmotions = getAllEmotions()

  /**
   * Calculates overall statistics
   */
  const overallStats = useMemo(() => {
    const totalQuestions = progress.totalQuestions
    const correctAnswers = progress.correctAnswers
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    
    return {
      totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy * 10) / 10,
      currentStreak: progress.currentStreak,
      bestStreak: progress.bestStreak,
      averageResponseTime: progress.averageResponseTime || 0,
      lastSessionDate: progress.lastSessionDate
    }
  }, [progress])

  /**
   * Calculates performance by difficulty level
   */
  const performanceByLevel = useMemo(() => {
    const levels = [1, 2, 3]
    return levels.map(level => {
      const levelStats = progress.emotionStats
        ? Object.entries(progress.emotionStats)
            .filter(([emotionId]) => {
              const emotion = getEmotionById(emotionId)
              return emotion && emotion.level === level
            })
            .reduce((acc, [, stats]) => {
              acc.total += stats.total
              acc.correct += stats.correct
              return acc
            }, { total: 0, correct: 0 })
        : { total: 0, correct: 0 }
      
      const accuracy = levelStats.total > 0 ? (levelStats.correct / levelStats.total) * 100 : 0
      const config = getDifficultyConfig(level)
      
      return {
        level,
        name: config.name,
        color: config.color,
        total: levelStats.total,
        correct: levelStats.correct,
        accuracy: Math.round(accuracy * 10) / 10
      }
    })
  }, [progress.emotionStats])

  /**
   * Gets top performing emotions
   */
  const topEmotions = useMemo(() => {
    if (!progress.emotionStats) return []
    
    return Object.entries(progress.emotionStats)
      .map(([emotionId, stats]) => {
        const emotion = getEmotionById(emotionId)
        const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
        return {
          emotion,
          ...stats,
          accuracy: Math.round(accuracy * 10) / 10
        }
      })
      .filter(item => item.emotion && item.total >= 3) // Only emotions with at least 3 attempts
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5)
  }, [progress.emotionStats])

  /**
   * Gets emotions that need more practice
   */
  const challengingEmotions = useMemo(() => {
    if (!progress.emotionStats) return []
    
    return Object.entries(progress.emotionStats)
      .map(([emotionId, stats]) => {
        const emotion = getEmotionById(emotionId)
        const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
        return {
          emotion,
          ...stats,
          accuracy: Math.round(accuracy * 10) / 10
        }
      })
      .filter(item => item.emotion && item.total >= 3) // Only emotions with at least 3 attempts
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)
  }, [progress.emotionStats])

  /**
   * Gets performance level based on accuracy
   */
  const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 90) return { level: 'Expert', color: 'text-green-600', bg: 'bg-green-100' }
    if (accuracy >= 80) return { level: 'Avancé', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (accuracy >= 70) return { level: 'Intermédiaire', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (accuracy >= 60) return { level: 'Débutant+', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { level: 'Débutant', color: 'text-red-600', bg: 'bg-red-100' }
  }

  /**
   * Formats time in a readable format
   */
  const formatTime = (ms) => {
    if (!ms) return 'N/A'
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  /**
   * Handles progress reset
   */
  const handleResetProgress = () => {
    resetProgress()
    setShowResetConfirm(false)
  }

  const performanceLevel = getPerformanceLevel(overallStats.accuracy)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Accueil
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Mes Statistiques</h1>
              <p className="text-muted-foreground">
                Suivez vos progrès et analysez vos performances
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Reset confirmation */}
        {showResetConfirm && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-red-800">
                  Confirmer la réinitialisation
                </h3>
                <p className="text-red-700">
                  Êtes-vous sûr de vouloir effacer toutes vos statistiques ? Cette action est irréversible.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetProgress}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No data message */}
        {overallStats.totalQuestions === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">📊</div>
                <h3 className="text-xl font-semibold">Aucune donnée disponible</h3>
                <p className="text-muted-foreground">
                  Commencez par faire un quiz pour voir vos statistiques ici !
                </p>
                <Button
                  onClick={() => navigate('/quiz')}
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Commencer un Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics content */}
        {overallStats.totalQuestions > 0 && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="emotions">Émotions</TabsTrigger>
              <TabsTrigger value="progress">Progression</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {overallStats.totalQuestions}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Target className="h-4 w-4" />
                      Questions répondues
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {overallStats.accuracy}%
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      Précision globale
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {overallStats.currentStreak}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Zap className="h-4 w-4" />
                      Série actuelle
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {formatTime(overallStats.averageResponseTime)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      Temps moyen
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Niveau de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg ${performanceLevel.bg}`}>
                      <span className={`font-semibold ${performanceLevel.color}`}>
                        {performanceLevel.level}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Progress value={overallStats.accuracy} className="h-3" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {overallStats.accuracy}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                      onClick={() => navigate('/quiz')}>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold mb-1">Nouveau Quiz</h3>
                    <p className="text-sm text-muted-foreground">
                      Testez vos connaissances
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                      onClick={() => navigate('/learning')}>
                  <CardContent className="p-6 text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold mb-1">Apprentissage</h3>
                    <p className="text-sm text-muted-foreground">
                      Explorez les émotions
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold mb-1">Révision</h3>
                    <p className="text-sm text-muted-foreground">
                      Revoir les difficultés
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              {/* Performance by level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance par Niveau
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceByLevel.map((level) => (
                      <div key={level.level} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              style={{ backgroundColor: level.color }}
                              className="text-white"
                            >
                              Niveau {level.level}
                            </Badge>
                            <span className="font-medium">{level.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {level.correct}/{level.total} ({level.accuracy}%)
                          </div>
                        </div>
                        <Progress value={level.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Streaks */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Séries de Réussites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Série actuelle</span>
                        <Badge variant="outline">{overallStats.currentStreak}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Meilleure série</span>
                        <Badge variant="outline">{overallStats.bestStreak}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Temps de Réponse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Temps moyen</span>
                        <Badge variant="outline">
                          {formatTime(overallStats.averageResponseTime)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dernière session</span>
                        <Badge variant="outline">
                          {overallStats.lastSessionDate 
                            ? new Date(overallStats.lastSessionDate).toLocaleDateString()
                            : 'N/A'
                          }
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Emotions Tab */}
            <TabsContent value="emotions" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top emotions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">
                      🌟 Émotions Maîtrisées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topEmotions.length > 0 ? (
                      <div className="space-y-3">
                        {topEmotions.map((item, index) => (
                          <div key={item.emotion.id} className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-medium">{item.emotion.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.correct}/{item.total} réponses
                              </div>
                            </div>
                            <Badge variant="success">{item.accuracy}%</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Pas encore assez de données
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Challenging emotions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">
                      🎯 À Améliorer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {challengingEmotions.length > 0 ? (
                      <div className="space-y-3">
                        {challengingEmotions.map((item, index) => (
                          <div key={item.emotion.id} className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-medium">{item.emotion.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.correct}/{item.total} réponses
                              </div>
                            </div>
                            <Badge variant="warning">{item.accuracy}%</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Pas encore assez de données
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <ProgressStats 
                userProgress={progress}
                variant="full"
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default Stats