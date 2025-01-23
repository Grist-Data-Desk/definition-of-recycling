/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        smog: "#f0f0f0",
        earth: "#3c3830",
      },
      fontFamily: {
        sans: "'Basis Grotesque', sans-serif",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  // important: "#scrolly-content",
};
