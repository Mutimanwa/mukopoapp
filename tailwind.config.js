/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Le bleu/noir de fond profond
        'muko-dark': '#0B131F', 
        // Le bleu légèrement plus clair pour les cartes et la sidebar
        'muko-card': '#111C2E', 
        // Les inputs et les lignes de séparation
        'muko-input': '#1A263B',
        // L'orange électrique pour les boutons et actions principales
        'muko-orange': '#FF6B2C', 
        // Statuts
        'muko-green': '#10B981',
        'muko-red': '#EF4444',
      },
      fontFamily: {
        // Une police sans-serif moderne comme 'Inter' ou 'Plus Jakarta Sans'
        sans: ['Inter', 'sans-serif'], 
        // Pour les petits textes de données de style "code" (ex: ID Employé, labels de formulaires)
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}