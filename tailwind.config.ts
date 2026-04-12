import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette — desert luxury
        sand: {
          50: "#FDFAF6",
          100: "#FAF7F2",
          200: "#F5EFE7",
          300: "#EDE3D6",
          400: "#E2D5C3",
          DEFAULT: "#F5EFE7",
        },
        dune: {
          100: "#EDE4D8",
          200: "#E4D8C9",
          300: "#D8C9B5",
          400: "#CDBCA4",
          DEFAULT: "#E4D8C9",
        },
        stone: {
          100: "#D8CCBE",
          200: "#C9BAA8",
          300: "#B8A792",
          400: "#A8977E",
          DEFAULT: "#C9BAA8",
        },
        clay: {
          100: "#C4A898",
          200: "#B89080",
          300: "#A87868",
          400: "#976050",
          DEFAULT: "#B89080",
        },
        linen: "#FAF7F2",
        smoke: "#ECE8E1",
        candle: "#D4956A",
        "warm-white": "#FDFAF6",
        espresso: {
          light: "#5C4A38",
          DEFAULT: "#3D2E22",
          deep: "#2A1F16",
        },
        taupe: {
          light: "#9B8F84",
          DEFAULT: "#7A6A5A",
          dark: "#5A4A3A",
        },
        mist: "#F0EBE3",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-lg": ["clamp(2rem, 4.5vw, 4rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.2" }],
        "display-sm": ["clamp(1.5rem, 2.5vw, 2.25rem)", { lineHeight: "1.25" }],
      },
      spacing: {
        "section": "clamp(5rem, 10vw, 9rem)",
        "section-sm": "clamp(3rem, 6vw, 5rem)",
        "gutter": "clamp(1.5rem, 5vw, 4rem)",
      },
      maxWidth: {
        prose: "68ch",
        "prose-wide": "80ch",
        "content": "1180px",
        "content-wide": "1400px",
      },
      letterSpacing: {
        "wider-sm": "0.06em",
        "widest-sm": "0.12em",
        "widest-md": "0.18em",
      },
      lineHeight: {
        "relaxed-serif": "1.65",
      },
      borderRadius: {
        "2xs": "2px",
        "xs": "4px",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "soft-drift": "softDrift 20s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        softDrift: {
          "0%, 100%": { transform: "translateY(0px) scale(1.0)" },
          "50%": { transform: "translateY(-8px) scale(1.01)" },
        },
      },
      transitionTimingFunction: {
        "gentle": "cubic-bezier(0.4, 0, 0.2, 1)",
        "drift": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
