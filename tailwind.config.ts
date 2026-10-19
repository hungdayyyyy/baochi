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
        forbes: {
          dark: "#222222",
          black: "#000000",
          gray: "#333333",
          light: "#f4f6fa",
          border: "#e2e5eb",
          "border-dark": "#bdbdbd",
          muted: "#8c8c8c",
          red: "#d8361e",
          blue: "#004b87",
          navy: "#0a192f",
        },
      },
      fontFamily: {
        serif: ["var(--font-merriweather)", "Times New Roman", "Times", "serif"],
        sans: ["var(--font-work-sans)", "Work Sans", "Helvetica Neue", "Arial", "sans-serif"],
        headline: ["var(--font-merriweather)", "Times New Roman", "Georgia", "serif"],
      },
      screens: {
        xs: "390px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1440px",
      },
      maxWidth: {
        forbes: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
