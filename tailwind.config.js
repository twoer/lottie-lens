/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#dcfbf6',
          100: '#c1f7ed',
          300: '#7aefd6',
          500: '#00ddb3',
          600: '#00c4a0',
          700: '#009b80',
        },
      },
    },
  },
  plugins: [],
}
