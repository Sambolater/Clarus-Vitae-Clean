/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'clarus-navy': '#1A2B4A',
        'clarus-white': '#FAFBFC',
        'clarus-gold': '#C9A962',
        // Secondary Colors
        slate: '#64748B',
        stone: '#E8E6E3',
        'warm-gray': '#F5F5F4',
        // Functional Colors
        'verification-green': '#2D6A4F',
        'alert-amber': '#B45309',
        'error-red': '#DC2626',
        'success-green': '#16A34A',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Custom type scale matching brand guide
        'display-hero': ['72px', { lineHeight: '80px', fontWeight: '300' }],
        'display-h1': ['48px', { lineHeight: '1.2', fontWeight: '500' }],
        'display-h2': ['36px', { lineHeight: '1.25', fontWeight: '500' }],
        'display-h3': ['28px', { lineHeight: '1.3', fontWeight: '500' }],
        'body-large': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-default': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        label: ['11px', { lineHeight: '1.2', fontWeight: '500', letterSpacing: '0.01em' }],
        'index-score': ['64px', { lineHeight: '1', fontWeight: '400' }],
      },
      spacing: {
        // 8px base unit spacing scale
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        '2xl': '64px',
        '3xl': '96px',
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(26, 43, 74, 0.1), 0 1px 2px -1px rgba(26, 43, 74, 0.1)',
        'card-hover':
          '0 4px 6px -1px rgba(26, 43, 74, 0.1), 0 2px 4px -2px rgba(26, 43, 74, 0.1)',
      },
    },
  },
  plugins: [],
};
