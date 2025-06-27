import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Switch } from '../components/ui/switch'
import AudioSettings from '../components/AudioSettings'
import useAppStore from '../store/useAppStore'
import { ArrowLeft, Settings as SettingsIcon, User, Palette, Accessibility } from 'lucide-react'

/**
 * Settings page component for managing user preferences
 */
const Settings = () => {
  const navigate = useNavigate()
  const { user, setUser, setUserPreferences, resetProgress } = useAppStore()
  
  /**
   * Handle user data changes (name, isAnonymous)
   * @param {Object} userData - Updated user data
   */
  const handleUserChange = (userData) => {
    setUser(userData)
  }
  
  /**
   * Handle preference changes
   * @param {Object} newPreferences - Updated preferences
   */
  const handlePreferenceChange = (newPreferences) => {
    setUserPreferences(newPreferences)
  }

  /**
   * Handle progress reset with confirmation
   */
  const handleResetProgress = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous vos progrès ? Cette action est irréversible.')) {
      resetProgress()
      alert('Vos progrès ont été réinitialisés.')
    }
  }

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
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <SettingsIcon className="h-8 w-8" />
                Paramètres
              </h1>
              <p className="text-muted-foreground">
                Personnalisez votre expérience d'apprentissage
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Mode anonyme</label>
                  <p className="text-xs text-muted-foreground">
                    Utiliser l'application sans créer de compte
                  </p>
                </div>
                <Switch
                  checked={user.isAnonymous}
                  onCheckedChange={(checked) => 
                    handleUserChange({ isAnonymous: checked })
                  }
                />
              </div>
              
              {!user.isAnonymous && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={user.name || ''}
                    onChange={(e) => handleUserChange({ name: e.target.value })}
                    placeholder="Entrez votre nom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Contraste élevé</label>
                  <p className="text-xs text-muted-foreground">
                    Améliore la lisibilité pour les malvoyants
                  </p>
                </div>
                <Switch
                  checked={user.preferences.highContrast}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange({ highContrast: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Réduction des animations</label>
                  <p className="text-xs text-muted-foreground">
                    Réduit les mouvements pour éviter les distractions
                  </p>
                </div>
                <Switch
                  checked={user.preferences.reducedMotion}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange({ reducedMotion: checked })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Taille de police</label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <Button
                      key={size}
                      variant={user.preferences.fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePreferenceChange({ fontSize: size })}
                    >
                      {size === 'small' && 'Petite'}
                      {size === 'medium' && 'Moyenne'}
                      {size === 'large' && 'Grande'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audio Settings */}
        <AudioSettings showTestButtons={true} />

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gestion des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Réinitialiser les progrès</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Cette action supprimera définitivement tous vos progrès, statistiques et données d'apprentissage.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleResetProgress}
              >
                Réinitialiser les progrès
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Sauvegarde locale</h4>
              <p className="text-sm text-blue-700">
                Vos données sont automatiquement sauvegardées dans votre navigateur. 
                Elles ne sont pas partagées avec des serveurs externes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Info */}
        <Card>
          <CardHeader>
            <CardTitle>À propos de DécodeurFacial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                DécodeurFacial est une application d'apprentissage conçue pour aider 
                à développer les compétences de reconnaissance des émotions faciales.
              </p>
              <p>
                L'application utilise des techniques d'apprentissage interactif et 
                des retours audio pour une expérience d'apprentissage enrichie et accessible.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">Version 1.0.0</Badge>
                <Badge variant="outline">React + Vite</Badge>
                <Badge variant="outline">Tone.js Audio</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings