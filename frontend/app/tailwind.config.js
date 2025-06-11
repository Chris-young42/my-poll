/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
       primary:"#06b6d4",
       secondary:"#EF863E",
    },
    backgroundImage:{
      'auth-bg-img': "url('/src/assets/images/auth-img.png')",
    }
  },
  plugins: [],
}

}