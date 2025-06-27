/**
 * Emotion database with facial cues, descriptions, and media information
 * This serves as the main data source for the application
 */

export const emotionDatabase = {
  // Level 1: Basic emotions
  joie: {
    id: 'joie',
    name: 'Joie',
    level: 1,
    category: 'positive',
    description: 'Expression de bonheur et de satisfaction',
    facialCues: {
      eyes: 'Yeux plissés avec rides de sourire (pattes d\'oie)',
      mouth: 'Coins de la bouche relevés, sourire authentique',
      eyebrows: 'Sourcils légèrement relevés et détendus',
      cheeks: 'Joues remontées',
      forehead: 'Front détendu'
    },
    keyIndicators: [
      'Sourire symétrique',
      'Rides autour des yeux',
      'Expression globale détendue'
    ],
    commonMistakes: [
      'Confondre avec un sourire forcé (sans rides des yeux)',
      'Ne pas remarquer l\'asymétrie dans les faux sourires'
    ],
    tips: 'Un vrai sourire de joie implique toujours les yeux - regardez les rides qui se forment aux coins.',
    intensity: 'medium',
    duration: 'sustained',
    imageUrl: '/images/emotions/joie.svg',
    videoUrl: '/videos/emotions/joie.mp4'
  },

  tristesse: {
    id: 'tristesse',
    name: 'Tristesse',
    level: 1,
    category: 'negative',
    description: 'Expression de chagrin et de mélancolie',
    facialCues: {
      eyes: 'Paupières tombantes, regard vers le bas',
      mouth: 'Coins de la bouche abaissés',
      eyebrows: 'Sourcils relevés vers l\'intérieur',
      forehead: 'Rides horizontales sur le front'
    },
    keyIndicators: [
      'Sourcils en forme de V inversé',
      'Bouche tournée vers le bas',
      'Regard fuyant ou vers le bas'
    ],
    commonMistakes: [
      'Confondre avec la fatigue',
      'Ne pas voir la subtilité dans les sourcils'
    ],
    tips: 'La tristesse se reconnaît surtout par la position des sourcils et la direction du regard.',
    intensity: 'medium',
    duration: 'sustained',
    imageUrl: '/images/emotions/tristesse.svg',
    videoUrl: '/videos/emotions/tristesse.mp4'
  },

  colère: {
    id: 'colère',
    name: 'Colère',
    level: 1,
    category: 'negative',
    description: 'Expression d\'irritation et de frustration',
    facialCues: {
      eyes: 'Regard fixe et intense, paupières tendues',
      mouth: 'Lèvres serrées ou bouche ouverte',
      eyebrows: 'Sourcils froncés et abaissés',
      forehead: 'Rides verticales entre les sourcils'
    },
    keyIndicators: [
      'Sourcils froncés vers le centre',
      'Regard intense et direct',
      'Tension visible du visage'
    ],
    commonMistakes: [
      'Confondre avec la concentration',
      'Ne pas distinguer l\'intensité du regard'
    ],
    tips: 'La colère se caractérise par une tension générale du visage et un regard très direct.',
    intensity: 'high',
    duration: 'brief',
    imageUrl: '/images/emotions/colere.svg',
    videoUrl: '/videos/emotions/colere.mp4'
  },

  peur: {
    id: 'peur',
    name: 'Peur',
    level: 1,
    category: 'negative',
    description: 'Expression d\'anxiété et d\'appréhension',
    facialCues: {
      eyes: 'Yeux écarquillés, pupilles dilatées',
      mouth: 'Bouche légèrement ouverte',
      eyebrows: 'Sourcils relevés et rapprochés',
      forehead: 'Front plissé horizontalement'
    },
    keyIndicators: [
      'Yeux très ouverts',
      'Sourcils hauts et rapprochés',
      'Expression de surprise mélangée à l\'inquiétude'
    ],
    commonMistakes: [
      'Confondre avec la surprise pure',
      'Ne pas voir la tension dans les sourcils'
    ],
    tips: 'La peur combine des yeux écarquillés avec des sourcils tendus vers le haut.',
    intensity: 'high',
    duration: 'brief',
    imageUrl: '/images/emotions/peur.svg',
    videoUrl: '/videos/emotions/peur.mp4'
  },

  surprise: {
    id: 'surprise',
    name: 'Surprise',
    level: 1,
    category: 'neutral',
    description: 'Expression d\'étonnement et de surprise',
    facialCues: {
      eyes: 'Yeux grands ouverts',
      mouth: 'Bouche ouverte en forme de O',
      eyebrows: 'Sourcils très relevés',
      forehead: 'Rides horizontales marquées'
    },
    keyIndicators: [
      'Sourcils très hauts',
      'Yeux écarquillés sans tension',
      'Bouche ouverte'
    ],
    commonMistakes: [
      'Confondre avec la peur',
      'Ne pas distinguer la durée (surprise = très brève)'
    ],
    tips: 'La surprise est très brève et symétrique, sans la tension de la peur.',
    intensity: 'high',
    duration: 'very_brief',
    imageUrl: '/images/emotions/surprise.svg',
    videoUrl: '/videos/emotions/surprise.mp4'
  },

  dégoût: {
    id: 'dégoût',
    name: 'Dégoût',
    level: 1,
    category: 'negative',
    description: 'Expression de répulsion et d\'aversion',
    facialCues: {
      eyes: 'Paupières légèrement plissées',
      mouth: 'Lèvre supérieure relevée, asymétrique',
      nose: 'Nez plissé',
      cheeks: 'Joues remontées d\'un côté'
    },
    keyIndicators: [
      'Nez plissé',
      'Lèvre supérieure relevée',
      'Expression souvent asymétrique'
    ],
    commonMistakes: [
      'Confondre avec un sourire moqueur',
      'Ne pas voir l\'asymétrie caractéristique'
    ],
    tips: 'Le dégoût implique toujours le nez et est souvent asymétrique.',
    intensity: 'medium',
    duration: 'brief',
    imageUrl: '/images/emotions/degout.svg',
    videoUrl: '/videos/emotions/degout.mp4'
  },

  // Level 2: Secondary emotions
  anxiété: {
    id: 'anxiété',
    name: 'Anxiété',
    level: 2,
    category: 'negative',
    description: 'Expression d\'inquiétude et de nervosité',
    facialCues: {
      eyes: 'Regard fuyant, clignements fréquents',
      mouth: 'Lèvres serrées ou mordillées',
      eyebrows: 'Sourcils légèrement froncés',
      general: 'Micro-mouvements nerveux'
    },
    keyIndicators: [
      'Évitement du regard',
      'Tension subtile',
      'Mouvements répétitifs'
    ],
    commonMistakes: [
      'Confondre avec la timidité',
      'Ne pas voir les micro-expressions'
    ],
    tips: 'L\'anxiété se manifeste par des signaux subtils et répétitifs.',
    intensity: 'low',
    duration: 'sustained',
    imageUrl: '/images/emotions/anxiete.svg',
    videoUrl: '/videos/emotions/anxiete.mp4'
  },

  fierté: {
    id: 'fierté',
    name: 'Fierté',
    level: 2,
    category: 'positive',
    description: 'Expression de satisfaction personnelle',
    facialCues: {
      eyes: 'Regard confiant et direct',
      mouth: 'Sourire subtil et asymétrique',
      head: 'Menton légèrement relevé',
      posture: 'Port de tête redressé'
    },
    keyIndicators: [
      'Menton relevé',
      'Sourire de satisfaction',
      'Regard assuré'
    ],
    commonMistakes: [
      'Confondre avec l\'arrogance',
      'Ne pas voir la subtilité du sourire'
    ],
    tips: 'La fierté combine un sourire discret avec une posture redressée.',
    intensity: 'medium',
    duration: 'sustained',
    imageUrl: '/images/emotions/fierte.svg',
    videoUrl: '/videos/emotions/fierte.mp4'
  },

  gêne: {
    id: 'gêne',
    name: 'Gêne',
    level: 2,
    category: 'negative',
    description: 'Expression d\'embarras et de malaise',
    facialCues: {
      eyes: 'Regard fuyant vers le bas',
      mouth: 'Sourire crispé ou grimace',
      cheeks: 'Rougissement possible',
      head: 'Tête légèrement baissée'
    },
    keyIndicators: [
      'Évitement du contact visuel',
      'Sourire forcé',
      'Rougissement'
    ],
    commonMistakes: [
      'Confondre avec la timidité',
      'Ne pas voir le sourire forcé'
    ],
    tips: 'La gêne mélange évitement du regard et sourire inconfortable.',
    intensity: 'medium',
    duration: 'brief',
    imageUrl: '/images/emotions/gene.svg',
    videoUrl: '/videos/emotions/gene.mp4'
  },

  jalousie: {
    id: 'jalousie',
    name: 'Jalousie',
    level: 2,
    category: 'negative',
    description: 'Expression d\'envie et de ressentiment',
    facialCues: {
      eyes: 'Regard en coin, plissé',
      mouth: 'Lèvres pincées',
      eyebrows: 'Sourcils légèrement froncés',
      general: 'Expression tendue et surveillante'
    },
    keyIndicators: [
      'Regard en biais',
      'Expression tendue',
      'Surveillance discrète'
    ],
    commonMistakes: [
      'Confondre avec la suspicion',
      'Ne pas voir la direction du regard'
    ],
    tips: 'La jalousie se caractérise par un regard en coin et une tension faciale.',
    intensity: 'medium',
    duration: 'sustained',
    imageUrl: '/images/emotions/jalousie.svg',
    videoUrl: '/videos/emotions/jalousie.mp4'
  },

  mépris: {
    id: 'mépris',
    name: 'Mépris',
    level: 2,
    category: 'negative',
    description: 'Expression de dédain et de supériorité',
    facialCues: {
      eyes: 'Regard de haut',
      mouth: 'Coin de la bouche relevé d\'un seul côté',
      head: 'Menton relevé',
      general: 'Asymétrie marquée'
    },
    keyIndicators: [
      'Sourire asymétrique',
      'Regard condescendant',
      'Expression unilatérale'
    ],
    commonMistakes: [
      'Confondre avec le dégoût',
      'Ne pas voir l\'asymétrie'
    ],
    tips: 'Le mépris est toujours asymétrique, avec un seul coin de bouche relevé.',
    intensity: 'medium',
    duration: 'sustained',
    imageUrl: '/images/emotions/mepris.svg',
    videoUrl: '/videos/emotions/mepris.mp4'
  },

  confusion: {
    id: 'confusion',
    name: 'Confusion',
    level: 2,
    category: 'neutral',
    description: 'Expression de perplexité et d\'incompréhension',
    facialCues: {
      eyes: 'Regard perdu, clignements',
      mouth: 'Bouche légèrement ouverte',
      eyebrows: 'Sourcils froncés asymétriques',
      head: 'Tête légèrement inclinée'
    },
    keyIndicators: [
      'Sourcils asymétriques',
      'Tête inclinée',
      'Regard interrogateur'
    ],
    commonMistakes: [
      'Confondre avec la concentration',
      'Ne pas voir l\'inclinaison de tête'
    ],
    tips: 'La confusion se reconnaît à l\'asymétrie des sourcils et l\'inclinaison de tête.',
    intensity: 'low',
    duration: 'brief',
    imageUrl: '/images/emotions/confusion.svg',
    videoUrl: '/videos/emotions/confusion.mp4'
  }
}

/**
 * Get emotions by difficulty level
 * @param {number} level - Difficulty level (1-3)
 * @returns {Array} Array of emotion objects
 */
export function getEmotionsByLevel(level) {
  return Object.values(emotionDatabase).filter(emotion => emotion.level === level)
}

/**
 * Get emotion by ID
 * @param {string} emotionId - Emotion identifier
 * @returns {Object|null} Emotion object or null if not found
 */
export function getEmotionById(emotionId) {
  return emotionDatabase[emotionId] || null
}

/**
 * Get all available emotions
 * @returns {Array} Array of all emotion objects
 */
export function getAllEmotions() {
  return Object.values(emotionDatabase)
}

/**
 * Get emotions by category
 * @param {string} category - Category (positive, negative, neutral)
 * @returns {Array} Array of emotion objects
 */
export function getEmotionsByCategory(category) {
  return Object.values(emotionDatabase).filter(emotion => emotion.category === category)
}