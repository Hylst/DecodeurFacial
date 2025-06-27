import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ProgressStats from '../components/ProgressStats'
import useAppStore from '../store/useAppStore'
import { BookOpen, Target, BarChart3, Settings, Play, Brain, Heart, Users } from 'lucide-react'

/**
 * Home page component - Main landing page and navigation hub
 */
const Home = () => {
  const navigate = useNavigate()
  const { progress, user } = useAppStore()
  
  /**
   * Handles navigation to different modes
   * @param {string} mode - Mode to navigate to ('learning' | 'quiz')
   */
  const handleModeSelect = (mode) => {
    if (mode === 'learning') {
      navigate('/learning')
    } else if (mode === 'quiz') {
      navigate('/quiz')
    }
  }

  /**
   * Gets welcome message based on user progress
   * @returns {string} Personalized welcome message
   */
  const getWelcomeMessage = () => {
    const { totalQuestions, correctAnswers } = progress
    
    if (totalQuestions === 0) {
      return "Bienvenue ! Commencez votre apprentissage des émotions."
    }
    
    const accuracy = (correctAnswers / totalQuestions) * 100
    
    if (accuracy >= 80) {
      return "Excellent travail ! Continuez sur cette lancée."
    } else if (accuracy >= 60) {
      return "Bon progrès ! Continuez à vous entraîner."
    } else {
      return "Chaque session vous fait progresser. Continuez !"
    }
  }

  /**
   * Gets recommended next action based on user progress
   * @returns {Object} Recommendation object
   */
  const getRecommendation = () => {
    const { totalQuestions, correctAnswers, lastSessionDate } = progress
    
    if (totalQuestions === 0) {
      return {
        title: "Commencer par l'apprentissage",
        description: "Découvrez les émotions de base avec des explications détaillées",
        action: () => navigate('/learning'),
        icon: BookOpen,
        variant: "default"
      }
    }
    
    const daysSinceLastSession = lastSessionDate 
      ? Math.floor((Date.now() - lastSessionDate) / (1000 * 60 * 60 * 24))
      : 0
    
    if (daysSinceLastSession > 3) {
      return {
        title: "Session de révision",
        description: "Rafraîchissez vos connaissances avec un quiz rapide",
        action: () => navigate('/quiz'),
        icon: Target,
        variant: "outline"
      }
    }
    
    const accuracy = (correctAnswers / totalQuestions) * 100
    
    if (accuracy < 70) {
      return {
        title: "Mode apprentissage recommandé",
        description: "Renforcez vos bases avec des explications détaillées",
        action: () => navigate('/learning'),
        icon: BookOpen,
        variant: "default"
      }
    }
    
    return {
      title: "Testez vos connaissances",
      description: "Vous êtes prêt pour un nouveau quiz !",
      action: () => navigate('/quiz'),
      icon: Target,
      variant: "default"
    }
  }

  const recommendation = getRecommendation()
  const RecommendationIcon = recommendation.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary text-primary-foreground rounded-full">
              <Brain className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              DécodeurFacial
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Entraînement interactif à la reconnaissance des expressions faciales
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Conçu pour les personnes TSA
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Accessible à tous
            </Badge>
          </div>
        </div>

        {/* Welcome Message & Recommendation */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  {user.name || 'Utilisateur'} 👋
                </h2>
                <p className="text-muted-foreground">
                  {getWelcomeMessage()}
                </p>
              </div>
              
              <div className="text-right">
                <Button
                  onClick={recommendation.action}
                  variant={recommendation.variant}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <RecommendationIcon className="h-5 w-5" />
                  {recommendation.title}
                </Button>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  {recommendation.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        {progress.totalQuestions > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Vos progrès</h2>
            <ProgressStats progress={progress} variant="summary" />
          </div>
        )}

        {/* Main Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Modes d'entraînement</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Learning Mode */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <div>Mode Apprentissage</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      Découverte guidée des émotions
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Explorez les expressions faciales avec des explications détaillées, 
                  des indices visuels et des conseils pratiques.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Fonctionnalités :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Images avec indices faciaux surlignés</li>
                    <li>• Descriptions audio des émotions</li>
                    <li>• Conseils pour reconnaître chaque expression</li>
                    <li>• Progression à votre rythme</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => handleModeSelect('learning')}
                  className="w-full"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Commencer l'apprentissage
                </Button>
              </CardContent>
            </Card>

            {/* Quiz Mode */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 text-white rounded-lg group-hover:bg-green-600 transition-colors">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <div>Mode Quiz</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      Testez vos connaissances
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Mettez vos compétences à l'épreuve avec des quiz interactifs 
                  et recevez des retours immédiats sur vos réponses.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Fonctionnalités :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Questions à choix multiples</li>
                    <li>• Feedback immédiat et explications</li>
                    <li>• Suivi des performances</li>
                    <li>• Niveaux de difficulté progressifs</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => handleModeSelect('quiz')}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Démarrer un quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/stats')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Voir les statistiques
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>
            DécodeurFacial - Application d'entraînement à la reconnaissance des émotions
          </p>
          <p className="mt-1">
            Conçue avec ❤️ pour favoriser l'inclusion et l'apprentissage
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home