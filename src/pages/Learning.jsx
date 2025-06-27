import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import EmotionCard from '../components/EmotionCard'
import DifficultySelector from '../components/DifficultySelector'
import ProgressIndicator from '../components/ProgressIndicator'
import EmotionHighlight from '../components/EmotionHighlight'
import useAppStore from '../store/useAppStore'
import { getEmotionsByLevel, getAllEmotions } from '../data/emotions'
import { ArrowLeft, ArrowRight, Home, Filter, Grid, List, Search, CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Learning page component for guided emotion discovery
 */
const Learning = () => {
  const navigate = useNavigate()
  const { progress, setUserPreferences, user } = useAppStore()
  
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0)
  const [viewMode, setViewMode] = useState('guided') // 'guided' | 'grid' | 'list'
  const [showDetails, setShowDetails] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all') // 'all' | 'positive' | 'negative' | 'neutral'
  const [showHints, setShowHints] = useState(false)
  const [highlightMode, setHighlightMode] = useState('subtle')
  const [completedEmotions, setCompletedEmotions] = useState(new Set())
  const [achievements, setAchievements] = useState([])
  
  const emotions = getEmotionsByLevel(selectedLevel)
  const currentEmotion = emotions[currentEmotionIndex]
  
  /**
   * Filters emotions based on search term and category
   * @returns {Array} Filtered emotions array
   */
  const getFilteredEmotions = () => {
    let filtered = emotions
    
    if (searchTerm) {
      filtered = filtered.filter(emotion => 
        emotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emotion.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(emotion => emotion.category === selectedCategory)
    }
    
    return filtered
  }

  /**
   * Handles navigation to next emotion
   */
  const handleNext = () => {
    if (currentEmotionIndex < emotions.length - 1) {
      setCurrentEmotionIndex(currentEmotionIndex + 1)
    }
  }

  /**
   * Handles navigation to previous emotion
   */
  const handlePrevious = () => {
    if (currentEmotionIndex > 0) {
      setCurrentEmotionIndex(currentEmotionIndex - 1)
    }
  }

  /**
   * Handles level change and resets current emotion
   * @param {number} level - New difficulty level
   */
  const handleLevelChange = (level) => {
    setSelectedLevel(level)
    setCurrentEmotionIndex(0)
    setShowHints(false)
  }

  // Mark emotion as completed and check for achievements
  const markEmotionCompleted = (emotionId) => {
    const newCompleted = new Set(completedEmotions)
    newCompleted.add(emotionId)
    setCompletedEmotions(newCompleted)
    
    // Check for achievements
    checkAchievements(newCompleted)
  }

  // Check and award achievements
  const checkAchievements = (completed) => {
    const newAchievements = []
    const level1Emotions = getEmotionsByLevel(1)
    const level2Emotions = getEmotionsByLevel(2)
    
    // First emotion achievement
    if (completed.size === 1 && !achievements.find(a => a.id === 'first_emotion')) {
      newAchievements.push({
        id: 'first_emotion',
        name: 'Premier pas',
        description: 'Première émotion apprise !',
        icon: '🎯',
        type: 'milestone'
      })
    }
    
    // Level 1 completion
    const level1Completed = level1Emotions.filter(e => completed.has(e.id)).length
    if (level1Completed === level1Emotions.length && !achievements.find(a => a.id === 'level1_master')) {
      newAchievements.push({
        id: 'level1_master',
        name: 'Maître Niveau 1',
        description: 'Toutes les émotions de base maîtrisées !',
        icon: '🌟',
        type: 'completion'
      })
    }
    
    // Level 2 completion
    const level2Completed = level2Emotions.filter(e => completed.has(e.id)).length
    if (level2Completed === level2Emotions.length && !achievements.find(a => a.id === 'level2_master')) {
      newAchievements.push({
        id: 'level2_master',
        name: 'Expert Émotionnel',
        description: 'Toutes les émotions avancées maîtrisées !',
        icon: '🏆',
        type: 'completion'
      })
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements])
    }
  }

  // Get progress data for current level
  const getProgressData = () => {
    const levelEmotions = getEmotionsByLevel(selectedLevel)
    const completed = levelEmotions.filter(e => completedEmotions.has(e.id)).length
    return {
      current: completed,
      total: levelEmotions.length,
      percentage: Math.round((completed / levelEmotions.length) * 100)
    }
  }

  /**
   * Handles emotion selection in grid/list view
   * @param {number} index - Emotion index
   */
  const handleEmotionSelect = (index) => {
    setCurrentEmotionIndex(index)
    setViewMode('guided')
  }

  // Reset emotion index when level changes
  useEffect(() => {
    setCurrentEmotionIndex(0)
  }, [selectedLevel])

  const filteredEmotions = getFilteredEmotions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
              <h1 className="text-3xl font-bold">Mode Apprentissage</h1>
              <p className="text-muted-foreground">
                Découvrez les expressions faciales avec des explications détaillées
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'guided' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('guided')}
            >
              Guidé
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Level Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Niveau de difficulté</CardTitle>
          </CardHeader>
          <CardContent>
            <DifficultySelector
              selectedLevel={selectedLevel}
              onLevelSelect={handleLevelChange}
              userProgress={progress}
            />
          </CardContent>
        </Card>

        {/* Guided View */}
        {viewMode === 'guided' && currentEmotion && (
          <div className="space-y-6">
            {/* Enhanced Progress */}
            <div className="space-y-4">
              <ProgressIndicator
                current={currentEmotionIndex + 1}
                total={emotions.length}
                label="Progression de la leçon"
                type="lesson"
                achievements={achievements}
                className="bounce-in"
              />
              
              <ProgressIndicator
                current={getProgressData().current}
                total={getProgressData().total}
                label={`Maîtrise Niveau ${selectedLevel}`}
                type="mastery"
                achievements={achievements}
                className="slide-up"
              />
              
              {achievements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {achievements.slice(-3).map(achievement => (
                    <Badge 
                      key={achievement.id}
                      variant="secondary"
                      className="sparkle-badge flex items-center gap-1"
                    >
                      <span>{achievement.icon}</span>
                      <span className="text-xs">{achievement.name}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Emotion header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Émotion : {currentEmotion.name}
              </h2>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Masquer' : 'Afficher'} les détails
                </Button>
              </div>
            </div>

            {/* Enhanced emotion display */}
            <div className="grid lg:grid-cols-2 gap-6 learning-layout">
              <div className="space-y-4">
                <EmotionHighlight
                  emotion={currentEmotion}
                  showHints={showHints}
                  onToggleHints={setShowHints}
                  highlightMode={highlightMode}
                  autoHighlight={false}
                  className="w-full bounce-in emotion-card"
                />
                
                {/* Responsive highlight mode selector */}
                <div className="emotion-highlight-controls">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <span className="text-muted-foreground font-medium">Mode d'aide :</span>
                    <div className="flex gap-1 highlight-mode-selector">
                      {['none', 'subtle', 'strong'].map(mode => (
                        <Button
                          key={mode}
                          variant={highlightMode === mode ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setHighlightMode(mode)}
                          className="text-xs px-3 py-2 button-interactive transition-all duration-200 hover:scale-105"
                        >
                          {mode === 'none' ? 'Aucun' : mode === 'subtle' ? 'Subtil' : 'Fort'}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mode description */}
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                    {highlightMode === 'none' && 'Aucune mise en évidence'}
                    {highlightMode === 'subtle' && 'Mise en évidence subtile des zones faciales'}
                    {highlightMode === 'strong' && 'Mise en évidence forte avec effets visuels'}
                  </div>
                </div>
              </div>
              
              {/* Detailed information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Informations détaillées</span>
                    <Badge 
                      variant={currentEmotion.category === 'positive' ? 'success' : 
                              currentEmotion.category === 'negative' ? 'destructive' : 'secondary'}
                    >
                      {currentEmotion.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{currentEmotion.description}</p>
                  </div>
                  
                  {/* Facial cues */}
                  <div>
                    <h4 className="font-semibold mb-2">Indices faciaux</h4>
                    <div className="space-y-2">
                      {Object.entries(currentEmotion.facialCues).map(([area, description]) => (
                        <div key={area} className="flex gap-3">
                          <Badge variant="outline" className="min-w-fit">
                            {area}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Key indicators */}
                  <div>
                    <h4 className="font-semibold mb-2">Points clés à retenir</h4>
                    <ul className="space-y-1">
                      {currentEmotion.keyIndicators.map((indicator, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tips */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900">💡 Conseil pratique</h4>
                    <p className="text-sm text-blue-800">{currentEmotion.tips}</p>
                  </div>
                  
                  {/* Common mistakes */}
                  {currentEmotion.commonMistakes && currentEmotion.commonMistakes.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold mb-2 text-yellow-900">⚠️ Erreurs fréquentes</h4>
                      <ul className="space-y-1">
                        {currentEmotion.commonMistakes.map((mistake, index) => (
                          <li key={index} className="text-sm text-yellow-800">
                            • {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Responsive Navigation */}
            <div className="pt-6 border-t space-y-4">
              {/* Mobile-first navigation layout */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 navigation-buttons">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentEmotionIndex === 0}
                  className="flex items-center gap-2 transition-all duration-200 hover:scale-105 button-interactive w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Précédent</span>
                  <span className="sm:hidden">Préc.</span>
                </Button>
                
                {/* Center action buttons */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant={completedEmotions.has(currentEmotion.id) ? 'default' : 'outline'}
                    onClick={() => markEmotionCompleted(currentEmotion.id)}
                    className="flex items-center gap-2 transition-all duration-200 hover:scale-105 button-interactive"
                  >
                    {completedEmotions.has(currentEmotion.id) ? (
                      <>
                        <span className="text-green-500">✓</span>
                        <span className="hidden sm:inline">Maîtrisé</span>
                        <span className="sm:hidden">OK</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-400">○</span>
                        <span className="hidden sm:inline">Marquer comme appris</span>
                        <span className="sm:hidden">Marquer</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/quiz', { state: { difficulty: selectedLevel } })}
                    className="transition-all duration-200 hover:scale-105 button-interactive"
                  >
                    <span className="hidden sm:inline">Tester mes connaissances</span>
                    <span className="sm:hidden">Quiz</span>
                  </Button>
                </div>
                
                <Button
                  onClick={handleNext}
                  disabled={currentEmotionIndex === emotions.length - 1}
                  className="flex items-center gap-2 transition-all duration-200 hover:scale-105 button-interactive w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <span className="sm:hidden">Suiv.</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress indicator for mobile */}
              <div className="block sm:hidden">
                <div className="text-center text-sm text-muted-foreground">
                  {currentEmotionIndex + 1} / {emotions.length} émotions
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher une émotion..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">Toutes les catégories</option>
                      <option value="positive">Positives</option>
                      <option value="negative">Négatives</option>
                      <option value="neutral">Neutres</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Emotions grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmotions.map((emotion, index) => (
                <div key={emotion.id} onClick={() => handleEmotionSelect(index)}>
                  <EmotionCard
                    emotion={emotion}
                    mode="preview"
                    showDetails={false}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredEmotions.map((emotion, index) => (
              <Card 
                key={emotion.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleEmotionSelect(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {emotion.imageUrl ? (
                        <img
                          src={emotion.imageUrl}
                          alt={emotion.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-face.svg'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          😊
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{emotion.name}</h3>
                        <Badge 
                          variant={emotion.category === 'positive' ? 'success' : 
                                  emotion.category === 'negative' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {emotion.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{emotion.description}</p>
                    </div>
                    
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Learning