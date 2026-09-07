export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0d9488',
          dark: '#0f766e',
          soft: '#f0fdfa',
          mid: '#99f6e4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
