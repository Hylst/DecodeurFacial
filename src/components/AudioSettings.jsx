import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Slider } from './ui/slider'
import { Volume2, VolumeX, Mic, Play, Pause } from 'lucide-react'
import { useAudioSystem } from '../lib/audioSystem'
import useAppStore from '../store/useAppStore'

/**
 * AudioSettings component for managing audio preferences and testing
 * @param {Object} props - Component props
 * @param {boolean} props.showTestButtons - Whether to show audio test buttons
 */
const AudioSettings = ({ showTestButtons = true }) => {
  const { user, setUserPreferences } = useAppStore()
  const audioSystem = useAudioSystem()
  
  const [isInitialized, setIsInitialized] = useState(false)
  const [volume, setVolume] = useState(user.preferences.audioVolume || 70)
  const [audioEnabled, setAudioEnabled] = useState(user.preferences.audioEnabled || false)
  const [speechEnabled, setSpeechEnabled] = useState(user.preferences.speechEnabled || false)
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(user.preferences.soundEffectsEnabled || true)
  
  /**
   * Initialize audio system on first user interaction
   */
  const handleInitializeAudio = async () => {
    try {
      await audioSystem.initialize()
      setIsInitialized(true)
      audioSystem.playNotification()
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }

  /**
   * Update audio enabled preference
   * @param {boolean} enabled - Whether audio is enabled
   */
  const handleAudioEnabledChange = (enabled) => {
    setAudioEnabled(enabled)
    audioSystem.setEnabled(enabled)
    
    setUserPreferences({
      audioEnabled: enabled
    })
    
    if (enabled && !isInitialized) {
      handleInitializeAudio()
    }
  }

  /**
   * Update volume preference
   * @param {number[]} value - Volume value array from slider
   */
  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    setVolume(newVolume)
    audioSystem.setVolume(newVolume / 100)
    
    setUserPreferences({
      audioVolume: newVolume
    })
  }

  /**
   * Update speech enabled preference
   * @param {boolean} enabled - Whether speech is enabled
   */
  const handleSpeechEnabledChange = (enabled) => {
    setSpeechEnabled(enabled)
    
    setUserPreferences({
      speechEnabled: enabled
    })
    
    if (!enabled) {
      audioSystem.stopSpeech()
    }
  }

  /**
   * Update sound effects enabled preference
   * @param {boolean} enabled - Whether sound effects are enabled
   */
  const handleSoundEffectsEnabledChange = (enabled) => {
    setSoundEffectsEnabled(enabled)
    
    setUserPreferences({
      soundEffectsEnabled: enabled
    })
  }

  /**
   * Test different audio features
   */
  const testAudio = {
    correct: () => audioSystem.playQuizFeedback(true),
    incorrect: () => audioSystem.playQuizFeedback(false),
    success: () => audioSystem.playQuizFeedback(true, 5),
    click: () => audioSystem.playNavigation(),
    speech: () => audioSystem.speak('Ceci est un test de la synthèse vocale pour l\'application DécodeurFacial.')
  }

  // Update audio system when preferences change
  useEffect(() => {
    audioSystem.setEnabled(audioEnabled && (speechEnabled || soundEffectsEnabled))
    audioSystem.setVolume(volume / 100)
  }, [audioEnabled, speechEnabled, soundEffectsEnabled, volume])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {audioEnabled ? (
            <Volume2 className="h-5 w-5 text-green-600" />
          ) : (
            <VolumeX className="h-5 w-5 text-gray-400" />
          )}
          Paramètres Audio
          {!isInitialized && audioEnabled && (
            <Badge variant="outline" className="text-xs">
              Cliquez pour activer
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Audio Master Switch */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium">Audio activé</label>
            <p className="text-xs text-muted-foreground">
              Active les sons et la synthèse vocale
            </p>
          </div>
          <Switch
            checked={audioEnabled}
            onCheckedChange={handleAudioEnabledChange}
          />
        </div>

        {/* Initialize Audio Button */}
        {audioEnabled && !isInitialized && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">Activation requise</h4>
                <p className="text-sm text-blue-700">
                  Cliquez pour activer l'audio (requis par le navigateur)
                </p>
              </div>
              <Button
                onClick={handleInitializeAudio}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Activer
              </Button>
            </div>
          </div>
        )}

        {/* Volume Control */}
        {audioEnabled && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volume</label>
              <span className="text-sm text-muted-foreground">{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Speech Settings */}
        {audioEnabled && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Synthèse vocale
              </label>
              <p className="text-xs text-muted-foreground">
                Descriptions audio des émotions
              </p>
            </div>
            <Switch
              checked={speechEnabled}
              onCheckedChange={handleSpeechEnabledChange}
            />
          </div>
        )}

        {/* Sound Effects Settings */}
        {audioEnabled && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Effets sonores</label>
              <p className="text-xs text-muted-foreground">
                Sons de feedback pour les interactions
              </p>
            </div>
            <Switch
              checked={soundEffectsEnabled}
              onCheckedChange={handleSoundEffectsEnabledChange}
            />
          </div>
        )}

        {/* Test Audio Buttons */}
        {showTestButtons && audioEnabled && isInitialized && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Tester les sons</h4>
            <div className="grid grid-cols-2 gap-2">
              {soundEffectsEnabled && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testAudio.correct}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    ✓ Correct
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testAudio.incorrect}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    ✗ Incorrect
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testAudio.success}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    🎉 Succès
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testAudio.click}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    🔊 Clic
                  </Button>
                </>
              )}
              
              {speechEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testAudio.speech}
                  className="col-span-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Test Synthèse Vocale
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Audio Info */}
        {audioEnabled && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 L'audio améliore l'apprentissage en fournissant des retours sonores 
              et des descriptions vocales pour une meilleure accessibilité.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AudioSettings