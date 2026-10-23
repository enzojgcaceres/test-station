import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F8F7',     // fondo de página
        ink: {
          DEFAULT: '#0E1B1A', // texto principal
          dim: '#5B6B69',     // texto secundario
        },
        line: '#DDE5E3',
        med: {
          50: '#EAF7F4',
          100: '#CDEDE6',
          400: '#2BB59A',
          500: '#139C82',
          600: '#0B7D69',
          900: '#073B33',
        },
        pulse: '#FF6B5E',     // acento para estados en vivo
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-display)', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,27,26,0.04), 0 8px 24px -12px rgba(14,27,26,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
