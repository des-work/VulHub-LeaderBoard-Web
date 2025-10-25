const { generateTailwindConfig } = require('./src/tokens/generate-tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      ...generateTailwindConfig().theme.extend,
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
};
