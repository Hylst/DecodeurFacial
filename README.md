# Decodeur Facial

## Project Description

This project is a web application designed to help users learn about and recognize human emotions through facial cues. It includes learning modules, quizzes, and statistical tracking of user progress.

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd DecodeurFacial
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

To run the application in development mode:

```bash
npm run dev
```

This will start the development server, and you can access the application at `http://localhost:5173/` (or the port indicated in your terminal).

## Project Structure

```
.gitignore
changelog.md
index.html
package-lock.json
package.json
postcss.config.js
public/
├── images/
│   ├── emotions/
│   └── placeholder-face.svg
src/
├── App.jsx
├── components/
│   ├── AudioSettings.jsx
│   ├── DifficultySelector.jsx
│   ├── EmotionCard.jsx
│   ├── EmotionHighlight.jsx
│   ├── ProgressIndicator.jsx
│   ├── ProgressStats.jsx
│   ├── QuizFeedback.jsx
│   └── ui/
├── data/
│   └── emotions.js
├── index.css
├── lib/
│   ├── audioSystem.js
│   └── utils.js
├── main.jsx
├── pages/
│   ├── Home.jsx
│   ├── Learning.jsx
│   ├── Quiz.jsx
│   ├── Settings.jsx
│   └── Stats.jsx
└── store/
    └── useAppStore.js
tailwind.config.js
vite.config.js
```