/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // Quét thư mục components bên ngoài src
    "./pages/**/*.{js,ts,jsx,tsx}",      // Quét thư mục pages bên ngoài src
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'xbilliard-red': '#a80000',
        'xb-red': '#a80000',
        'xb-dark': '#1a1a1a',
      },
    },
  },
  plugins: [],
}