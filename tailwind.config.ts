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
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#36a5f7",
          500: "#0c87eb",
          600: "#026bc9",
          700: "#0355a3",
          800: "#074886",
          900: "#0c3d70",
          950: "#082649",
        },
        chineseRed: {
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
        },
        jade: {
          50: "#f0fdf9",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
        },
        slate: {
          850: "#152033",
          900: "#0f172a",
          950: "#090d16",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        chinese: ["'PingFang SC'", "'Microsoft YaHei'", "'Noto Sans SC'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
