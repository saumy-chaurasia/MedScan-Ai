/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0F19',
          card: '#111827',
          elevated: '#1a2234',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          electric: '#00F2FE',
          glow: 'rgba(0, 242, 254, 0.25)',
        },
        brand: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
          electric: '#00F2FE',
          mint: '#10B981',
          amber: '#F59E0B',
          crimson: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'scan-laser': 'scan 2.2s ease-in-out infinite alternate',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '96%' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};

