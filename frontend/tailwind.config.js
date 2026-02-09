/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";
import typography from "@tailwindcss/typography";
export default {
  darkMode: "class",
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        // Ucode AI Cyberpunk Dark Theme
        'ucode': {
          'dark': '#09090b',        // Main background
          'secondary': '#18181b',   // Cards/Secondary background
          'tertiary': '#27272a',    // Hover states
          'border': '#3f3f46',      // Borders (zinc-700)
          'accent': '#2563eb',      // Electric Blue primary accent
          'accent-hover': '#1d4ed8', // Darker blue for hover
          'violet': '#7c3aed',      // Violet accent alternative
          'violet-hover': '#6d28d9', // Darker violet for hover
        },
      },
    },
  },
};
