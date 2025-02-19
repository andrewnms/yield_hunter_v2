import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#EE2B47',
        secondary: '#FFFFE4',
      },
      backgroundColor: {
        'primary': '#EE2B47',
        'secondary': '#FFFFE4',
      },
      textColor: {
        'primary': '#EE2B47',
        'secondary': '#FFFFE4',
      },
    },
  },
  plugins: [],
} satisfies Config;
