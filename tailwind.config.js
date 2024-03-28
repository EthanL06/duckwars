/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fredoka", "sans-serif"],
        mono: ["Rubik Mono One", "monospace"],
      },
      colors: {
        cell: "#E1F5F7",
        black: "#16555C",
      },
      screens: {
        xxs: "330px",
      },
    },
  },
  plugins: [],
};
