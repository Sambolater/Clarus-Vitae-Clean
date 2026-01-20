/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    './base.js',
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off', // Next.js Link component handles this
    'react/react-in-jsx-scope': 'off',
    '@next/next/no-html-link-for-pages': 'off',
  },
};
