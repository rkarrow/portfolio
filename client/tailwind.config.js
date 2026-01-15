/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e6edff',
          500: '#667eea',
          600: '#5568d3',
          700: '#764ba2',
        },
      },
    },
  },
  plugins: [],
}
