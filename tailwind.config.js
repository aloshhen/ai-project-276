export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        'cartoon': ['"Rubik Mono One"', 'cursive'],
        'handwritten': ['Neucha', 'cursive'],
      },
      colors: {
        cardboard: {
          300: '#D4A574',
          400: '#C49464',
          500: '#B48454',
          600: '#A47444',
        }
      }
    },
  },
  plugins: [],
}