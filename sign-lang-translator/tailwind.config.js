/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#141218',
          dim: '#141218',
          bright: '#3b383e',
          lowest: '#0f0d13',
          low: '#1d1b20',
          base: '#211f24',
          high: '#2b292f',
          highest: '#36343a',
        },
        primary: {
          DEFAULT: '#cfbcff',
          container: '#6750a4',
          fixed: '#e9ddff',
          'fixed-dim': '#cfbcff',
          on: '#381e72',
          'on-container': '#e0d2ff',
          'on-fixed': '#22005d',
          'on-fixed-variant': '#4f378a',
          inverse: '#6750a4',
        },
        secondary: {
          DEFAULT: '#cdc0e9',
          container: '#4d4465',
          on: '#342b4b',
          'on-container': '#bfb2da',
        },
        tertiary: {
          DEFAULT: '#e7c365',
          container: '#c9a74d',
          on: '#3e2e00',
          'on-container': '#503d00',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
          on: '#690005',
          'on-container': '#ffdad6',
        },
        outline: {
          DEFAULT: '#948e9c',
          variant: '#494551',
        },
        cyan: '#00D2FF',
        neon: {
          cyan: '#00D2FF',
          purple: '#9D4EDD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        DEFAULT: '16px',
        md: '20px',
        lg: '40px',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-ring': 'glow-ring 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        'glow-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(0,210,255,0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0,210,255,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0,210,255,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,210,255,0.2)',
        'glow-cyan-md': '0 0 40px rgba(0,210,255,0.3)',
        'glow-purple': '0 0 20px rgba(157,78,221,0.2)',
        'glow-purple-md': '0 0 40px rgba(157,78,221,0.3)',
        'glass': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
