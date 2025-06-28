import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { shuffleArray } from '../lib/utils'

/**
 * Main application store using Zustand
 * Manages user progress, quiz state, and application settings
 */
const useAppStore = create(
  persist(
    (set, get) => ({
      // User profile and settings
      user: {
        name: '',
        isAnonymous: true,
        preferences: {
          audioEnabled: false,
          audioVolume: 70,
          speechEnabled: false,
          soundEffectsEnabled: true,
          highContrast: false,
          reducedMotion: false,
          fontSize: 'medium' // small, medium, large
        }
      },

      // Current session state
      currentSession: {
        mode: null, // 'learning' | 'quiz'
        difficulty: 1,
        currentEmotion: null,
        currentQuestionIndex: 0,
        questions: [],
        answers: [],
        startTime: null,
        isActive: false
      },

      // Progress tracking
      progress: {
        totalQuestions: 0,
        correctAnswers: 0,
        streakCount: 0,
        bestStreak: 0,
        averageResponseTime: 0,
        emotionStats: {}, // { emotion: { correct: 0, total: 0, avgTime: 0 } }
        badges: [],
        lastSessionDate: null
      },

      // Actions
      setUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      setUserPreferences: (preferences) => set((state) => ({
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        }
      })),

      startSession: (mode, difficulty = 1, customQuestions = null) => {
        let questions
        if (customQuestions) {
          questions = customQuestions
        } else {
          const emotions = get().getEmotionsForDifficulty(difficulty)
          questions = shuffleArray(emotions).slice(0, 10) // 10 questions per session
        }
        
        set((state) => ({
          currentSession: {
            mode,
            difficulty,
            currentEmotion: questions[0]?.emotion || questions[0],
            currentQuestionIndex: 0,
            questions,
            answers: [],
            startTime: Date.now(),
            isActive: true
          }
        }))
      },

      answerQuestion: (selectedAnswer, responseTime) => {
        const state = get()
        const { currentSession } = state
        const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex]
        const correctAnswer = currentQuestion.correctAnswer || currentQuestion.emotion?.id
        const selectedAnswerId = selectedAnswer.id || selectedAnswer
        const isCorrect = selectedAnswerId === correctAnswer

        const newAnswer = {
          question: currentQuestion,
          selectedAnswer: selectedAnswerId,
          correctAnswer: correctAnswer,
          isCorrect: isCorrect,
          responseTime,
          timestamp: Date.now()
        }

        const newAnswers = [...currentSession.answers, newAnswer]
        const nextIndex = currentSession.currentQuestionIndex + 1
        const isSessionComplete = nextIndex >= currentSession.questions.length

        set((state) => ({
          currentSession: {
            ...state.currentSession,
            answers: newAnswers,
            currentQuestionIndex: nextIndex,
            currentEmotion: isSessionComplete ? null : currentSession.questions[nextIndex]?.emotion,
            isActive: !isSessionComplete
          }
        }))

        // Update progress if session is complete
        if (isSessionComplete) {
          get().updateProgress(newAnswers)
        }

        return { isCorrect, isSessionComplete }
      },

      updateProgress: (sessionAnswers) => {
        set((state) => {
          const correctCount = sessionAnswers.filter(a => a.isCorrect).length
          const totalTime = sessionAnswers.reduce((sum, a) => sum + a.responseTime, 0)
          const avgTime = totalTime / sessionAnswers.length

          // Update emotion-specific stats
          const newEmotionStats = { ...state.progress.emotionStats }
          sessionAnswers.forEach(answer => {
            const emotionId = answer.question.emotion?.id || answer.question.id
            if (!newEmotionStats[emotionId]) {
              newEmotionStats[emotionId] = { correct: 0, total: 0, avgTime: 0 }
            }
            newEmotionStats[emotionId].total += 1
            if (answer.isCorrect) {
              newEmotionStats[emotionId].correct += 1
            }
            // Update average response time
            const prevAvg = newEmotionStats[emotionId].avgTime
            const prevTotal = newEmotionStats[emotionId].total - 1
            newEmotionStats[emotionId].avgTime = 
              (prevAvg * prevTotal + answer.responseTime) / newEmotionStats[emotionId].total
          })

          // Calculate streak
          let currentStreak = 0
          for (let i = sessionAnswers.length - 1; i >= 0; i--) {
            if (sessionAnswers[i].isCorrect) {
              currentStreak++
            } else {
              break
            }
          }

          const newProgress = {
            totalQuestions: state.progress.totalQuestions + sessionAnswers.length,
            correctAnswers: state.progress.correctAnswers + correctCount,
            streakCount: currentStreak,
            bestStreak: Math.max(state.progress.bestStreak, currentStreak),
            averageResponseTime: 
              (state.progress.averageResponseTime * state.progress.totalQuestions + totalTime) /
              (state.progress.totalQuestions + sessionAnswers.length),
            emotionStats: newEmotionStats,
            badges: state.progress.badges, // TODO: Implement badge logic
            lastSessionDate: Date.now()
          }

          return {
            progress: newProgress
          }
        })
      },

      resetSession: () => set((state) => ({
        currentSession: {
          mode: null,
          difficulty: 1,
          currentEmotion: null,
          currentQuestionIndex: 0,
          questions: [],
          answers: [],
          startTime: null,
          isActive: false
        }
      })),

      resetProgress: () => set((state) => ({
        progress: {
          totalQuestions: 0,
          correctAnswers: 0,
          streakCount: 0,
          bestStreak: 0,
          averageResponseTime: 0,
          emotionStats: {},
          badges: [],
          lastSessionDate: null
        }
      })),

      // Helper functions
      getEmotionsForDifficulty: (difficulty) => {
        const emotionSets = {
          1: ['joie', 'tristesse', 'colère', 'peur', 'surprise', 'dégoût'],
          2: ['anxiété', 'fierté', 'gêne', 'jalousie', 'mépris', 'confusion'],
          3: ['scepticisme', 'concentration', 'détermination', 'nostalgie', 'soulagement', 'anticipation']
        }
        return emotionSets[difficulty] || emotionSets[1]
      },

      getAccuracyRate: () => {
        const { totalQuestions, correctAnswers } = get().progress
        return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
      },

      getEmotionAccuracy: (emotion) => {
        const stats = get().progress.emotionStats[emotion]
        return stats ? (stats.correct / stats.total) * 100 : 0
      }
    }),
    {
      name: 'decodeur-facial-storage',
      partialize: (state) => ({
        user: state.user,
        progress: state.progress
      })
    }
  )
)

export default useAppStore