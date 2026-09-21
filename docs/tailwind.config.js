/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0d0d0d',
        card: '#121212',
        cream: 'rgb(233, 221, 200)',    // 书写阅读底色
        ink: '#1a1a1a',                  // 字体加深
      }
    },
  },
  plugins: [],
}
