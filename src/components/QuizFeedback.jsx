import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getEmotionById } from '@/data/emotions'

/**
 * QuizFeedback component for displaying immediate feedback after quiz answers
 * @param {Object} props - Component props
 * @param {boolean} props.isCorrect - Whether the answer was correct
 * @param {string} props.correctEmotion - ID of the correct emotion
 * @param {string} props.selectedEmotion - ID of the selected emotion
 * @param {number} props.responseTime - Time taken to respond in milliseconds
 * @param {Function} props.onContinue - Callback to continue to next question
 * @param {Function} props.onRetry - Callback to retry the question
 * @param {Function} props.onLearnMore - Callback to learn more about the emotion
 * @param {boolean} props.isLastQuestion - Whether this is the last question
 * @param {Object} props.sessionStats - Current session statistics
 */
const QuizFeedback = ({
  isCorrect,
  correctEmotion,
  selectedEmotion,
  responseTime,
  onContinue,
  onRetry,
  onLearnMore,
  isLastQuestion = false,
  sessionStats = { correct: 0, total: 0 }
}) => {
  const correctEmotionData = getEmotionById(correctEmotion)
  const selectedEmotionData = selectedEmotion ? getEmotionById(selectedEmotion) : null

  /**
   * Formats response time for display
   * @param {number} ms - Time in milliseconds
   * @returns {string} Formatted time string
   */
  const formatResponseTime = (ms) => {
    const seconds = (ms / 1000).toFixed(1)
    return `${seconds}s`
  }

  /**
   * Gets encouragement message based on performance
   * @returns {string} Encouragement message
   */
  const getEncouragementMessage = () => {
    const accuracy = sessionStats.total > 0 ? (sessionStats.correct / sessionStats.total) * 100 : 0
    
    if (isCorrect) {
      if (responseTime < 3000) {
        return "Excellent ! Réponse rapide et correcte ! 🎉"
      } else {
        return "Très bien ! Bonne réponse ! 👍"
      }
    } else {
      if (accuracy > 70) {
        return "Pas de souci, vous vous en sortez très bien ! 💪"
      } else {
        return "Continuez, chaque erreur est une occasion d'apprendre ! 📚"
      }
    }
  }

  return (
    <Card className={cn(
      "w-full max-w-2xl mx-auto",
      isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <XCircle className="h-8 w-8 text-red-600" />
          )}
          <div>
            <div className={cn(
              "text-2xl font-bold",
              isCorrect ? "text-green-700" : "text-red-700"
            )}>
              {isCorrect ? "Correct !" : "Incorrect"}
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {getEncouragementMessage()}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Answer comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Correct answer */}
          <div className="space-y-2">
            <h3 className="font-semibold text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Bonne réponse
            </h3>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="font-medium text-lg">{correctEmotionData?.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {correctEmotionData?.description}
              </div>
              {correctEmotionData?.imageUrl && (
                <img
                  src={correctEmotionData.imageUrl}
                  alt={`Expression de ${correctEmotionData.name}`}
                  className="w-full h-32 object-cover rounded mt-2"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-face.svg'
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Selected answer (if incorrect) */}
          {!isCorrect && selectedEmotionData && (
            <div className="space-y-2">
              <h3 className="font-semibold text-red-700 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Votre réponse
              </h3>
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <div className="font-medium text-lg">{selectedEmotionData.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedEmotionData.description}
                </div>
                {selectedEmotionData.imageUrl && (
                  <img
                    src={selectedEmotionData.imageUrl}
                    alt={`Expression de ${selectedEmotionData.name}`}
                    className="w-full h-32 object-cover rounded mt-2"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-face.svg'
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Detailed explanation */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">Explication :</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Indices clés :</strong></p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {correctEmotionData?.keyIndicators.map((indicator, index) => (
                <li key={index}>{indicator}</li>
              ))}
            </ul>
            
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <p className="text-blue-800">
                <strong>Conseil :</strong> {correctEmotionData?.tips}
              </p>
            </div>
            
            {!isCorrect && correctEmotionData?.commonMistakes && (
              <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <p className="text-yellow-800">
                  <strong>Erreur fréquente :</strong> {correctEmotionData.commonMistakes[0]}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Performance stats */}
        <div className="flex justify-between items-center p-4 bg-white rounded-lg border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {sessionStats.correct}/{sessionStats.total}
            </div>
            <div className="text-sm text-muted-foreground">Bonnes réponses</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {formatResponseTime(responseTime)}
            </div>
            <div className="text-sm text-muted-foreground">Temps de réponse</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Précision</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!isCorrect && onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réessayer
            </Button>
          )}
          
          {onLearnMore && (
            <Button
              variant="outline"
              onClick={() => onLearnMore(correctEmotion)}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              En savoir plus
            </Button>
          )}
          
          <Button
            onClick={onContinue}
            className="flex items-center gap-2"
            size="lg"
          >
            {isLastQuestion ? "Voir les résultats" : "Question suivante"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuizFeedback