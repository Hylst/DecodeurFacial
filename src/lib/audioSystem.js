import * as Tone from 'tone'

/**
 * Audio System for DécodeurFacial
 * Provides sound feedback, audio cues, and accessibility features
 */
class AudioSystem {
  constructor() {
    this.isInitialized = false
    this.isEnabled = true
    this.volume = 0.7
    
    // Audio context and instruments
    this.synth = null
    this.sampler = null
    this.reverb = null
    
    // Sound effects cache
    this.sounds = {
      correct: null,
      incorrect: null,
      click: null,
      success: null,
      notification: null
    }
    
    // Text-to-speech
    this.speechSynthesis = window.speechSynthesis
    this.speechVoice = null
    
    this.initializeVoices()
  }

  /**
   * Initialize the audio system
   * Must be called after user interaction due to browser autoplay policies
   */
  async initialize() {
    if (this.isInitialized) return
    
    try {
      // Start Tone.js audio context
      await Tone.start()
      
      // Create audio effects
      this.reverb = new Tone.Reverb({
        decay: 1.5,
        wet: 0.3
      }).toDestination()
      
      // Create synthesizer for procedural sounds
      this.synth = new Tone.Synth({
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.3,
          release: 0.8
        }
      }).connect(this.reverb)
      
      // Create sound effects
      this.createSoundEffects()
      
      this.isInitialized = true
      console.log('Audio system initialized successfully')
    } catch (error) {
      console.error('Failed to initialize audio system:', error)
    }
  }

  /**
   * Create procedural sound effects using Tone.js
   */
  createSoundEffects() {
    // Correct answer sound - ascending major chord
    this.sounds.correct = () => {
      if (!this.isEnabled || !this.isInitialized) return
      
      const now = Tone.now()
      this.synth.triggerAttackRelease('C4', '0.2', now)
      this.synth.triggerAttackRelease('E4', '0.2', now + 0.1)
      this.synth.triggerAttackRelease('G4', '0.3', now + 0.2)
    }
    
    // Incorrect answer sound - descending minor chord
    this.sounds.incorrect = () => {
      if (!this.isEnabled || !this.isInitialized) return
      
      const now = Tone.now()
      this.synth.triggerAttackRelease('G3', '0.2', now)
      this.synth.triggerAttackRelease('Eb3', '0.2', now + 0.1)
      this.synth.triggerAttackRelease('C3', '0.3', now + 0.2)
    }
    
    // Click sound - short percussive note
    this.sounds.click = () => {
      if (!this.isEnabled || !this.isInitialized) return
      
      this.synth.triggerAttackRelease('C5', '0.05')
    }
    
    // Success sound - celebratory arpeggio
    this.sounds.success = () => {
      if (!this.isEnabled || !this.isInitialized) return
      
      const notes = ['C4', 'E4', 'G4', 'C5']
      const now = Tone.now()
      
      notes.forEach((note, index) => {
        this.synth.triggerAttackRelease(note, '0.2', now + index * 0.1)
      })
    }
    
    // Notification sound - gentle bell
    this.sounds.notification = () => {
      if (!this.isEnabled || !this.isInitialized) return
      
      const now = Tone.now()
      this.synth.triggerAttackRelease('A4', '0.5', now)
      this.synth.triggerAttackRelease('A5', '0.3', now + 0.2)
    }
  }

  /**
   * Initialize speech synthesis voices
   */
  initializeVoices() {
    const setVoice = () => {
      const voices = this.speechSynthesis.getVoices()
      // Prefer French voice, fallback to default
      this.speechVoice = voices.find(voice => 
        voice.lang.startsWith('fr') || voice.name.includes('French')
      ) || voices[0]
    }
    
    // Voices might not be loaded immediately
    if (this.speechSynthesis.getVoices().length > 0) {
      setVoice()
    } else {
      this.speechSynthesis.addEventListener('voiceschanged', setVoice)
    }
  }

  /**
   * Play a sound effect
   * @param {string} soundName - Name of the sound to play
   */
  playSound(soundName) {
    if (!this.isEnabled || !this.isInitialized) return
    
    const sound = this.sounds[soundName]
    if (sound && typeof sound === 'function') {
      sound()
    }
  }

  /**
   * Speak text using text-to-speech
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   */
  speak(text, options = {}) {
    if (!this.isEnabled || !this.speechSynthesis) return
    
    // Cancel any ongoing speech
    this.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = this.speechVoice
    utterance.rate = options.rate || 0.9
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || this.volume
    
    this.speechSynthesis.speak(utterance)
  }

  /**
   * Stop any ongoing speech
   */
  stopSpeech() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel()
    }
  }

  /**
   * Set audio enabled/disabled
   * @param {boolean} enabled - Whether audio is enabled
   */
  setEnabled(enabled) {
    this.isEnabled = enabled
    if (!enabled) {
      this.stopSpeech()
    }
  }

  /**
   * Set audio volume
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.synth) {
      this.synth.volume.value = Tone.gainToDb(this.volume)
    }
  }

  /**
   * Play quiz feedback sounds based on result
   * @param {boolean} isCorrect - Whether the answer was correct
   * @param {number} streak - Current streak count
   */
  playQuizFeedback(isCorrect, streak = 0) {
    if (isCorrect) {
      if (streak >= 5) {
        this.playSound('success')
      } else {
        this.playSound('correct')
      }
    } else {
      this.playSound('incorrect')
    }
  }

  /**
   * Play navigation sound
   */
  playNavigation() {
    this.playSound('click')
  }

  /**
   * Play notification sound
   */
  playNotification() {
    this.playSound('notification')
  }

  /**
   * Speak emotion description for accessibility
   * @param {Object} emotion - Emotion object with name and description
   */
  speakEmotionDescription(emotion) {
    if (!emotion) return
    
    const text = `${emotion.name}. ${emotion.description}`
    this.speak(text)
  }

  /**
   * Speak quiz question
   * @param {Object} emotion - Current emotion to identify
   */
  speakQuizQuestion(emotion) {
    if (!emotion) return
    
    const text = `Quelle émotion voyez-vous ? L'image montre une expression de ${emotion.name}.`
    this.speak(text)
  }

  /**
   * Speak quiz result
   * @param {boolean} isCorrect - Whether answer was correct
   * @param {string} correctAnswer - Name of correct emotion
   * @param {string} selectedAnswer - Name of selected emotion
   */
  speakQuizResult(isCorrect, correctAnswer, selectedAnswer) {
    let text
    if (isCorrect) {
      text = `Correct ! La réponse était bien ${correctAnswer}.`
    } else {
      text = `Incorrect. Vous avez choisi ${selectedAnswer}, mais la bonne réponse était ${correctAnswer}.`
    }
    this.speak(text)
  }

  /**
   * Cleanup audio resources
   */
  dispose() {
    this.stopSpeech()
    
    if (this.synth) {
      this.synth.dispose()
    }
    
    if (this.reverb) {
      this.reverb.dispose()
    }
    
    if (this.isInitialized) {
      Tone.getDestination().dispose()
    }
  }
}

// Create singleton instance
const audioSystem = new AudioSystem()

export default audioSystem

/**
 * Hook for using audio system in React components
 */
export const useAudioSystem = () => {
  return {
    initialize: () => audioSystem.initialize(),
    playSound: (soundName) => audioSystem.playSound(soundName),
    speak: (text, options) => audioSystem.speak(text, options),
    stopSpeech: () => audioSystem.stopSpeech(),
    setEnabled: (enabled) => audioSystem.setEnabled(enabled),
    setVolume: (volume) => audioSystem.setVolume(volume),
    playQuizFeedback: (isCorrect, streak) => audioSystem.playQuizFeedback(isCorrect, streak),
    playNavigation: () => audioSystem.playNavigation(),
    playNotification: () => audioSystem.playNotification(),
    speakEmotionDescription: (emotion) => audioSystem.speakEmotionDescription(emotion),
    speakQuizQuestion: (emotion) => audioSystem.speakQuizQuestion(emotion),
    speakQuizResult: (isCorrect, correct, selected) => audioSystem.speakQuizResult(isCorrect, correct, selected)
  }
}