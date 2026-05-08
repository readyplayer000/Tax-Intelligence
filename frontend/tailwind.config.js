/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0A0E17",
        foreground: "#F8FAFC",
        midnight: "#0A0E17",
        indigo: "#4F46E5",
        cyan: "#00E5FF",
        neonPurple: "#8B5CF6",
        metallicGold: "#D4AF37",
        obsidian: "#1a1f2b",
        charcoal: "#2a2f3b",
        electricTeal: "#00E5FF",
        softWhite: "#F8FAFC",
        primary: {
          DEFAULT: "#D4AF37",
          foreground: "#F8FAFC",
        },
        secondary: {
          DEFAULT: "rgba(255,255,255,0.05)",
          foreground: "#F8FAFC",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,217,255,0.6)",
        cardGlow: "0 8px 32px rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #4F46E5, #00D9FF, #8B5CF6)',
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
