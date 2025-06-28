import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import EmotionCard from '../components/EmotionCard'
import QuizFeedback from '../components/QuizFeedback'
import DifficultySelector from '../components/DifficultySelector'
import useAppStore from '../store/useAppStore'
import { getEmotionsByLevel, getEmotionById } from '../data/emotions'
import { shuffleArray, getDifficultyConfig } from '@/lib/utils'
import { useAudioSystem } from '../lib/audioSystem'
import { ArrowLeft, Clock, Target, RotateCcw, Home, Play, Pause } from 'lucide-react'

/**
 * Quiz page component for testing emotion recognition skills
 */
const Quiz = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    currentSession, 
    progress, 
    user,
    startSession, 
    answerQuestion, 
    updateProgress 
  } = useAppStore()
  
  const audioSystem = useAudioSystem()
  
  // Quiz state
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    location.state?.difficulty || 1
  )
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  // Timer effect
  useEffect(() => {
    let interval = null
    if (quizStarted && !showFeedback && !quizCompleted && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizStarted, showFeedback, quizCompleted, isPaused])

  /**
   * Starts a new quiz session
   */
  const handleStartQuiz = async () => {
    // Initialize audio system if audio is enabled
    if (user.preferences.audioEnabled) {
      try {
        await audioSystem.initialize()
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }
    
    const emotions = getEmotionsByLevel(selectedDifficulty)
    const config = getDifficultyConfig(selectedDifficulty)
    
    // Generate quiz questions
    const shuffledEmotions = shuffleArray([...emotions])
    const questions = shuffledEmotions.slice(0, config.questionsCount).map(emotion => {
      // Create answer options (correct + 3 random wrong answers)
      const wrongAnswers = emotions
        .filter(e => e.id !== emotion.id)
        .slice(0, 3)
      
      const options = shuffleArray([
        emotion,
        ...wrongAnswers
      ])
      
      return {
        emotion,
        options,
        correctAnswer: emotion.id
      }
    })
    
    startSession('quiz', selectedDifficulty, questions)
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setTimeElapsed(0)
    setQuestionStartTime(Date.now())
    setQuizCompleted(false)
    
    // Play start notification
    if (user.preferences.audioEnabled && user.preferences.soundEffectsEnabled) {
      audioSystem.playNotification()
    }
    
    // Speak first question if speech is enabled
    if (user.preferences.audioEnabled && user.preferences.speechEnabled && questions[0]) {
      setTimeout(() => {
        audioSystem.speakQuizQuestion(questions[0].emotion)
      }, 1000)
    }
  }

  /**
   * Handles answer selection
   * @param {Object} emotion - Selected emotion
   */
  const handleAnswerSelect = (emotion) => {
    if (selectedAnswer || showFeedback) return
    
    setSelectedAnswer(emotion)
    
    const responseTime = Date.now() - questionStartTime
    const currentQuestion = currentSession.questions[currentQuestionIndex]
    const isCorrect = emotion.id === currentQuestion.correctAnswer
    
    // Record answer
    answerQuestion(emotion, responseTime)
    
    // Play audio feedback
    if (user.preferences.audioEnabled && user.preferences.soundEffectsEnabled) {
      audioSystem.playQuizFeedback(isCorrect, progress.streakCount)
    }
    
    // Speak result if speech is enabled
    if (user.preferences.audioEnabled && user.preferences.speechEnabled) {
      setTimeout(() => {
        audioSystem.speakQuizResult(
          isCorrect, 
          currentQuestion.emotion.name, 
          emotion.name
        )
      }, 500)
    }
    
    // Show feedback
    setShowFeedback(true)
  }

  /**
   * Proceeds to next question or completes quiz
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSession.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setQuestionStartTime(Date.now())
      
      // Play navigation sound
      if (user.preferences.audioEnabled && user.preferences.soundEffectsEnabled) {
        audioSystem.playNavigation()
      }
      
      // Speak next question if speech is enabled
      if (user.preferences.audioEnabled && user.preferences.speechEnabled) {
        const nextQuestion = currentSession.questions[nextIndex]
        if (nextQuestion) {
          setTimeout(() => {
            audioSystem.speakQuizQuestion(nextQuestion.emotion)
          }, 800)
        }
      }
    } else {
      // Quiz completed
      setQuizCompleted(true)
      updateProgress(currentSession)
      
      // Play completion sound
      if (user.preferences.audioEnabled && user.preferences.soundEffectsEnabled) {
        setTimeout(() => {
          audioSystem.playSound('success')
        }, 500)
      }
      
      // Speak completion message
      if (user.preferences.audioEnabled && user.preferences.speechEnabled) {
        setTimeout(() => {
          const correctCount = currentSession.answers.filter(a => a.isCorrect).length
          const accuracy = Math.round((correctCount / currentSession.answers.length) * 100)
          audioSystem.speak(`Quiz terminé ! Vous avez obtenu ${correctCount} bonnes réponses sur ${currentSession.answers.length}, soit ${accuracy} pourcent de réussite.`)
        }, 1000)
      }
    }
  }

  /**
   * Retries current question (only for incorrect answers)
   */
  const handleRetryQuestion = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuestionStartTime(Date.now())
  }

  /**
   * Restarts the entire quiz
   */
  const handleRestartQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimeElapsed(0)
    setQuestionStartTime(null)
    setQuizCompleted(false)
    setIsPaused(false)
  }

  /**
   * Toggles quiz pause state
   */
  const handleTogglePause = () => {
    setIsPaused(!isPaused)
  }

  /**
   * Formats time in MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get current question data
  const currentQuestion = currentSession?.questions?.[currentQuestionIndex]
  const currentAnswer = currentSession?.answers?.[currentQuestionIndex]
  
  // Calculate progress
  const progressPercentage = currentSession?.questions ? 
    ((currentQuestionIndex + (showFeedback ? 1 : 0)) / currentSession.questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold">Mode Quiz</h1>
              <p className="text-muted-foreground">
                Testez vos connaissances en reconnaissance d'émotions
              </p>
            </div>
          </div>
          
          {quizStarted && !quizCompleted && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePause}
                className="flex items-center gap-2"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Reprendre' : 'Pause'}
              </Button>
            </div>
          )}
        </div>

        {/* Quiz Setup */}
        {!quizStarted && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration du Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <DifficultySelector
                  selectedLevel={selectedDifficulty}
                  onLevelSelect={setSelectedDifficulty}
                  userProgress={progress}
                  showRecommendations={true}
                />
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="flex items-center gap-2"
              >
                <Target className="h-5 w-5" />
                Commencer le Quiz
              </Button>
            </div>
          </div>
        )}

        {/* Quiz in Progress */}
        {quizStarted && !quizCompleted && currentQuestion && (
          <div className="space-y-6">
            {/* Progress bar */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Question {currentQuestionIndex + 1} sur {currentSession.questions.length}</span>
                    <Badge variant="outline">
                      Niveau {selectedDifficulty}
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Pause overlay */}
            {isPaused && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Quiz en pause</h3>
                  <p className="text-muted-foreground mb-4">
                    Cliquez sur "Reprendre" pour continuer
                  </p>
                  <Button onClick={handleTogglePause}>
                    <Play className="h-4 w-4 mr-2" />
                    Reprendre
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Question */}
            {!isPaused && !showFeedback && currentQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Quelle émotion voyez-vous ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    {currentQuestion.emotion && (
                      <EmotionCard
                        emotion={currentQuestion.emotion}
                        mode="quiz"
                        showDetails={false}
                        className="max-w-md"
                      />
                    )}
                  </div>
                  
                  {/* Answer options */}
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options?.map((option) => (
                      <Button
                        key={option.id}
                        variant={selectedAnswer?.id === option.id ? 'default' : 'outline'}
                        onClick={() => handleAnswerSelect(option)}
                        className="h-auto p-4 text-left justify-start"
                        disabled={selectedAnswer !== null}
                      >
                        <div>
                          <div className="font-semibold">{option.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {option.description.substring(0, 50)}...
                          </div>
                        </div>
                      </Button>
                    )) || []}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback */}
            {!isPaused && showFeedback && currentAnswer && (
              <QuizFeedback
                isCorrect={currentAnswer.isCorrect}
                selectedEmotion={getEmotionById(currentAnswer.selectedAnswer)}
                correctEmotion={currentQuestion.emotion}
                responseTime={currentAnswer.responseTime}
                onNext={handleNextQuestion}
                onRetry={!currentAnswer.isCorrect ? handleRetryQuestion : null}
                onLearnMore={() => navigate('/learning', { 
                  state: { 
                    difficulty: selectedDifficulty,
                    emotionId: currentQuestion.emotion.id 
                  }
                })}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={currentSession.questions.length}
              />
            )}
          </div>
        )}

        {/* Quiz Completed */}
        {quizCompleted && currentSession && (
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-green-800">
                  🎉 Quiz Terminé !
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Results summary */}
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {currentSession.answers.filter(a => a.isCorrect).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Bonnes réponses</div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(
                        (currentSession.answers.filter(a => a.isCorrect).length / 
                         currentSession.answers.length) * 100
                      )}%
                    </div>
                    <div className="text-sm text-muted-foreground">Précision</div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatTime(timeElapsed)}
                    </div>
                    <div className="text-sm text-muted-foreground">Temps total</div>
                  </div>
                </div>

                {/* Performance message */}
                <div className="text-center p-4 bg-white rounded-lg">
                  {(() => {
                    const accuracy = (currentSession.answers.filter(a => a.isCorrect).length / 
                                    currentSession.answers.length) * 100
                    if (accuracy >= 90) {
                      return (
                        <div>
                          <div className="text-lg font-semibold text-green-600 mb-2">
                            Excellent travail ! 🌟
                          </div>
                          <p className="text-muted-foreground">
                            Vous maîtrisez parfaitement la reconnaissance de ces émotions.
                          </p>
                        </div>
                      )
                    } else if (accuracy >= 70) {
                      return (
                        <div>
                          <div className="text-lg font-semibold text-blue-600 mb-2">
                            Très bien ! 👍
                          </div>
                          <p className="text-muted-foreground">
                            Vous avez une bonne compréhension des émotions. Continuez à vous entraîner !
                          </p>
                        </div>
                      )
                    } else if (accuracy >= 50) {
                      return (
                        <div>
                          <div className="text-lg font-semibold text-yellow-600 mb-2">
                            Bon début ! 💪
                          </div>
                          <p className="text-muted-foreground">
                            Vous progressez bien. Essayez le mode apprentissage pour améliorer vos résultats.
                          </p>
                        </div>
                      )
                    } else {
                      return (
                        <div>
                          <div className="text-lg font-semibold text-orange-600 mb-2">
                            Continuez vos efforts ! 🎯
                          </div>
                          <p className="text-muted-foreground">
                            La reconnaissance d'émotions demande de la pratique. Le mode apprentissage vous aidera !
                          </p>
                        </div>
                      )
                    }
                  })()
                  }
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={handleRestartQuiz}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Refaire le Quiz
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/learning', { state: { difficulty: selectedDifficulty } })}
                    variant="outline"
                  >
                    Mode Apprentissage
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/stats')}
                    variant="outline"
                  >
                    Voir mes Statistiques
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Retour à l'Accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz