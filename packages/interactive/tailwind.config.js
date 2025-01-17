/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "'GT Super', serif",
      },
      fontSize: {
        annotation: ["20px", "32px"],
      },
    },
  },
  plugins: [],
};
