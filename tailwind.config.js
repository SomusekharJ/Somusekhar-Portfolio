/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        fog: 'rgb(var(--c-fog) / <alpha-value>)',
        mist: 'rgb(var(--c-mist) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        char: 'rgb(var(--c-char) / <alpha-value>)',
        blood: {
          DEFAULT: 'rgb(var(--c-blood) / <alpha-value>)',
          dark: 'rgb(var(--c-blood-dark) / <alpha-value>)',
          light: 'rgb(var(--c-blood-light) / <alpha-value>)',
        },
        glass: {
          cyan: 'rgb(var(--c-glass-cyan) / <alpha-value>)',
          violet: 'rgb(var(--c-glass-violet) / <alpha-value>)',
          pink: 'rgb(var(--c-glass-pink) / <alpha-value>)',
          blue: 'rgb(var(--c-glass-blue) / <alpha-value>)',
        },
        thread: 'rgb(var(--c-thread) / <alpha-value>)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      boxShadow: {
        glass: '0 8px 32px -8px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.08)',
        glow: '0 0 40px -8px rgba(110,123,255,0.55)',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Arial Black', 'sans-serif'],
        serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.06em',
        widest2: '0.32em',
      },
    },
  },
  plugins: [],
}
