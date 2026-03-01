/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neu-extruded': '9px 9px 16px rgb(163,177,198,0.6),-9px -9px 16px rgba(255,255,255,0.5)',
        'neu-extruded-hover':
          '12px 12px 20px rgb(163,177,198,0.7),-12px -12px 20px rgba(255,255,255,0.6)',
        'neu-extruded-sm': '5px 5px 10px rgb(163,177,198,0.6),-5px -5px 10px rgba(255,255,255,0.5)',
        'neu-inset':
          'inset 6px 6px 10px rgb(163,177,198,0.6),inset -6px -6px 10px rgba(255,255,255,0.5)',
      },
      borderRadius: {
        container: '32px',
      },
      colors: {
        background: 'oklch(0.92 0.008 240)',
        surface: 'oklch(0.92 0.008 240)',
        foreground: 'oklch(0.35 0.015 240)',
        'foreground-muted': 'oklch(0.52 0.012 240)',
        'foreground-subtle': 'oklch(0.72 0.010 240)',
        accent: 'oklch(0.58 0.20 280)',
        'accent-light': 'oklch(0.68 0.18 280)',
        'accent-secondary': 'oklch(0.68 0.10 190)',
      },
    },
  },
  plugins: [],
};
