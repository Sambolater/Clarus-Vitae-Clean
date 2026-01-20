/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@clarus-vitae/config/tailwind/base')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
