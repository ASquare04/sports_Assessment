/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bodyLight: '#ffffff', 
        bodyDark: '#000000',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
