module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6fbff',
          100: '#c9f7ff',
          500: '#00d2ff',
          700: '#00a3d9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      keyframes: {
        'pulse-slow': {
          '0%,100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.05)', opacity: 0.85 }
        }
      },
      animation: {
        'pulse-slow': 'pulse-slow 2.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
