import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        guia: {
          bg: "#F7F9FB",
          panel: "#FFFFFF",
          ink: "#16324F",
          blue: "#2E6F9E",
          blueDark: "#1E4C6E",
          green: "#3F9142",
          sand: "#E7EEF3",
        },
      },
      fontFamily: {
        display: ["'Atkinson Hyperlegible'", "system-ui", "sans-serif"],
        body: ["'Atkinson Hyperlegible'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
