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
        background: "#FAF7F2", // Warm paper
        foreground: "#111827", // Very dark gray for text
        primary: {
          DEFAULT: "#1B2A4A", // Deep Indigo
          light: "#2A3C64",
          dark: "#0F182B",
        },
        accent: {
          DEFAULT: "#C97B4A", // Terracotta / Ochre
          light: "#DE8F5D",
          dark: "#B06535",
        },
        success: {
          DEFAULT: "#234F35", // Deep Forest Green
          light: "#316B49",
        },
        danger: {
          DEFAULT: "#9E3A3A", // Muted Rust
          light: "#B84747",
        },
        border: "#E2DCD0", // Subtle border matching paper tone
        muted: "#F0EBE1",
        mutedForeground: "#6B7280",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)",
      },
    },
  },
  plugins: [],
};
export default config;
