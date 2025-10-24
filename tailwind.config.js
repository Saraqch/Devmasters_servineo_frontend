module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], //  Roboto como fuente por defecto
        roboto: ['Roboto', 'sans-serif'], //  También disponible como font-roboto
      },
    },
  },
  plugins: [],
};