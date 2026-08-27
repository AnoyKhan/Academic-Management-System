/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaf8",
          100: "#d5f3ef",
          200: "#afe8de",
          300: "#7bd8cb",
          400: "#42c1b4",
          500: "#25a698",
          600: "#18877d",
          700: "#166d66",
          800: "#165754",
          900: "#164947",
        },
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Sora", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 28px -16px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};
