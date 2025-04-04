/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: 'class', // optional if using next-themes
  theme: {
    extend: {
      colors: {
        neonBlue: "#00f0ff",
        neonPink: "#ff00f0",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      const newUtilities = {
        // ".glow": {
        //   textShadow: "0 0 5px #00fff7, 0 0 10px #00fff7",
        // },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
