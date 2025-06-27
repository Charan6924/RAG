/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}', // optional if you ever add pages/
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}

