/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border-color)",
        input: "var(--input-color)",
        ring: "var(--ring-color)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        midnight: "var(--background)",
        indigo: "var(--indigo-color)",
        cyan: "var(--cyan-color)",
        neonPurple: "var(--purple-color)",
        metallicGold: "var(--gold-color)",
        obsidian: "var(--obsidian-color)",
        charcoal: "var(--charcoal-color)",
        electricTeal: "var(--teal-color)",
        softWhite: "var(--foreground)",
        primary: {
          DEFAULT: "var(--gold-color)",
          foreground: "var(--foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color)",
          foreground: "var(--foreground)",
        },
        card: {
          DEFAULT: "var(--card-color)",
          foreground: "var(--foreground)",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: "0 0 20px var(--glow-color)",
        cardGlow: "0 8px 32px var(--shadow-color)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, var(--cyber-g-1), var(--cyber-g-2), var(--cyber-g-3))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
