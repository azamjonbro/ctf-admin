/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B1020',
          card: '#131C35',
          primary: '#00FF88',
          secondary: '#00D4FF',
          accent: '#7C3AED',
          danger: '#FF4D4D',
          success: '#00FF88',
          text: '#E2E8F0',
          muted: '#64748B'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
