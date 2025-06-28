# Inventaire des Émotions - Décodeur Facial

## Vue d'ensemble

Ce document présente l'inventaire complet de toutes les émotions implémentées dans l'application Décodeur Facial, avec leurs variantes d'intensité, détails graphiques, animations et niveaux de précision.

---

## Émotions de Niveau 1 (Émotions de Base)

### 1. Joie
- **ID**: `joie`
- **Catégorie**: Positive
- **Niveau**: 1 (Base)
- **Intensité par défaut**: Medium
- **Durée**: Soutenue
- **Degré de précision**: Élevé

#### Variantes d'intensité implémentées:
- ✅ **Joie standard** (`joie.svg`)
- ✅ **Joie légère** (`joie-mild.svg`) - Sourire subtil, rides d'expression douces
- ✅ **Joie intense** (`joie-intense.svg`) - Sourire éclatant, rides marquées, éclat dans les yeux

#### Détails graphiques SVG:
- **Standard**: Sourire authentique avec rides des yeux, expression équilibrée
- **Mild**: Gradients doux, sourire discret, lueur subtile dans les yeux
- **Intense**: Gradients vibrants, sourire radieux, effets de lumière, aura de bonheur

#### Indices faciaux clés:
- Yeux plissés avec rides de sourire (pattes d'oie)
- Coins de la bouche relevés, sourire authentique
- Sourcils légèrement relevés et détendus
- Joues remontées
- Front détendu

---

### 2. Tristesse
- **ID**: `tristesse`
- **Catégorie**: Négative
- **Niveau**: 1 (Base)
- **Intensité par défaut**: Medium
- **Durée**: Soutenue
- **Degré de précision**: Élevé

#### Variantes d'intensité implémentées:
- ✅ **Tristesse standard** (`tristesse.svg`)
- ✅ **Tristesse légère** (`tristesse-mild.svg`) - Mélancolie douce, regard pensif
- ✅ **Tristesse intense** (`tristesse-intense.svg`) - Chagrin profond, larmes, traits affaissés

#### Détails graphiques SVG:
- **Standard**: Expression mélancolique équilibrée
- **Mild**: Aura de mélancolie douce, cheveux légèrement ébouriffés, regard vers le bas
- **Intense**: Larmes multiples, traits très affaissés, aura de chagrin profond, effets de sanglots

#### Indices faciaux clés:
- Paupières tombantes, regard vers le bas
- Coins de la bouche abaissés
- Sourcils relevés vers l'intérieur
- Rides horizontales sur le front

---

### 3. Colère
- **ID**: `colère`
- **Catégorie**: Négative
- **Niveau**: 1 (Base)
- **Intensité par défaut**: High
- **Durée**: Brève
- **Degré de précision**: Élevé

#### Variantes d'intensité implémentées:
- ✅ **Colère standard** (`colere.svg`)
- ✅ **Colère légère** (`colere-mild.svg`) - Irritation contrôlée, tension subtile
- ✅ **Colère intense** (`colere-intense.svg`) - Rage explosive, traits déformés, effets visuels dramatiques

#### Détails graphiques SVG:
- **Standard**: Expression de colère modérée
- **Mild**: Aura d'irritation légère, sourcils légèrement froncés, tension subtile
- **Intense**: Cheveux ébouriffés, veines visibles, yeux injectés de sang, vapeur des oreilles, effets d'explosion

#### Indices faciaux clés:
- Regard fixe et intense, paupières tendues
- Lèvres serrées ou bouche ouverte
- Sourcils froncés et abaissés
- Rides verticales entre les sourcils

---

### 4. Peur
- **ID**: `peur`
- **Catégorie**: Négative
- **Niveau**: 1 (Base)
- **Intensité par défaut**: High
- **Durée**: Brève
- **Degré de précision**: Élevé

#### Variantes d'intensité implémentées:
- ✅ **Peur standard** (`peur.svg`)
- ✅ **Peur légère** (`peur-mild.svg`) - Inquiétude subtile, nervosité
- ✅ **Peur intense** (`peur-intense.svg`) - Terreur absolue, traits extrêmes, effets de panique

#### Détails graphiques SVG:
- **Standard**: Expression de peur modérée
- **Mild**: Aura d'inquiétude, cheveux légèrement ébouriffés, regard nerveux
- **Intense**: Cheveux dressés, yeux exorbités, bouche béante, gouttes de sueur froide, effets de choc

#### Indices faciaux clés:
- Yeux écarquillés, pupilles dilatées
- Bouche légèrement ouverte
- Sourcils relevés et rapprochés
- Front plissé horizontalement

---

### 5. Surprise
- **ID**: `surprise`
- **Catégorie**: Neutre
- **Niveau**: 1 (Base)
- **Intensité par défaut**: High
- **Durée**: Très brève
- **Degré de précision**: Élevé

#### Variantes d'intensité implémentées:
- ✅ **Surprise standard** (`surprise.svg`)
- ✅ **Surprise légère** (`surprise-mild.svg`) - Étonnement doux, curiosité
- ✅ **Surprise intense** (`surprise-intense.svg`) - Choc total, traits exagérés, effets explosifs

#### Détails graphiques SVG:
- **Standard**: Expression de surprise équilibrée
- **Mild**: Aura de curiosité, cheveux légèrement soulevés, expression d'émerveillement
- **Intense**: Cheveux projetés en arrière, yeux énormes, bouche béante, effets d'explosion de surprise

#### Indices faciaux clés:
- Yeux grands ouverts
- Bouche ouverte en forme de O
- Sourcils très relevés
- Rides horizontales marquées

---

### 6. Dégoût
- **ID**: `dégoût`
- **Catégorie**: Négative
- **Niveau**: 1 (Base)
- **Intensité par défaut**: Medium
- **Durée**: Brève
- **Degré de précision**: Élevé

#### Variantes d'intensité implémentées:
- ✅ **Dégoût standard** (`degout.svg`)
- ✅ **Dégoût léger** (`degout-mild.svg`) - Distaste subtil, répulsion modérée
- ✅ **Dégoût intense** (`degout-intense.svg`) - Révulsion extrême, nausée, traits déformés

#### Détails graphiques SVG:
- **Standard**: Expression de dégoût modérée
- **Mild**: Aura de distaste, nez légèrement plissé, expression asymétrique subtile
- **Intense**: Nez extrêmement plissé, expression de nausée, langue visible, effets de révulsion

#### Indices faciaux clés:
- Paupières légèrement plissées
- Lèvre supérieure relevée, asymétrique
- Nez plissé
- Joues remontées d'un côté

---

## Émotions de Niveau 2 (Émotions Secondaires)

### 7. Anxiété
- **ID**: `anxiété`
- **Catégorie**: Négative
- **Niveau**: 2 (Secondaire)
- **Intensité par défaut**: Low
- **Durée**: Soutenue
- **Degré de précision**: Moyen-Élevé

#### Variantes d'intensité implémentées:
- ✅ **Anxiété standard** (`anxiete.svg`)
- ✅ **Anxiété légère** (`anxiete-mild.svg`) - Inquiétude subtile, nervosité discrète
- ✅ **Anxiété intense** (`anxiete-intense.svg`) - Panique, stress extrême, traits tendus

#### Détails graphiques SVG:
- **Standard**: Expression d'anxiété modérée
- **Mild**: Aura d'inquiétude, cheveux légèrement ébouriffés, tension subtile
- **Intense**: Cheveux très ébouriffés, yeux dilatés, gouttes de stress, effets de panique

#### Indices faciaux clés:
- Regard fuyant, clignements fréquents
- Lèvres serrées ou mordillées
- Sourcils légèrement froncés
- Micro-mouvements nerveux

---

### 8. Fierté
- **ID**: `fierté`
- **Catégorie**: Positive
- **Niveau**: 2 (Secondaire)
- **Intensité par défaut**: Medium
- **Durée**: Soutenue
- **Degré de précision**: Moyen

#### Variantes d'intensité implémentées:
- ✅ **Fierté standard** (`fierte.svg`)
- ❌ **Fierté légère** (non implémentée)
- ❌ **Fierté intense** (non implémentée)

#### Détails graphiques SVG:
- **Standard**: Expression de satisfaction personnelle, menton relevé

#### Indices faciaux clés:
- Regard confiant et direct
- Sourire subtil et asymétrique
- Menton légèrement relevé
- Port de tête redressé

---

### 9. Gêne
- **ID**: `gêne`
- **Catégorie**: Négative
- **Niveau**: 2 (Secondaire)
- **Intensité par défaut**: Medium
- **Durée**: Brève
- **Degré de précision**: Moyen

#### Variantes d'intensité implémentées:
- ✅ **Gêne standard** (`gene.svg`)
- ❌ **Gêne légère** (non implémentée)
- ❌ **Gêne intense** (non implémentée)

#### Détails graphiques SVG:
- **Standard**: Expression d'embarras, regard fuyant

#### Indices faciaux clés:
- Regard fuyant vers le bas
- Sourire crispé ou grimace
- Rougissement possible
- Tête légèrement baissée

---

### 10. Jalousie
- **ID**: `jalousie`
- **Catégorie**: Négative
- **Niveau**: 2 (Secondaire)
- **Intensité par défaut**: Medium
- **Durée**: Soutenue
- **Degré de précision**: Moyen

#### Variantes d'intensité implémentées:
- ✅ **Jalousie standard** (`jalousie.svg`)
- ❌ **Jalousie légère** (non implémentée)
- ❌ **Jalousie intense** (non implémentée)

#### Détails graphiques SVG:
- **Standard**: Expression d'envie, regard en coin

#### Indices faciaux clés:
- Regard en coin, plissé
- Lèvres pincées
- Sourcils légèrement froncés
- Expression tendue et surveillante

---

### 11. Mépris
- **ID**: `mépris`
- **Catégorie**: Négative
- **Niveau**: 2 (Secondaire)
- **Intensité par défaut**: Medium
- **Durée**: Soutenue
- **Degré de précision**: Moyen-Élevé

#### Variantes d'intensité implémentées:
- ✅ **Mépris standard** (`mepris.svg`)
- ❌ **Mépris léger** (non implémentée)
- ❌ **Mépris intense** (non implémentée)

#### Détails graphiques SVG:
- **Standard**: Expression de dédain, asymétrie marquée

#### Indices faciaux clés:
- Regard de haut
- Coin de la bouche relevé d'un seul côté
- Menton relevé
- Asymétrie marquée

---

### 12. Confusion
- **ID**: `confusion`
- **Catégorie**: Neutre
- **Niveau**: 2 (Secondaire)
- **Intensité par défaut**: Low
- **Durée**: Brève
- **Degré de précision**: Moyen

#### Variantes d'intensité implémentées:
- ✅ **Confusion standard** (`confusion.svg`)
- ❌ **Confusion légère** (non implémentée)
- ❌ **Confusion intense** (non implémentée)

#### Détails graphiques SVG:
- **Standard**: Expression de perplexité, tête inclinée

#### Indices faciaux clés:
- Regard perdu, clignements
- Bouche légèrement ouverte
- Sourcils froncés asymétriques
- Tête légèrement inclinée

---

## Statistiques d'implémentation

### Variantes d'intensité par émotion:
- **Complètement implémentées** (3 variantes): 7 émotions
  - Joie, Tristesse, Colère, Peur, Surprise, Dégoût, Anxiété
- **Partiellement implémentées** (1 variante): 5 émotions
  - Fierté, Gêne, Jalousie, Mépris, Confusion

### Répartition par niveau:
- **Niveau 1**: 6 émotions (100% avec variantes d'intensité)
- **Niveau 2**: 6 émotions (17% avec variantes d'intensité)

### Répartition par catégorie:
- **Positives**: 2 émotions (Joie, Fierté)
- **Négatives**: 8 émotions (Tristesse, Colère, Peur, Dégoût, Anxiété, Gêne, Jalousie, Mépris)
- **Neutres**: 2 émotions (Surprise, Confusion)

---

## Émotions supplémentaires proposées

### Niveau 2 (Émotions Secondaires)

#### 13. Espoir
- **Catégorie**: Positive
- **Description**: Expression d'optimisme et d'attente positive
- **Indices faciaux**: Regard vers le haut, sourire subtil, expression rêveuse
- **Justification**: Complète la gamme des émotions positives complexes

#### 14. Nostalgie
- **Catégorie**: Neutre-Positive
- **Description**: Expression de mélancolie douce liée aux souvenirs
- **Indices faciaux**: Regard distant, sourire mélancolique, expression contemplative
- **Justification**: Émotion complexe importante pour la reconnaissance émotionnelle

#### 15. Frustration
- **Catégorie**: Négative
- **Description**: Expression d'irritation face à un obstacle
- **Indices faciaux**: Sourcils froncés, bouche serrée, tension du mâchoire
- **Justification**: Différente de la colère, plus contrôlée et ciblée

#### 16. Soulagement
- **Catégorie**: Positive
- **Description**: Expression de détente après une tension
- **Indices faciaux**: Expiration visible, détente des traits, sourire de libération
- **Justification**: Émotion de transition importante

### Niveau 3 (Émotions Complexes)

#### 17. Culpabilité
- **Catégorie**: Négative
- **Description**: Expression de remords et de responsabilité
- **Indices faciaux**: Regard fuyant vers le bas, expression contractée, tension
- **Justification**: Émotion sociale complexe importante

#### 18. Admiration
- **Catégorie**: Positive
- **Description**: Expression de respect et d'appréciation
- **Indices faciaux**: Regard dirigé vers l'objet d'admiration, expression ouverte
- **Justification**: Émotion sociale positive complexe

#### 19. Indignation
- **Catégorie**: Négative
- **Description**: Expression de colère morale justifiée
- **Indices faciaux**: Sourcils froncés, regard intense, expression de justice
- **Justification**: Combine colère et sens moral

#### 20. Émerveillement
- **Catégorie**: Positive
- **Description**: Expression de fascination et d'admiration
- **Indices faciaux**: Yeux écarquillés positifs, bouche légèrement ouverte, expression béate
- **Justification**: Différent de la surprise, plus contemplatif

---

## Recommandations d'implémentation

### Priorité 1: Compléter les variantes d'intensité
1. **Fierté**: Ajouter variantes mild et intense
2. **Gêne**: Ajouter variantes mild et intense
3. **Jalousie**: Ajouter variantes mild et intense
4. **Mépris**: Ajouter variantes mild et intense
5. **Confusion**: Ajouter variantes mild et intense

### Priorité 2: Nouvelles émotions Niveau 2
1. **Espoir**: Émotion positive manquante
2. **Frustration**: Complément à la colère
3. **Soulagement**: Émotion de transition
4. **Nostalgie**: Émotion complexe neutre

### Priorité 3: Émotions Niveau 3
1. **Culpabilité**: Émotion sociale importante
2. **Admiration**: Émotion positive sociale
3. **Indignation**: Colère morale
4. **Émerveillement**: Surprise positive prolongée

---

## Améliorations techniques suggérées

### Animations SVG
- Ajouter des micro-animations pour les expressions subtiles
- Implémenter des transitions fluides entre intensités
- Créer des effets de particules pour les émotions intenses

### Détails graphiques
- Améliorer les gradients pour plus de réalisme
- Ajouter des effets de lumière dynamiques
- Implémenter des variations de couleur selon l'intensité

### Précision de reconnaissance
- Développer des algorithmes de détection des micro-expressions
- Améliorer la reconnaissance des émotions asymétriques
- Intégrer la détection des émotions mixtes

---

*Dernière mise à jour: Décembre 2024*