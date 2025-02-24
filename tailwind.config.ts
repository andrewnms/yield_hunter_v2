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
        display: ['Yeager', 'var(--font-orbitron)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#134B42',    // Deep Teal
        secondary: '#CA763A',  // Amber Gold
        'primary-light': '#1d6b5e', // Lighter Deep Teal
        'secondary-light': '#e19c6c',  // Lighter Amber Gold
      },
      backgroundColor: {
        'primary': '#134B42',    // Deep Teal
        'secondary': '#CA763A',  // Amber Gold
        'primary-light': '#1d6b5e', // Lighter Deep Teal
        'secondary-light': '#e19c6c',  // Lighter Amber Gold
      },
      textColor: {
        'primary': '#134B42',    // Deep Teal
        'secondary': '#CA763A',  // Amber Gold
        'primary-light': '#1d6b5e', // Lighter Deep Teal
        'secondary-light': '#e19c6c',  // Lighter Amber Gold
      },
    },
  },
  plugins: [],
} satisfies Config;
