/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8b5cf6",
          dark: "#7c3aed",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
