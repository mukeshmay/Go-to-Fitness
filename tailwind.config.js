/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef6ff',
          100: '#d9ecff',
          200: '#bbdcfe',
          300: '#8ac4fd',
          400: '#51a3fa',
          500: '#2f7ff6',
          600: '#1a5feb',
          700: '#1549d9',
          800: '#173db0',
          900: '#19388b',
        },
        surface: {
          950: '#080c14',
          900: '#0d1117',
          800: '#161b22',
          700: '#21262d',
          600: '#30363d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
