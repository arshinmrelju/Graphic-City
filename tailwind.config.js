/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.html',
    './public/js/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'core': {
          'black': '#0A0A0A',
          'white': '#FFFFFF',
        },
        'ink': '#1A1A2E',
        'stone': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          150: '#EEEEEE',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1F1F1F',
          900: '#171717',
          950: '#0A0A0A',
        },
        'signal': {
          'blue': '#0066FF',
          'blue-hover': '#0052CC',
          'green': '#059669',
          'red': '#DC2626',
          'amber': '#F59E0B',
        },
      },
      fontFamily: {
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '5rem', letterSpacing: '-0.02em' }],
        'display-sm': ['3.5rem', { lineHeight: '4rem', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
        'h2': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.01em' }],
        'h3': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
        'h4': ['1.375rem', { lineHeight: '1.875rem' }],
      },
      letterSpacing: {
        'tight': '-0.02em',
        'tighter': '-0.03em',
        'wide': '0.03em',
        'wider': '0.06em',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'sm': '0 2px 4px rgba(0,0,0,0.05)',
        'md': '0 4px 12px rgba(0,0,0,0.06)',
        'lg': '0 8px 24px rgba(0,0,0,0.08)',
        'xl': '0 16px 48px rgba(0,0,0,0.10)',
        'soft': '0 20px 60px rgba(0,0,0,0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'film-judder': 'filmJudder 8s linear infinite',
        'drift': 'drift 12s ease-in-out infinite',
        'branch': 'branch 2s ease-out forwards',
        'reveal-up': 'revealUp 0.8s cubic-bezier(0.25,0.01,0.25,1) forwards',
        'reveal-down': 'revealDown 0.8s cubic-bezier(0.25,0.01,0.25,1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'spin-slow': 'spin 12s linear infinite',
        'loader-mark': 'loaderMark 1.2s ease-out forwards',
        'loader-fade': 'loaderFade 0.4s ease-out forwards',
        'draw-line': 'drawLine 1.2s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        filmJudder: {
          '0%': { transform: 'translateY(0) scale(1.001)' },
          '25%': { transform: 'translateY(-1px) scale(1.002)' },
          '50%': { transform: 'translateY(1px) scale(0.999)' },
          '75%': { transform: 'translateY(-0.5px) scale(1.001)' },
          '100%': { transform: 'translateY(0) scale(1.001)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(8px, -6px) rotate(1deg)' },
          '50%': { transform: 'translate(-4px, 8px) rotate(-0.5deg)' },
          '75%': { transform: 'translate(6px, -4px) rotate(0.5deg)' },
        },
        branch: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        loaderMark: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        loaderFade: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0', visibility: 'hidden' },
        },
        drawLine: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
    },
  },
  plugins: [],
}
