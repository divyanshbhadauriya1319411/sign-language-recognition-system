import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          card: "var(--card-bg)",
        },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        border: "var(--border)",
        divider: "var(--divider)",

        /* Semantic Primary Color System */
        primary: {
          base: "var(--primary-base)",
          hover: "var(--primary-hover)",
          pressed: "var(--primary-pressed)",
          soft: "var(--primary-soft)",
          DEFAULT: "var(--primary-base)",
        },

        /* Semantic Secondary Color System */
        secondary: {
          base: "var(--secondary-base)",
          hover: "var(--secondary-hover)",
          soft: "var(--secondary-soft)",
          DEFAULT: "var(--secondary-base)",
        },

        /* Semantic Accent Color System (AI Specific) */
        accent: {
          base: "var(--accent-base)",
          hover: "var(--accent-hover)",
          soft: "var(--accent-soft)",
          DEFAULT: "var(--accent-base)",
        },

        /* Semantic Status Colors */
        success: {
          base: "var(--success-base)",
          hover: "var(--success-hover)",
          soft: "var(--success-soft)",
          DEFAULT: "var(--success-base)",
        },
        warning: {
          base: "var(--warning-base)",
          hover: "var(--warning-hover)",
          soft: "var(--warning-soft)",
          DEFAULT: "var(--warning-base)",
        },
        error: {
          base: "var(--error-base)",
          hover: "var(--error-hover)",
          soft: "var(--error-soft)",
          DEFAULT: "var(--error-base)",
        },
        info: {
          base: "var(--info-base)",
          soft: "var(--info-soft)",
          DEFAULT: "var(--info-base)",
        },

        /* Semantic Neutral Scale */
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["60px", { lineHeight: "72px", fontWeight: "700" }],
        "display-l": ["48px", { lineHeight: "56px", fontWeight: "700" }],
        h1: ["40px", { lineHeight: "48px", fontWeight: "700" }],
        h2: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        h3: ["28px", { lineHeight: "36px", fontWeight: "600" }],
        h4: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        h5: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        h6: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        small: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "18px", fontWeight: "500" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
        24: "96px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
      boxShadow: {
        none: "none",
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        lg: "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
        xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
        "2xl": "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
