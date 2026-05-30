/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A2E",
        secondary: "#3A3A5C",
        accent: "#4A6FA5",
        surface: "#3A3A5C",
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
