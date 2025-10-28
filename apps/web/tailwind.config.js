const { createConfig } = require('@vulhub/config/tailwind/base');

/** @type {import('tailwindcss').Config} */
module.exports = createConfig({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions can go here
    },
  },
  // Ensure proper CSS generation
  corePlugins: {
    preflight: true,
  },
  // Add important to ensure styles override
  important: true,
});
