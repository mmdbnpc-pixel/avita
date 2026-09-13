/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef1f8',
          100: '#d4d9ea',
          200: '#a8b3d5',
          300: '#7d8dc0',
          400: '#5167ab',
          500: '#3a4f8a',
          600: '#2a3d72',
          700: '#1a2b5e',
          800: '#0d1c4f',
          900: '#06184F',
          950: '#030d2a',
        },
        gold: {
          50: '#fbf7ec',
          100: '#f5ecd0',
          200: '#ebd9a1',
          300: '#e0c572',
          400: '#d4af37',
          500: '#c19b2c',
          600: '#a07d22',
          700: '#7e601b',
          800: '#5d4715',
          900: '#3d2e0e',
        },
        ivory: {
          50: '#fdfcfa',
          100: '#f8f6f1',
          200: '#f1ede4',
          300: '#e8e1d3',
          400: '#d4cab6',
          500: '#bfb39a',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'IranSansX', 'Tahoma', 'sans-serif'],
        serif: ['Vazirmatn', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.9rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'shimmer': 'shimmer 1.8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      boxShadow: {
        'soft': '0 2px 20px -4px rgba(6, 24, 79, 0.08)',
        'card': '0 4px 30px -6px rgba(6, 24, 79, 0.12)',
        'premium': '0 10px 50px -10px rgba(6, 24, 79, 0.2)',
        'gold': '0 4px 20px -4px rgba(212, 175, 55, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
