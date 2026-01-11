/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f4fb',
          100: '#cce9f7',
          200: '#99d3ef',
          300: '#66bde7',
          400: '#33a7df',
          500: '#308dc2', // Couleur principale
          600: '#2771a0',
          700: '#1d5578',
          800: '#143950',
          900: '#0a1c28',
        },
      },
    },
  },
  plugins: [],
}
