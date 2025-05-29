const { heroui } = require('@heroui/theme');
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [heroui()],
  content: [
    './src/components/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  darkMode: 'class',
};
