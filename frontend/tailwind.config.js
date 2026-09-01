/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#082f49',
        },
        teal: {
          500: '#14b8a6',
          600: '#0d9488',
        },
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['IRANSans', 'Vazir', 'system-ui', 'sans-serif'],
      },
      direction: {
        rtl: 'rtl',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
