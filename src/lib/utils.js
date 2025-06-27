import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Calculates percentage with precision
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {number} Percentage rounded to 1 decimal place
 */
export function calculatePercentage(correct, total) {
  if (total === 0) return 0
  return Math.round((correct / total) * 1000) / 10
}

/**
 * Formats time in milliseconds to readable format
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Gets difficulty level configuration
 * @param {number} level - Difficulty level (1-3)
 * @returns {Object} Level configuration
 */
export function getDifficultyConfig(level) {
  const configs = {
    1: {
      name: 'Débutant',
      description: 'Émotions de base',
      emotions: ['joie', 'tristesse', 'colère', 'peur', 'surprise', 'dégoût'],
      color: 'bg-green-500'
    },
    2: {
      name: 'Intermédiaire',
      description: 'Émotions secondaires',
      emotions: ['anxiété', 'fierté', 'gêne', 'jalousie', 'mépris', 'confusion'],
      color: 'bg-yellow-500'
    },
    3: {
      name: 'Avancé',
      description: 'Micro-expressions et expressions mixtes',
      emotions: ['scepticisme', 'concentration', 'détermination', 'nostalgie', 'soulagement', 'anticipation'],
      color: 'bg-red-500'
    }
  }
  return configs[level] || configs[1]
}