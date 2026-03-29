/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#405de6", 50: "#eef0fd", 100: "#d5dafc", 500: "#405de6", 600: "#3451c9", 700: "#2b44a6" },
        accent: { DEFAULT: "#e1306c", 50: "#fde8ef", 500: "#e1306c", 600: "#c4285e" },
        dark: { bg: "#000000", surface: "#111111", border: "#222222", card: "#1a1a1a" }
      },
      fontFamily: { sans: ["DM Sans", "system-ui", "sans-serif"] },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-once": "pulse 0.6s ease-in-out 1",
        "story-fill": "storyFill 5s linear forwards"
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        storyFill: { from: { width: "0%" }, to: { width: "100%" } }
      }
    }
  },
  plugins: []
};
