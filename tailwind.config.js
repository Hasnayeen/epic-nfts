const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    "./index.html"
  ],
  mode: 'jit',
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        ...colors,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
