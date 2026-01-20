/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@clarus-vitae/config/tailwind/base')],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Tier-specific colors for property classifications
        tier: {
          1: '#1A365D', // Medical Longevity - deep authority
          2: '#234E52', // Integrated Wellness - balanced
          3: '#5B4B3A', // Luxury Destination - warm luxury
        },
      },
    },
  },
  plugins: [],
};
